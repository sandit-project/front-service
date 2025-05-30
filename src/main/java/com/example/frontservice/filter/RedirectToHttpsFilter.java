package com.example.frontservice.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RedirectToHttpsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String protoHeader = httpRequest.getHeader("x-forwarded-proto");

        // x-forwarded-proto가 http이면 https로 리디렉션
        if ("http".equalsIgnoreCase(protoHeader)) {
            String url = "https://" + httpRequest.getServerName() + httpRequest.getRequestURI();
            if (httpRequest.getQueryString() != null) {
                url += "?" + httpRequest.getQueryString();
            }
            httpResponse.sendRedirect(url);
            return;
        }

        chain.doFilter(request, response);
    }
}
