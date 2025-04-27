package com.example.frontservice.util;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
//이메일 인증 시 난수 생성기
public class GeneratedCode {

    public String generate() {
        int left = 48, right = 122, len = 6;
        return new Random().ints(left, right + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(len)
                .collect(StringBuilder::new,
                        StringBuilder::appendCodePoint,
                        StringBuilder::append)
                .toString();
    }
}
