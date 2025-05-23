package com.example.frontservice.dto.ai;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AllgergyCheckResponseDTO {
    private boolean risk;
    private List<String> cause;
    private String detail;
}
