package com.diary.drawing.domain.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.diary.drawing.domain.user.domain.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long>{
    Optional<Member> findByEmail(String email); // Optional: findBy로 조회했을 때 객체가 존재하지 않는 경우 처리
    Optional<Member> findByMemberID(Long memberID);
    Optional<Member> findByPhoneNumber(String phoneNumber);
    boolean existsByEmail(String email);
    String findEmailByMemberID(Long memberID);

}