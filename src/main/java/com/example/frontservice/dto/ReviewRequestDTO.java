package com.example.frontservice.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ReviewRequestDTO {
    private Integer userUid;
    private Integer socialUid;
    private int orderUid;
    private BigDecimal rate;
    private String title;
    private String content;
}
