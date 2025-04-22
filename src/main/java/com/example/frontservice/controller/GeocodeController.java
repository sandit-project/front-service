package com.example.frontservice.controller;

import com.example.frontservice.service.KakaoAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins="*")
@RequiredArgsConstructor
public class GeocodeController {
    private final KakaoAddressService kakaoAddressService;

    @GetMapping("/geocode")
    public ResponseEntity<Map<String, Double>> geocode(@RequestParam String address) {
        try {
            Map<String, Double> coords = kakaoAddressService.convertToCoordinates(address);
            return ResponseEntity.ok(coords);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", 0.0));
        }
    }
}
