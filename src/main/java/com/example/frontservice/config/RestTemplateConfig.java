package com.example.frontservice.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }

    @Bean
    public RestTemplate portoneRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        // ① MappingJackson2HttpMessageConverter만 등록 → JSON 직렬화/역직렬화 전용
        restTemplate.setMessageConverters(
                Collections.singletonList(new MappingJackson2HttpMessageConverter())
        );

        // ② 디버깅용 인터셉터 추가: 실제로 request URI, headers, body를 찍기
        restTemplate.getInterceptors().add((request, body, execution) -> {
            System.out.println("========[RestTemplate 요청 시작]========");
            System.out.println("요청 URL        : " + request.getURI());
            System.out.println("요청 HTTP 메서드 : " + request.getMethod());
            System.out.println("요청 헤더       : " + request.getHeaders());
            System.out.println("요청 바디       : " + new String(body, java.nio.charset.StandardCharsets.UTF_8));
            System.out.println("========[RestTemplate 요청 끝]========");
            return execution.execute(request, body);
        });

        return restTemplate;
    }

}
