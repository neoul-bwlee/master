package com.neoulsoft.tcare.vo;

import lombok.Data;

@Data
public class AuthRefreshRequestVO {
    private String clientId;
    private String clientSecret;
    private String refreshToken;
}

