package com.example.frontservice.client.kakao;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "geoClient", url = "https://dapi.kakao.com/v2/local/search/address.json")
public interface GeoClient {

    @GetMapping
    String getAddress(@RequestParam("query") String query,
                      @RequestHeader("Authorization") String authorization);
}

