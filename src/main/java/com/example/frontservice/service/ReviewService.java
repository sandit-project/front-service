package com.example.frontservice.service;

import com.example.frontservice.client.edge.ReviewClient;
import com.example.frontservice.dto.review.ReviewDetailResponseDTO;
import com.example.frontservice.dto.review.ReviewRequestDTO;
import com.example.frontservice.dto.review.ReviewResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewClient reviewClient;

    public ReviewDetailResponseDTO getAllReview() {
        return reviewClient.getAllReview();
    }

    public ReviewDetailResponseDTO getReviewByUid(int uid) {
        return reviewClient.getReview(uid);
    }

    public ReviewDetailResponseDTO getReviewByUserUid(Integer userUid) {
        return reviewClient.getReviewByUserUid(userUid);
    }

    public ReviewResponseDTO writeReview(@RequestBody ReviewRequestDTO reviewRequestDTO) {
        return reviewClient.writeReview(reviewRequestDTO);
    }

    public ReviewResponseDTO deleteReview(@RequestParam("token") String token, @PathVariable("uid") int uid) {
        return reviewClient.deleteReview(token, uid);
    }
}
