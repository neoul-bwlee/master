package com.neoulsoft.tcare.vo;

import java.util.List;

import lombok.Data;

@Data
public class EnvironmentVO {
    private List<String> allowedAppVersions;
    private List<String> needUpdateAppVersions;
    private boolean useEncryption;

    private String androidServiceVersion;
    private String iosServiceVersion;
    private String webappServiceVersion;

    private String activeHost;
    private String uploadHost;

    private boolean debugMode;
}
