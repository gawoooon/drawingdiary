package com.diary.drawing.domain.diary.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.diary.drawing.domain.album.domain.Album;
import com.diary.drawing.domain.album.repository.AlbumRepository;
import com.diary.drawing.domain.comment.CommentRepository;
import com.diary.drawing.domain.diary.domain.Diary;
import com.diary.drawing.domain.diary.dto.CalenderDTO;
import com.diary.drawing.domain.diary.dto.DiaryRequestDTO;
import com.diary.drawing.domain.diary.dto.DiaryResponseDTO;
import com.diary.drawing.domain.diary.exception.DiaryExceptionType;
import com.diary.drawing.domain.diary.exception.DiaryResponseException;
import com.diary.drawing.domain.diary.repository.DiaryRepository;
import com.diary.drawing.domain.diary.repository.ImageRepository;
import com.diary.drawing.domain.imagestyle.domain.ImageStyle;
import com.diary.drawing.domain.imagestyle.repository.ImageStyleRepository;
import com.diary.drawing.domain.sentiment.repository.SentimentRepository;
import com.diary.drawing.domain.user.domain.Member;
import com.diary.drawing.domain.user.repository.MemberRepository;
import com.diary.drawing.domain.user.service.ValidateMemberService;
import com.diary.drawing.global.s3.S3Uploader;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;



@Slf4j
@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class DiaryService {
    private final DiaryRepository diaryRepository;
    private final SentimentRepository sentimentRepository;
    private final ImageRepository imageRepository;
    private final CommentRepository commentRepository;
    private final AlbumRepository albumRepository;
    private final MemberRepository memberRepository;
    private final ImageStyleRepository imageStyleRepository;
    private final ValidateDiaryService validateDiaryService;
    private final ValidateMemberService validateMemberService;
    private final S3Uploader s3Uploader;


    /* Date로 내용조회 */
    public DiaryResponseDTO getDiary(LocalDate date, Long memberID) throws Exception{
        Member member = validateMemberService.validateMember(memberID);
        Diary diary = validateDiaryService.findByDateAndMember(date, member);
        DiaryResponseDTO diaryResponseDTO = DiaryResponseDTO.from(diary);
        return diaryResponseDTO;
    }

    /* diaryID로 내용조회 */
    public DiaryResponseDTO getDiaryID(Long diaryID) throws Exception{
        Diary diary = diaryRepository.findByDiaryID(diaryID);
        DiaryResponseDTO diaryResponseDTO = DiaryResponseDTO.from(diary);
        return diaryResponseDTO;
    }

    /* 최근 5개 다이어리 내용 리턴 */
    public ResponseEntity<?> recentFive(Long memberID){
        Member member = validateMemberService.validateMember(memberID);
        PageRequest pageable = PageRequest.of(0, 5);
        List<Diary> recent5 = diaryRepository.findByMember5RecentDiary(member, pageable);
        if(recent5 == null) {throw new DiaryResponseException(DiaryExceptionType.NOT_EXIST_CONTEXT);}
        List<DiaryResponseDTO> response = recent5.stream()
            .map(diary -> DiaryResponseDTO.from(diary))
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /* 년월, 멤버id로 모든 다이어리 return 하는 캘린더 서비스 */
    public List<CalenderDTO> calender( int year, int month,  Long memberID){
        Member member = validateMemberService.validateMember(memberID);
        // 년월로 startDate와 endDate 얻기
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<Diary> calender = diaryRepository.findByMemberAndDateBetween(member, startDate, endDate);
        if (calender == null){ throw new DiaryResponseException(DiaryExceptionType.NOT_EXIST_CONTEXT);}
        List<CalenderDTO> response =  calender.stream()
            .map(diary -> new CalenderDTO(diary.getDate(), diary.getImage().getImageFile(), diary.getText()))
            .collect(Collectors.toList());
        return response;
    }

    @SuppressWarnings("null") //TODO: 임시

    /* 다이어리 삭제 */
    @Transactional
    public ResponseEntity<?> delete(LocalDate date, Long memberID){
        Member member = validateMemberService.validateMember(memberID);
        Diary diary = validateDiaryService.findByDateAndMember(date, member);

        diaryRepository.delete(diary);
        sentimentRepository.delete(diary.getSentiment());

        // 이미지 삭제
        String imageState = s3Uploader.deleteImage(diary.getImage().getImageFile());
        imageRepository.delete(diary.getImage());
        commentRepository.delete(diary.getComment());

        return ResponseEntity.ok("일기 삭제가 완료되었습니다.");
    }


    /* 전체 다이어리 추가 테스트용 api */
    @Transactional
    public Diary testcreateDiary(DiaryRequestDTO diaryRequestDTO){

        // date album member 찾기
        Album album = albumRepository.findByAlbumID(diaryRequestDTO.getAlbumID());
        Optional<Member> member = memberRepository.findByMemberID(diaryRequestDTO.getMemberID());
        ImageStyle style = imageStyleRepository.findByStyleID(diaryRequestDTO.getStyleID());


        Diary diary = Diary.builder()
            .text(diaryRequestDTO.getText())
            .weather(diaryRequestDTO.getWeather())
            .date(diaryRequestDTO.getDate())
            .member(member.get())
            .imageStyle(style)
            .build();
        return diaryRepository.save(diary);
    }

    
    /* 다이어리 수정 테스트 메소드 */
    @Transactional
    public Diary updateDiary(DiaryRequestDTO diaryRequestDTO, Long diaryID){

        // 다이어리 객체 찾기
        Diary oldDiary = diaryRepository.findByDiaryID(diaryID);

        // date album member 찾기
        Album a = albumRepository.findByAlbumID(diaryRequestDTO.getAlbumID());
        ImageStyle s = imageStyleRepository.findByStyleID(diaryRequestDTO.getStyleID());

        return diaryRepository.save(oldDiary.testUpdate(diaryRequestDTO, s));
    }
    

}
