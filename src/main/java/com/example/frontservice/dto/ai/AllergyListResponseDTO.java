package com.example.frontservice.dto.ai;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AllergyListResponseDTO {
    private List<String> allergy;
}
