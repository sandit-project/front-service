package com.example.frontservice.dto.review;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReviewResponseDTO {
    private boolean isSuccess;
    private String message;
}
