package com.example.frontservice.service;

import com.example.frontservice.client.edge.EmailAuthClient;
import com.example.frontservice.dto.auth.EmailRequestDTO;
import com.example.frontservice.util.GeneratedCode;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final EmailAuthClient emailAuthClient;
    private final JavaMailSender mailSender;
    private final GeneratedCode generatedCode;

    @Value("${spring.mail.from}")
    private String fromAddress;

    public void sendEmailCode(String email) throws IOException, MessagingException {
        // 1) 로컬에서 난수 생성
        String code = generatedCode.generate();
        emailAuthClient.storeCode(email, EmailRequestDTO.builder().code(code).build());

        // 2) mail.html 템플릿 읽어서 {{code}} 치환
        ClassPathResource html = new ClassPathResource("templates/auth/mail.html");
        String template = new String(
                html.getInputStream().readAllBytes(),
                StandardCharsets.UTF_8
        );
        String content = template.replace("{{code}}", code);

        // 3) HTML 메일 발송
        MimeMessage msg = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, "UTF-8");
        helper.setFrom(fromAddress);
        helper.setTo(email);
        helper.setSubject("[Sandit] 이메일 인증 코드입니다.");
        helper.setText(content, true);
        mailSender.send(msg);
    }

    public String verifyEmailCode(String email, String code) {
        return emailAuthClient.verifyEmailCode(
                email,
                EmailRequestDTO.builder().code(code).build()
        );
    }
}
