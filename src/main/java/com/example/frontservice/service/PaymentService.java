package com.example.frontservice.service;

import com.example.frontservice.dto.order.CancelPaymentResponseDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${iamport.base-url:https://api.iamport.kr}")
    private String baseUrl;

    @Value("${portone.api.key}")
    private String apiKey;

    @Value("${portone.api.secret}")
    private String apiSecret;

    public JsonNode getPaymentInfo(String merchantUid) {
        String token = getToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<JsonNode> response = restTemplate.exchange(
                baseUrl + "/payments/find/{merchant_uid}",
                HttpMethod.GET,
                request,
                JsonNode.class,
                merchantUid
        );
        log.info("결제 정보 조회 결과: {}", response.getBody());
        return response.getBody().get("response");
    }

    public CancelPaymentResponseDTO cancelPayment(String impUid,
                                                  String merchantUid,
                                                  int amount,
                                                  String reason,
                                                  int checksum) {
        String token = getToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String,Object> body = new LinkedHashMap<>();
        body.put("imp_uid", impUid);
        body.put("merchant_uid",   merchantUid);
        body.put("amount", amount);
        body.put("checksum", checksum);
        if (reason != null && !reason.isBlank()) {
            body.put("reason", reason);
        }

        log.info("imp_uid={}, merchant_uid={}, amount={}, reason={}", impUid, merchantUid, amount, reason);

        HttpEntity<Map<String,Object>> request = new HttpEntity<>(body, headers);
        JsonNode json;
        try {
            ResponseEntity<JsonNode> resp = restTemplate.postForEntity(
                    baseUrl + "/payments/cancel",
                    request,
                    JsonNode.class
            );
            json = resp.getBody();
        } catch (HttpClientErrorException ex) {
            return CancelPaymentResponseDTO.builder()
                    .isSuccess(false)
                    .message("결제 취소 연동 실패: " + ex.getStatusText())
                    .build();
        }

        boolean ok = json.get("code").asInt() == 0;
        String msg = ok ? "결제 취소 성공" : json.get("message").asText();
        return CancelPaymentResponseDTO.builder()
                .isSuccess(ok)
                .message(msg)
                .build();
    }

    private String getToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String,String> creds = Map.of(
                "imp_key", apiKey,
                "imp_secret", apiSecret
        );

        log.info("[getToken] baseUrl={}, imp_key='{}', imp_secret='{}'", baseUrl, apiKey, apiSecret);

        String jsonBody;
        try {
            jsonBody = objectMapper.writeValueAsString(creds);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("토큰 요청 바디 직렬화 실패", e);
        }

        HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);

        ResponseEntity<JsonNode> resp = restTemplate.postForEntity(
                baseUrl + "/users/getToken",
                request,
                JsonNode.class
        );
        JsonNode json = resp.getBody();
        return json.get("response").get("access_token").asText();
    }
}
