package com.neoulsoft.tcare.vo;

import lombok.Data;

import java.util.Map;

@Data
public class AuthVerifyRequestVO {
    private String clientId;
    private String clientSecret;
    private String accessToken;
    private String deviceOsType;
    private Map<String, String> extras;
}

