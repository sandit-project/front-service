package com.example.frontservice.controller;

import com.example.frontservice.dto.ReviewRequestDTO;
import com.example.frontservice.dto.ReviewResponseDTO;
import com.example.frontservice.model.Review;
import com.example.frontservice.service.ReviewService;
import com.example.frontservice.type.ReviewStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.example.frontservice.type.ReviewStatus.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/reviews")
public class ReviewApiController {

    private final ReviewService reviewService;

    @PostMapping
    public ReviewResponseDTO writeReview(@RequestBody ReviewRequestDTO reviewRequestDTO){
        log.info("Review request DTO: " + reviewRequestDTO);
        return reviewService.writeReview(Review.builder()
                        .userUid(reviewRequestDTO.getUserUid())
                        .socialUid(reviewRequestDTO.getSocialUid())
                        .orderUid(reviewRequestDTO.getOrderUid())
                        .rate(reviewRequestDTO.getRate())
                        .title(reviewRequestDTO.getTitle())
                        .content(reviewRequestDTO.getContent())
                        .status(ACTIVE)
                        .build());
    }
}
