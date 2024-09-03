package com.diary.drawing.domain.user.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@Builder
public class GetMemberDTO {

    private Long memberID;

    private String name;

    private String email;

    private LocalDate birth;

    private char gender;

    private String profileImage;

    private String phoneNumber;
}
