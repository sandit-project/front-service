package com.example.frontservice.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.stereotype.Component;

@Component
public class FeignRequestInterceptor implements RequestInterceptor {

    private static final String CONTENT_LENGTH_HEADER = "Content-Length";
    private static final String FAKE_BODY = "gradmeet";

    @Override
    public void apply(RequestTemplate template) {
        // 본문 길이가 0이면 가짜 본문을 추가하고 Content-Length 설정
        if (template.body() == null || template.body().length == 0) {
            // POST 요청일 때만 본문과 Content-Length 추가
            if ("POST".equalsIgnoreCase(template.method())) {
                template.body(FAKE_BODY);
                template.header(CONTENT_LENGTH_HEADER, String.valueOf(FAKE_BODY.getBytes().length));
            }
        }
    }
}