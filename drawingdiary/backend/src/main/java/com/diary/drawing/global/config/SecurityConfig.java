package com.diary.drawing.global.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.diary.drawing.global.jwt.exception.CustomAuthenticationEntryPoint;
import com.diary.drawing.global.jwt.exception.JwtExceptionFilter;
import com.diary.drawing.global.jwt.security.JwtAuthenticationFilter;
import com.diary.drawing.global.jwt.service.CustomUserDetailService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity // 스프링 시큐리티 필터가 스프링 필터 체인에 등록
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtExceptionFilter jwtExceptionFilter;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailService customUserDetailService;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain applicationSecurity(HttpSecurity http) throws Exception {
        // 내가 만든 토큰 필터 먼저
        
        http.addFilterBefore(jwtExceptionFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        http
                // csrf disable csrf 공격 막아주기
                .csrf(AbstractHttpConfigurer::disable)
                // cors 설정(react랑) 나중에 Controller에 @CrossOrigin으로 싹 넣어야함
                .cors(corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource(){
                    @SuppressWarnings("null")
                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                        CorsConfiguration configuration = new CorsConfiguration();
                        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3001", "http://localhost:3000","http://localhost:5001","https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze","http://localhost", "http://drawingdiary.kro.kr"));    // react 허가
                        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                        configuration.setAllowedHeaders(Arrays.asList("*"));
                        configuration.setAllowCredentials(true);    // 일단 허용
                        configuration.setMaxAge(3600L); // 1시간
                        return configuration;
                    }
                }))
                // Form 로그인 방식 disable
                .formLogin((auth) -> auth.disable())
                // oath2 로그인 방식은 잠깐 disable
                .oauth2Login((auth) -> auth.disable())
                // http basic 인증 방식 disable
                .httpBasic((auth) -> auth.disable())
                // 경로별 인가 작업
                .authorizeHttpRequests((auth) -> auth
                        // 일단 죄다 허가 해놨음
                        .requestMatchers("/login", "/**", "/join", "/api/**",
                                "/error", "/auth/**", "/auth/login")
                        .permitAll()
                        // [지원] 추가한 부분
                        .requestMatchers(HttpMethod.OPTIONS, "/**")
                        .permitAll()
                        // .requestMatchers("/admin").hasRole("ADMIN")
                        .anyRequest().authenticated())
                // 세션을 생성하지 않고, 요청마다 새로운 인증을 수행하도록 구성하는 옵션으로 REST API와 같은 환경에서 사용
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(customAuthenticationEntryPoint));

        return http.build();
    }

    // 이 메서드는 리턴되는 오브젝트를 암호화...
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        var builder = http.getSharedObject(AuthenticationManagerBuilder.class);
        builder
                .userDetailsService(customUserDetailService)
                .passwordEncoder(bCryptPasswordEncoder());
        return builder.build();
    }

    // react 서버와 연동하는 cors (나중에 추가)

}

