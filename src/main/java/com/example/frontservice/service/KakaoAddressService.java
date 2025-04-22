package com.example.frontservice.service;

import com.example.frontservice.client.kakao.GeoClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class KakaoAddressService {
    @Value("${kakao.rest.api-key}")
    private String kakaoApiKey;

    private final GeoClient geoClient;

    public Map<String, Double> convertToCoordinates(String address) {
        // 1) Feign으로 호출 (Feign이 내부에서 URL 인코딩)
        System.out.println(address);
        String result = geoClient.getAddress(address, "KakaoAK " + kakaoApiKey);
        System.out.println(result);

        // 2) JSON 파싱
        JSONObject root = new JSONObject(result);
        JSONArray docs   = root.getJSONArray("documents");
        if (docs.isEmpty()) {
            throw new IllegalArgumentException("주소 변환 결과가 없습니다.");
        }
        JSONObject loc = docs.getJSONObject(0);
        double lng = loc.getDouble("x");
        double lat = loc.getDouble("y");

        // 3) Map 으로 반환
        return Map.of("lat", lat, "lng", lng);
    }
}

