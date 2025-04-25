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
        emailService.sendEmailCode(email);
        return ResponseEntity.ok("이메일을 확인하세요.");
    }

    @PostMapping("/auths/email/{email}/authcode")
    public ResponseEntity<String> verifyCode(
            @PathVariable String email,
            @RequestBody EmailRequestDTO emailRequestDTO
            ) {
        String token = emailService.verifyEmailCode(email, emailRequestDTO.getCode());
        return ResponseEntity.ok(token);
    }
}
