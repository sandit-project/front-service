package com.example.frontservice.client.edge;

import com.example.frontservice.dto.ai.AllergyCheckRequestDTO;
import com.example.frontservice.dto.ai.AllgergyCheckResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "aiClient", url = "${sandit.edge-service-url}/ai")
public interface AiClient {

    @PostMapping("/check-allergy")
    AllgergyCheckResponseDTO checkAllergy(@RequestBody AllergyCheckRequestDTO request,
                                          @RequestHeader("Authorization") String token);
}
