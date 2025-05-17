package com.example.frontservice.service;

import com.example.frontservice.client.edge.AiClient;
import com.example.frontservice.dto.ai.AllergyCheckRequestDTO;
import com.example.frontservice.dto.ai.AllgergyCheckResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiService {

    private final AiClient aiClient;

    public AllgergyCheckResponseDTO checkAllergy(List<String> allergy,
                                                 List<String> ingredients,
                                                 String token) {
        AllergyCheckRequestDTO request = new AllergyCheckRequestDTO(allergy,ingredients);
        return aiClient.checkAllergy(request,token);
    }
}
