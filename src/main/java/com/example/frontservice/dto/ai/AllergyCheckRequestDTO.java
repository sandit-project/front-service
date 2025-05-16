package com.example.frontservice.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
public class AllergyCheckRequestDTO {
    private List<String> allergy;
    private List<String> ingredients;
}
