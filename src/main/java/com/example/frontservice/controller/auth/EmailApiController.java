package com.example.frontservice.controller.auth;

import com.example.frontservice.dto.auth.EmailRequestDTO;
import com.example.frontservice.service.AuthService;
import com.example.frontservice.service.EmailService;
import feign.FeignException;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.apache.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class EmailApiController {

    private final EmailService emailService;


    @GetMapping("/auths/email/{email}/authcode")
    public ResponseEntity<String> sendCode(@PathVariable String email) throws IOException, MessagingException {
        try {
            emailService.sendEmailCode(email);
            return ResponseEntity.ok("이메일을 확인하세요.");
        } catch (FeignException e) {
            e.printStackTrace();
            if (e.status() == 400) {
                // auth-service가 [{"message":"이미 사용 중인 이메일입니다."}] 로 보냈다고 가정
                return ResponseEntity
                        .badRequest()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(e.contentUTF8());
            }
            return ResponseEntity
                    .status(HttpStatus.SC_INTERNAL_SERVER_ERROR)
                    .body("인증 코드 전송 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/auths/email/{email}/authcode")
    public ResponseEntity<String> verifyCode(
            @PathVariable String email,
            @RequestBody EmailRequestDTO emailRequestDTO
    ) {
        try {
            String token = emailService.verifyEmailCode(email, emailRequestDTO.getCode());
            return ResponseEntity.ok(token);
        } catch (FeignException e) {
            if (e.status() == 404) {
                // 인증 코드 불일치: 404로 변환
                return ResponseEntity
                        .status(404)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(e.contentUTF8());
            }
            // 필요하다면 400 등도 분기 처리
            return ResponseEntity
                    .status(HttpStatus.SC_INTERNAL_SERVER_ERROR)
                    .body("이메일 인증 중 오류가 발생했습니다.");
        }
    }

}
