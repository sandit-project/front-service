package com.example.frontservice.client.edge;

import com.example.frontservice.dto.auth.EmailRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "emailAuthClient", url = "${sandit.edge-service-url}/auths")
public interface EmailAuthClient {
    // 1) 프론트가 만든 코드 저장
    @PostMapping("/email/{email:.+}/authcode")
    void storeCode(
            @PathVariable("email") String email,
            @RequestBody EmailRequestDTO dto
    );

    // 2) 저장된 코드 검증 → memberId 반환
    @PostMapping("/email/{email:.+}/authcode/verify")
    String verifyEmailCode(
            @PathVariable("email") String email,
            @RequestBody EmailRequestDTO dto
    );
}
