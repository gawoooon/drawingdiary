package com.diary.drawing.domain.imagestyle.service;

import java.time.LocalDate;
import java.time.Period;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.diary.drawing.domain.imagestyle.domain.MemberStylePreference;
import com.diary.drawing.domain.imagestyle.domain.ModelPrediction;
import com.diary.drawing.domain.imagestyle.dto.PredictRequestDTO;
import com.diary.drawing.domain.imagestyle.dto.PredictRequestDTO.earlyDTO;
import com.diary.drawing.domain.imagestyle.dto.PredictResponseDTO;
import com.diary.drawing.domain.imagestyle.dto.PredictResponseDTO.back;
import com.diary.drawing.domain.imagestyle.dto.PredictResponseDTO.early;
import com.diary.drawing.domain.imagestyle.dto.PredictResponseDTO.history;
import com.diary.drawing.domain.imagestyle.dto.PredictResponseDTO.test;
import com.diary.drawing.domain.imagestyle.repository.MemberStylePreferenceRespository;
import com.diary.drawing.domain.imagestyle.repository.ModelPredictionRepository;
import com.diary.drawing.domain.user.domain.Member;
import com.diary.drawing.domain.user.service.ValidateMemberService;

import lombok.RequiredArgsConstructor;


@Transactional
@RequiredArgsConstructor
@Service
public class PredictStyleService{
    private final ValidateMemberService validateMemberService;
    private final ModelPredictionRepository modelPredictionRepository;
    private final MemberStylePreferenceRespository stylePreferenceRespository;

    @Transactional
    private void saveModelPrediction(List<String> getList, Long memberID){
        ModelPrediction modelPrediction = validatePrediction(memberID);
        modelPrediction.update(getList);
        modelPredictionRepository.save(modelPrediction);
    }

    /* 조회한 예측 결과 저장 */
    @Transactional
    public ResponseEntity<?> saveStyles(Long memberID){
        Member member = validateMemberService.validateMember(memberID);
        List<String> getResponse = null;

        if(isUnderFive(member)){
            int age = calculateAge(member.getBirth());
            PredictRequestDTO.earlyDTO earlyDTO = new earlyDTO(age, member.getGender());
            PredictResponseDTO.early early_response = getStyles(earlyDTO);
            // 답변 null이면 오류 반환
            if(early_response == null){return ResponseEntity.ofNullable("초기 예측 생성에 실패했습니다.");}
            getResponse = early_response.getTop_styles();
        } else {
            PredictResponseDTO.history history_response = getStyles_history(memberID);
            // 답변 null이면 오류 반환
            if(history_response == null){return ResponseEntity.ofNullable("추천 예측 생성에 실패했습니다.");}
            getResponse = history_response.getRecommended_styles();
        }

        saveModelPrediction(getResponse, memberID);
        PredictResponseDTO.back back_response = new back(getResponse);
        return ResponseEntity.ok(back_response);
    }

    /* ModelPrediction을 찾고 있으면 반환하고 아니면 새로 생성함 */
    @Transactional
    public ModelPrediction validatePrediction(Long memberID){
        ModelPrediction prediction = modelPredictionRepository.findByMember_MemberID(memberID);

        // 없으면 생성 및 초기화
        if(prediction == null){
            Member member = validateMemberService.validateMember(memberID);
            return modelPredictionRepository.save(new ModelPrediction(member, "미니멀리즘", "복고풍", "펑크", "보헤미안", "고전주의"));
        }

        return prediction;
    }

    /* python 예측 모델에서 prediction_styles라는 string 리스트 반환 */
    @Transactional
    public early getStyles(PredictRequestDTO.earlyDTO earlyDTO) {
        String url = "http://recommender:5001/api/get-styles";

        // 요청 본문 생성하기
        Map<String, Object> body = new HashMap<>();
        body.put("age", earlyDTO.getAge());
        body.put("gender", earlyDTO.getGender());

        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // HttpEntity 객체 생성하기
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        // RestTemplate 객체 생성/요청 전송
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<PredictResponseDTO.early> response = restTemplate.exchange(url, HttpMethod.POST, entity, PredictResponseDTO.early.class);

        return response.getBody();
    }

    /* python 예측 모델에서 recommended_styles라는 string 리스트 반환 */
    @Transactional
    public history getStyles_history(Long memberID) {
        String url = "http://recommender:5001/api/get-styles-history";

        // 요청 본문 생성하기
        Map<String, Object> body = new HashMap<>();
        body.put("member_id", memberID);

        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // HttpEntity 객체 생성하기
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        // RestTemplate 객체 생성/요청 전송
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<PredictResponseDTO.history> response = restTemplate.exchange(url, HttpMethod.POST, entity, PredictResponseDTO.history.class);

        return response.getBody();
    }

    /* 그냥 현재 추천 스타일 조회만 */
    public ResponseEntity<test> getExistPrediction(Long memberID){
        Member member = validateMemberService.validateMember(memberID);
        ModelPrediction prediction = validatePrediction(memberID);
        List<String> existPrediction = Arrays.asList(prediction.getStyle1(), prediction.getStyle2(), prediction.getStyle3(), prediction.getStyle4(), prediction.getStyle5());
        return ResponseEntity.ok(new PredictResponseDTO.test(existPrediction));
    }

    /* 특정 사용자의 스타일 선택 현황이 5개 이하인지 확인한다 */
    private boolean isUnderFive(Member member){
        List<MemberStylePreference> styleList = stylePreferenceRespository.findByMember(member);
        int total = styleList.stream()
            .mapToInt(MemberStylePreference::getFrequency)
            .sum();
        return total <= 5;
    }

    /* 나이 계산 */
    private int calculateAge(LocalDate birthDate) {
        LocalDate today = LocalDate.now(); // 현재 날짜
        LocalDate birth = birthDate; // 생년월일
        return Period.between(birth, today).getYears(); // 두 날짜 사이의 차이 (연도)
}

        
}
