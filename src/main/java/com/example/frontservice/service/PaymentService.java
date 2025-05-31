package com.example.frontservice.service;

import com.example.frontservice.dto.order.CancelPaymentResponseDTO;
import com.example.frontservice.dto.order.IamportCancelRequest;
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

        restTemplate.getMessageConverters().forEach(c -> log.info("컨버터: {}", c.getClass()));

        String token = getToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

//        Map<String,Object> body = new LinkedHashMap<>();
//        body.put("imp_uid", impUid);
//        body.put("merchant_uid",   merchantUid);
//        body.put("amount", amount);
//        body.put("checksum", checksum);
//        if (reason != null && !reason.isBlank()) {
//            body.put("reason", reason);
//        }

        IamportCancelRequest cancelRequest = IamportCancelRequest.builder()
                .impUid((impUid != null && !impUid.isBlank()) ? impUid : null)
                .merchantUid(merchantUid)
                .amount(amount)
                .checksum(checksum)
                .reason(reason)
                .build();

        log.info("imp_uid={}, merchant_uid={}, amount={}, reason={}", impUid, merchantUid, amount, reason);

        try {
            log.info("[결제 취소 요청 바디] {}", objectMapper.writeValueAsString(cancelRequest));
        } catch (JsonProcessingException e) {
            log.warn("[결제 취소 요청 바디 직렬화 실패]", e);
        }

        HttpEntity<IamportCancelRequest> request = new HttpEntity<>(cancelRequest, headers);
        JsonNode json;
        try {
            ResponseEntity<JsonNode> resp = restTemplate.postForEntity(
                    baseUrl + "/payments/cancel",
                    request,
                    JsonNode.class
            );
            json = resp.getBody();
            log.info("[결제 취소 응답] {}", json.toPrettyString());
        } catch (HttpClientErrorException ex) {
            log.error("[결제 취소 실패] HTTP 상태: {}, 응답: {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            return CancelPaymentResponseDTO.builder()
                    .isSuccess(false)
                    .message("결제 취소 연동 실패: " + ex.getStatusText())
                    .build();
        }

        boolean ok = json.get("code").asInt() == 0;
        String msg = ok ? "결제 취소 성공" : json.get("message").asText();
        log.info("[취소 결과] 성공 여부: {}, 메시지: {}", ok, msg);
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
        log.info("[결제 취소 요청 Entity] {}", request);

        ResponseEntity<JsonNode> resp = restTemplate.postForEntity(
                baseUrl + "/users/getToken",
                request,
                JsonNode.class
        );
        JsonNode json = resp.getBody();
        return json.get("response").get("access_token").asText();
    }
}
