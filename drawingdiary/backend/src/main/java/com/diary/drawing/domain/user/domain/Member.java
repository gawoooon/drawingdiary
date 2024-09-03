package com.diary.drawing.domain.user.domain;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
@Table(name = "Member")
public class Member {
        
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "memberID")
    private Long memberID;

    @Column(length = 50)
    private String name;

    @Column(unique = true, length = 255)
    private String email;

    @Column(length = 255)
    private String password;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate birth;

    private char gender;

    @Enumerated(EnumType.STRING)
    @Column(name="role")
    private MemberRole role; //ROLE_USER, ROLE_ADMIN

    private String profileImage;

    @Column(unique = true, length = 75)
    private String phoneNumber;

    @Override
    public String toString(){
        return "UserID: " + this.memberID + "Name: " +  this.name + "Email: " + this.email + "Password: " + this.password
                + "Birth: " + this.birth + "Gender: " + this.gender + "ProfileImage: " + this.profileImage + "PhoneNumber" + this.phoneNumber;
    }

    public Member(){}

    @Builder // 나중에 보안성 높이고 일단 구현(access = AccessLevel=private), personality, image는 별개
    public Member(String name, String email, LocalDate birth, char gender, String password, String phoneNumber){
        this.name = name;
        this.email = email;
        this.birth = birth;
        this.gender = gender;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.role = MemberRole.ROLE_USER;   //기본값 설정
    }
 
    // 문자열로 role 주기
    public String getRole() {
        return this.role.name();
    }
    

    // 패스워드 조회
    public String getPassword() {
        return this.password;
    }

    // 이메일 수정
    public void updateEmail(String email) {
        this.email = email;
    }

    // 비밀번호 수정
    public void updatePassword(String newPassword) {
        this.password = newPassword;
    }

    // 전화번호 수정
    public void updatePhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    // 닉네임 수정
    public void updateName(String nickname) {
        this.name = nickname;
    }

    // 프로필 이미지 수정
    public void updateProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
    
}