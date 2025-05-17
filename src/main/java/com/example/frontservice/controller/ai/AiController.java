package com.example.frontservice.controller.ai;

import com.example.frontservice.dto.ai.AllergyCheckRequestDTO;
import com.example.frontservice.dto.ai.AllgergyCheckResponseDTO;
import com.example.frontservice.service.AiService;
import com.example.frontservice.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;
    private final TokenService tokenService;

    @PostMapping("/check-allergy")
    public ResponseEntity<AllgergyCheckResponseDTO> checkAllergy (@RequestBody AllergyCheckRequestDTO requestDTO,
                                                                  HttpServletRequest request){
        String token = request.getHeader("Authorization");
        AllgergyCheckResponseDTO results = aiService.checkAllergy(requestDTO.getAllergy(),requestDTO.getIngredients(),token);
        return ResponseEntity.ok(results);
    }
}
