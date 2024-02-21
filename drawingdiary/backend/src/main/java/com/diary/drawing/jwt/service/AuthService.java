package com.diary.drawing.jwt.service;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.diary.drawing.jwt.domain.RefreshToken;
import com.diary.drawing.jwt.exception.authExceptionType;
import com.diary.drawing.jwt.exception.authResponseException;
import com.diary.drawing.jwt.repository.RefreshTokenRepository;
import com.diary.drawing.jwt.security.JwtIssuer;
import com.diary.drawing.user.domain.Member;
import com.diary.drawing.user.service.MemberService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final MemberService memberService;
    private final JwtIssuer jwtIssuer;

    // 저장
    @Transactional
    public void saveToken(Long memberID, String refreshToken) {
        refreshTokenRepository.save(new RefreshToken(String.valueOf(memberID), refreshToken));
    }

    // 삭제
    @Transactional
    public void removeRefreshToken(Long userID) {
        refreshTokenRepository.findByMemberID(String.valueOf(userID));
                //.ifPresent(refreshToken -> refreshTokenRepository.delete(refreshToken));
    }

    // 찾기
    public String validateRefreshToken(Long memberID){
        RefreshToken refreshToken = refreshTokenRepository.findByMemberID(String.valueOf(memberID));
        String token = (refreshToken).getRefreshToken();
        return token;
        // if (refreshToken.isPresent()) {
        //     String token = (refreshToken.get()).getRefreshToken();
            
        //     return token;
        //     // token을 사용하는 코드
        // }else{
        //     throw new authResponseException(authExceptionType.WRONG_VALIDATION);
        // }
    }

    // 유효성 검사 > 일단 만들었으나 redis에서 삭제하므로 필요 없을 듯?
    public boolean validateToken(String token) {
        try {
            // 만료 시간 검사
            DecodedJWT jwt = JWT.decode(token);
            Date expiresAt = jwt.getExpiresAt();
            if (expiresAt.before(new Date())) {
                throw new authResponseException(authExceptionType.EXPIRED_TOKEN);
            }

            return true;
        } catch (authResponseException e) {
            DecodedJWT jwt = JWT.decode(token);
            removeRefreshToken(Long.valueOf(jwt.getSubject()));
            return false;

        } catch (Exception e) {
            // 그 외의 오류
            return false;
        }
    }

    // access token 재발급
    public String reissueAccessToken(String refreshToken, Long memberID){
        // DB에서 해당 사용자의 refreshToken 확인
        String storedRefreshToken = validateRefreshToken(memberID);
        // DB의 refreshToken과 요청의 refreshToken이 일치하는지 확인
        if(refreshToken.equals(storedRefreshToken)){
            // 사용자의 이메일과 권한을 가져옵니다.
            Member member = memberService.validateMember(memberID);
            String email = member.getEmail();
            List<String> authorities= List.of(member.getRole());
            // 새로운 accessToken 발급
            String accessToken = jwtIssuer.createAccessToken(memberID, email, authorities);
            return accessToken;
        }

        else {throw new authResponseException(authExceptionType.WRONG_REFRESHTOKEN);}

    }

    
}