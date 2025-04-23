package com.example.frontservice.controller;

import com.example.frontservice.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/delivery")
public class DeliveryApiController {
    private final DeliveryService deliveryService;

    @GetMapping
    public String getPath(
            @RequestParam("origin") String origin,
            @RequestParam("destination") String destination
    ){
        log.info("request path :: {}, {}", origin, destination);
        return deliveryService.getPath(origin,destination);
    }
}
