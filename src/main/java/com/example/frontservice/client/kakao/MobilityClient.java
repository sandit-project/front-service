package com.example.frontservice.client.kakao;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "mobilityClient", url = "https://apis-navi.kakaomobility.com/v1/directions")
public interface MobilityClient {
    @GetMapping
    String getPath(
            @RequestHeader("Authorization") String authorization,
            @RequestParam("origin") String origin
    );
}
