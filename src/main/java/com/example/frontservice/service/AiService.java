package com.example.frontservice.service;

import com.example.frontservice.client.edge.AiClient;
import com.example.frontservice.dto.ai.AllergyCheckRequestDTO;
import com.example.frontservice.dto.ai.AllergyListResponseDTO;
import com.example.frontservice.dto.ai.AllgergyCheckResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiService {

    private final AiClient aiClient;

    public AllergyListResponseDTO getUserAllergies(Long userUid, String token) {

        return aiClient.getUserAllergies(userUid,token);

    }
    public AllgergyCheckResponseDTO checkAllergy(AllergyCheckRequestDTO requestDTO,
                                                 String token) {

        return aiClient.checkAllergy(requestDTO,token);

    }
}
