package com.example.frontservice.controller.ai;

import com.example.frontservice.dto.ai.AllergyCheckRequestDTO;
import com.example.frontservice.dto.ai.AllergyListResponseDTO;
import com.example.frontservice.dto.ai.AllgergyCheckResponseDTO;
import com.example.frontservice.service.AiService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    @GetMapping("/users/{userUid}/allergies")
    public ResponseEntity<AllergyListResponseDTO> getUserAllergies(@PathVariable Long userUid,
                                                                   HttpServletRequest request){

        String token = request.getHeader("Authorization");
        AllergyListResponseDTO results = aiService.getUserAllergies(userUid,token);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/check-allergy")
    public ResponseEntity<AllgergyCheckResponseDTO> checkAllergy (@RequestBody AllergyCheckRequestDTO requestDTO,
                                                                  HttpServletRequest request){
        String token = request.getHeader("Authorization");
        AllgergyCheckResponseDTO results = aiService.checkAllergy(requestDTO,token);
        return ResponseEntity.ok(results);
    }
}
