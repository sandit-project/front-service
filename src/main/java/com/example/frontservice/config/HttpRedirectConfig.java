package com.example.frontservice.config;

import org.apache.catalina.connector.Connector;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HttpRedirectConfig {

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> containerCustomizer() {
        return factory -> {
            factory.addAdditionalTomcatConnectors(httpToHttpsRedirectConnector());
        };
    }

    private Connector httpToHttpsRedirectConnector() {
        Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
        connector.setScheme("http");
        connector.setPort(80);              // CLB에서 HTTP 포트로 들어오는 것 처리
        connector.setSecure(false);
        connector.setRedirectPort(443);     // 리디렉션 대상 포트 (CLB가 HTTPS용으로 연결하는 443)
        return connector;
    }
}
