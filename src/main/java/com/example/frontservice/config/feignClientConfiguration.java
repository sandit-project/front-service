package com.example.frontservice.config;

import org.springframework.cloud.openfeign.support.JsonFormWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class feignClientConfiguration {
    @Bean
    public JsonFormWriter jsonFormWriter() {
        return new JsonFormWriter();
    }
}
