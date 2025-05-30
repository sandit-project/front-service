package com.example.frontservice.config;

import org.apache.catalina.connector.Connector;
import org.apache.catalina.valves.RemoteIpValve;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HttpRedirectConfig {

    @Bean
    public TomcatServletWebServerFactory servletContainer() {
        TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();

        // 1. HTTP → HTTPS 리디렉션용 커넥터 추가
        factory.addAdditionalTomcatConnectors(httpToHttpsRedirectConnector());

        // 2. x-forwarded-* 헤더 인식 위한 RemoteIpValve 설정
        RemoteIpValve valve = new RemoteIpValve();
        valve.setProtocolHeader("x-forwarded-proto");
        valve.setRemoteIpHeader("x-forwarded-for");
        valve.setInternalProxies(".*"); // 모든 프록시 허용

        factory.addEngineValves(valve);
        return factory;
    }

    private Connector httpToHttpsRedirectConnector() {
        Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
        connector.setScheme("http");
        connector.setPort(80); // CLB에서 HTTP 요청 수신
        connector.setSecure(false);
        connector.setRedirectPort(443); // HTTPS로 리디렉션
        return connector;
    }
}
