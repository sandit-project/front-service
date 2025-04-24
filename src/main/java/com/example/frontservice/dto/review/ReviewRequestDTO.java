package com.example.frontservice.dto.review;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class ReviewRequestDTO {
    private Integer userUid;
    private Integer socialUid;
    private int orderUid;
    private BigDecimal rate;
    private String title;
    private String content;
}
