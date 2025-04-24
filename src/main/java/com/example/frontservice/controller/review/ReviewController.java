package com.example.frontservice.controller.review;

import com.example.frontservice.dto.review.ReviewDetailResponseDTO;
import com.example.frontservice.dto.review.ReviewRequestDTO;
import com.example.frontservice.dto.review.ReviewResponseDTO;
import com.example.frontservice.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<ReviewDetailResponseDTO>> getAllReviews() {
        log.info("getAllReviews");
        return ResponseEntity.ok(Collections.singletonList(reviewService.getAllReview()));
    }

    @GetMapping("/{uid}")
    public ResponseEntity<ReviewDetailResponseDTO> getReviewByUid(@PathVariable("uid") int uid) {
        log.info("getReviewByUid::" + uid);
        return ResponseEntity.ok(reviewService.getReviewByUid(uid));
    }

    @GetMapping("/user/{userUid}")
    public ResponseEntity<ReviewDetailResponseDTO> getReviewByUserUid(@PathVariable("userUid") Integer userUid) {
        log.info("getReviewByUserUid::" + userUid);
        return ResponseEntity.ok(reviewService.getReviewByUserUid(userUid));
    }

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> writeReview(@RequestBody ReviewRequestDTO request) {
        log.info("write review::" + request.toString());
        return ResponseEntity.ok(reviewService.writeReview(request));
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<ReviewResponseDTO> deleteReview(
            @RequestHeader("Authorization") String bearerToken, @PathVariable int uid) {
        log.info("delete review:: uid={}, header={}", uid, bearerToken);
        return ResponseEntity.ok(
                reviewService.deleteReview(bearerToken, uid)
        );
    }
}
