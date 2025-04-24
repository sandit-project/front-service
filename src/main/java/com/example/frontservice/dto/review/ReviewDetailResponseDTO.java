package com.example.frontservice.dto.review;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class ReviewDetailResponseDTO {
    private int uid;
    private Integer userUid;
    private Integer socialUid;
    private Integer orderUid;
    private BigDecimal rate;
    private String title;
    private String content;
    private ReviewStatus status;
    private LocalDateTime createdDate;
    private int version;
}
