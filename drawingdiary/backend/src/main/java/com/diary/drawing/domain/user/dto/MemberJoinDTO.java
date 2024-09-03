package com.diary.drawing.domain.user.dto;

import java.time.LocalDate;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;



@Getter
@RequiredArgsConstructor
@ToString
@EqualsAndHashCode
public class MemberJoinDTO {

    @Valid

    @Size(min = 1, max = 50, message = "닉네임은 1에서 50자 사이로 입력해주세요.")
    @NotEmpty(message = "닉네임을 비울 수 없습니다.")
    private String name;

    @NotEmpty(message = "이메일을 비울 수 없습니다.")
    @Email(message = "이메일 형식이 아닙니다")
    private String email;

    @Size(min = 1, max = 50, message = "비밀번호는 1에서 50자 사이로 입력해주세요.")
    @NotEmpty(message = "패스워드를 비울 수 없습니다.")
    private String password;

    @NotEmpty(message = "전화번호를 비울 수 없습니다.")
    private String phoneNumber;

    @NotNull(message = "생일을 비울 수 없습니다.")
    private LocalDate birth;

    @NotNull(message = "성별을 비울 수 없습니다.")
    private char gender;

}
