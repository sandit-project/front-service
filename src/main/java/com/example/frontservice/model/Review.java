package com.example.frontservice.model;

import com.example.frontservice.type.ReviewStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class Review {
    private int uid;
    private Integer userUid;
    private Integer socialUid;
    private int orderUid;
    private BigDecimal rate;
    private String title;
    private String content;
    private ReviewStatus status;
    private LocalDateTime createdDate;
    private int version;
}
