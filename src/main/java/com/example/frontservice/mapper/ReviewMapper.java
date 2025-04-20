package com.example.frontservice.mapper;

import com.example.frontservice.model.Review;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ReviewMapper {
    void insertReview(Review review);

    default Review save(Review review) {
        insertReview(review); // insertReview를 호출하면 useGeneratedKeys 옵션에 의해 review.uid가 자동 채워짐
        return review;
    }
}
