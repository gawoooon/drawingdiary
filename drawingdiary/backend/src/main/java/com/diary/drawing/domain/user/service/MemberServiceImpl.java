package com.diary.drawing.domain.user.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;
import java.util.Random;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.diary.drawing.domain.email.EmailService;
import com.diary.drawing.domain.email.EmailVerificationService;
import com.diary.drawing.domain.user.domain.Member;
import com.diary.drawing.domain.user.dto.GetMemberDTO;
import com.diary.drawing.domain.user.dto.MemberDTO;
import com.diary.drawing.domain.user.dto.MemberJoinDTO;
import com.diary.drawing.domain.user.dto.PhoneDTO;
import com.diary.drawing.domain.user.dto.PhoneDTO.responseExistedDTO;
import com.diary.drawing.domain.user.dto.PhoneDTO.responseNewDTO;
import com.diary.drawing.domain.user.exception.MemberExceptionType;
import com.diary.drawing.domain.user.exception.MemberResponseException;
import com.diary.drawing.domain.user.repository.MemberRepository;
import com.diary.drawing.global.s3.S3Uploader;
import com.diary.drawing.global.util.SmsUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class MemberServiceImpl implements MemberService{

    // DB와 연결(의존성 주입)

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ValidateMemberService validateMemberService;
    private final SmsUtil smsUtil;
    private final SmsVerificationService smsVerificationService;
    private final S3Uploader s3Uploader;
    private final EmailService emailService;
    private final EmailVerificationService emailVerificationService;

    // 회원 가입 (예외처리 나중에)
    @Override
    public Member joinMember(MemberJoinDTO memberDTO) throws IOException {

        // 암호화
        String rawPassword = memberDTO.getPassword();
        String encPassword = bCryptPasswordEncoder.encode(rawPassword);
        

        // 생성
        Member member = Member.builder()
                .name(memberDTO.getName())
                .email(memberDTO.getEmail())
                .password(encPassword)
                .phoneNumber(memberDTO.getPhoneNumber())
                .birth(memberDTO.getBirth())
                .gender(memberDTO.getGender())
                .build();
        
        return memberRepository.save(member);
    }

    // 이메일로 멤버 찾기
    @Override
    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    // 아이디로 이메일 찾기
    @Override
    public String getEmailByMemberID(Long memberID) {
        return memberRepository.findEmailByMemberID(memberID);
    }


    @Override
    public GetMemberDTO getMember(Long memberID){
        Member targetMemeber = validateMemberService.validateMember(memberID);
        GetMemberDTO getMemberDTO = GetMemberDTO.builder()
            .memberID(targetMemeber.getMemberID())
            .name(targetMemeber.getName())
            .email(targetMemeber.getEmail())
            .birth(targetMemeber.getBirth())
            .gender(targetMemeber.getGender())
            .profileImage(targetMemeber.getProfileImage())  // 임시 url 넣기
            .phoneNumber(targetMemeber.getPhoneNumber())
            .build();
        return getMemberDTO;
    }

    @Override
    public ResponseEntity<Boolean> validatePassword(Long memberID, MemberDTO.passwordCheck passwordDTO){
        Member targetMember = validateMemberService.validateMember(memberID);
        if(!bCryptPasswordEncoder.matches(passwordDTO.getOldPassword(), targetMember.getPassword())){
            throw new MemberResponseException(MemberExceptionType.WRONG_PASSWORD);
        }
        else {
            boolean isValidated = true;
            return ResponseEntity.ok(true);
        }

    }

    // 프로필 사진 변경
    @Transactional
    @Override
    public void updateProfileImage(Member targetMember, String profileimage) {

        // 0. profileimage = '__NULL__' 이라면 프로필 이미지를 삭제하고 null 값이 된다.
        String null_check = "__NULL__";
        if(profileimage.equals(null_check)){
            String imageState = s3Uploader.deleteImage(targetMember.getProfileImage());
            targetMember.updateProfileImage(null);
            return;
        }

        else{
            // 1. 오늘 날짜 가져오기
            LocalDate today = LocalDate.now();

            // 2. s3 업로드
            try {
                String imageUrl = s3Uploader.uploadImage(profileimage, today, "p");
                // 3. update
                targetMember.updateProfileImage(imageUrl);
            } catch (IOException e) {
                e.printStackTrace();
                throw new MemberResponseException(MemberExceptionType.ERROR_UPDATE_PROFILEIMAGE);
            }
        }
    }

    // password 업데이트
    @Transactional
    @Override
    public void updatePassword(Member targetMember, String oldpassword, String newpassword){
        if(!bCryptPasswordEncoder.matches(oldpassword, targetMember.getPassword())){
            throw new MemberResponseException(MemberExceptionType.WRONG_PASSWORD);}
        String encPassword = bCryptPasswordEncoder.encode(newpassword);
        targetMember.updatePassword(encPassword);
        memberRepository.save(targetMember);
    }


    // patch로 마이페이지 개인정보 수정
    // TODO: patch의 null인지 실수로 보내지지 않았는지 구별 불가능
    @Transactional
    @Override
    public ResponseEntity<?> patchMypage(Long memberID, MemberDTO.MemberUpdate memberDTO){
        //1. 해당 멤버 객체
        Member targetMember = validateMemberService.validateMember(memberID);

        if(memberDTO.getNewEmail() != null) targetMember.updateEmail(memberDTO.getNewEmail());
        if(memberDTO.getNewName() != null) targetMember.updateName(memberDTO.getNewName());
        if (memberDTO.getNewPassword() != null && memberDTO.getOldPassword() != null) 
                                    updatePassword(targetMember, memberDTO.getOldPassword(), memberDTO.getNewPassword());
        if(memberDTO.getNewPhoneNumber() != null) targetMember.updatePhoneNumber(memberDTO.getNewPhoneNumber());
        if(memberDTO.getNewProfileImage() != null) updateProfileImage(targetMember, memberDTO.getNewProfileImage());
        memberRepository.save(targetMember);
        return ResponseEntity.ok("마이페이지 변경이 완료되었습니다");
    }

    /* 새로운 전화번호 인증
     * 이미 존재하면 602 에러
     */
    public String sendSmsNew(String phoneNumber){
        // 1. 전화번호로 member 객체 찾고 나오면 오류
        Optional<Member> targetMember = memberRepository.findByPhoneNumber(phoneNumber);
        if(targetMember.isPresent()) throw new MemberResponseException(MemberExceptionType.ALREADY_EXIST_PHONENUMBER);
        
        String verificationCode = createKey();
        smsUtil.sendOne(phoneNumber, verificationCode);

        return verificationCode;
    }



    // 전화번호 인증 (이메일 찾기 등 이미 존재하는 객체)
    public String sendSmsExisted(String phoneNumber){
        // 1. 전화번호로 member 객체 찾고 나오지 않으면 오류
        Member targetMember = memberRepository.findByPhoneNumber(phoneNumber).orElseThrow(()-> new MemberResponseException(MemberExceptionType.NOT_FOUND_MEMBER));
        
        String verificationCode = createKey();
        smsUtil.sendOne(phoneNumber, verificationCode);

        return verificationCode;
    }

    // 인증번호 만드는 메소드
    public static String createKey(){
        StringBuffer key = new StringBuffer();
        Random random = new Random();

        for (int i=0; i<6; i++){    // 6자리
            key.append(random.nextInt(10)); //0~9까지 랜덤 생성
        }
        return key.toString();
    }

    // 임시비밀번호 생성하는 메소드
    public static String tempPassword(){
        StringBuffer key = new StringBuffer();
        Random random = new Random();

        for (int i=0; i<8; i++){    // 8자리
            if (random.nextBoolean()){
                key.append((char) ((int)(random.nextInt(26))+97));
            } else{
                key.append(random.nextInt(10)); //0~9까지 랜덤 생성
            }
        }
        return key.toString();
    }

    // 임시 비밀번호로 사용자의 계정 강제 설정하기
    @Override
    @Transactional
    public ResponseEntity<?> setTempPassword(String email) throws Exception{
        // 1. 사용자 존재 확인
        // 2. 이메일로 Member 객체
        Member targetMember = validateMemberService.findMemberByEmail(email);
        // 3. 임시 번호 생성
        String tempPassword = tempPassword();
        // 4. 무작위로 설정한 password 이메일로 전송
        emailService.sendTempPassword(email, tempPassword);
        // 5. 임시 번호 저장
        String encPassword = bCryptPasswordEncoder.encode(tempPassword);
        targetMember.updatePassword(encPassword);
        memberRepository.save(targetMember);

        return ResponseEntity.ok("temp password set done");
    }

    // 그냥 인증 됐는지만 반환
    @Override
    public ResponseEntity<responseNewDTO> verifyNewPhoneNumber(String phoneNumber, String code){
        Boolean isVerified =  smsVerificationService.verifyNumber(phoneNumber, code);
        PhoneDTO.responseNewDTO response = new PhoneDTO.responseNewDTO(isVerified);
        return ResponseEntity.ok(response);
    }

    // 이미 있는 번호 인증하고 이메일 찾아서 반환
    @Override
    public ResponseEntity<?> verifyExistedPhoneNumber(String phoneNumber, String code){

        if(smsVerificationService.verifyNumber(phoneNumber, code)){
            Member targetMember = memberRepository.findByPhoneNumber(phoneNumber).orElseThrow(()-> new MemberResponseException(MemberExceptionType.NOT_FOUND_MEMBER));
            responseExistedDTO response = new responseExistedDTO(true, targetMember.getEmail());
            return ResponseEntity.ok(response);
        } else{
            throw new MemberResponseException(MemberExceptionType.FAIL_PHONE_VERIFIED); //700
        }
    }



}
