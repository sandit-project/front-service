package com.example.frontservice.client.edge;

import com.example.frontservice.dto.review.ReviewDetailResponseDTO;
import com.example.frontservice.dto.review.ReviewRequestDTO;
import com.example.frontservice.dto.review.ReviewResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "reivewClient", url = "${sandit.edge-service-url}/reviews")
public interface ReviewClient {

    @GetMapping
    List<ReviewDetailResponseDTO> getAllReview();

    @GetMapping("/{uid}")
    ReviewDetailResponseDTO getReview(@PathVariable("uid") int uid);

    @GetMapping("/user/{userUid}")
    List<ReviewDetailResponseDTO> getReviewByUserUid(@PathVariable("userUid") Integer userUid);

    @PostMapping
    ReviewResponseDTO writeReview(@RequestBody ReviewRequestDTO reviewRequestDTO);

    @DeleteMapping("/{uid}")
    ReviewResponseDTO deleteReview(@RequestParam("token") String token, @PathVariable("uid") int uid);

}
