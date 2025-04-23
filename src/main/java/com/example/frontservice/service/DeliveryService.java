package com.example.frontservice.service;

import com.example.frontservice.client.kakao.MobilityClient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeliveryService {
    @Value("${kakao.rest.api-key}")
    private String kakaoApiKey;

    private final MobilityClient mobilityClient;

    public String getPath(String origin, String destination) {
        return mobilityClient.getPath("KakaoAK " + kakaoApiKey, origin, destination, "RECOMMEND");
    }
}
