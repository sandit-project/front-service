package com.example.frontservice.client.edge;

import com.example.frontservice.dto.ai.AllergyCheckRequestDTO;
import com.example.frontservice.dto.ai.AllergyListResponseDTO;
import com.example.frontservice.dto.ai.AllgergyCheckResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "aiClient", url = "${sandit.edge-service-url}")
public interface AiClient {

    // 유저 알러지 목록 조회
    @GetMapping("/api/ai/users/{userUid}/allergies")
    AllergyListResponseDTO getUserAllergies(@PathVariable("userUid") Long userUid,
                                            @RequestHeader("Authorization")String token);

    // 소셜 알러지 목록 조회
    @GetMapping("/api/ai/socials/{socialUid}/allergies")
    AllergyListResponseDTO getSocialAllergies(@PathVariable("socialUid") Long socialUid,
                                            @RequestHeader("Authorization")String token);

    // 알러지 체크
    @PostMapping(value = "/api/ai/check-allergy",
                 consumes= MediaType.APPLICATION_JSON_VALUE)
    AllgergyCheckResponseDTO checkAllergy(@RequestBody AllergyCheckRequestDTO request,
                                          @RequestHeader("Authorization") String token);
}
