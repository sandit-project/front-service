package com.example.frontservice.service;

import com.example.frontservice.dto.ReviewResponseDTO;
import com.example.frontservice.mapper.ReviewMapper;
import com.example.frontservice.model.Review;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewMapper reviewMapper;

    public ReviewResponseDTO writeReview(Review review){
        reviewMapper.save(review);
        return ReviewResponseDTO.builder()
                .isSuccess(true)
                .message("리뷰가 작성되었습니다.")
                .build();
    }
}
