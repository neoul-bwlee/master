package com.neoulsoft.tcare.vo;

import com.neoulsoft.tcare.db.type.String64;
import lombok.Data;

@Data
public class AgencyVO {
    private String agencyCode;
    private String64 region;
    private String64 teamName;
    private String hqCode;
    private String64 agencyName;
    private String64 storeName;
    private String64 address;
    private String createdAt;
    private String openedAt;
    private String64 storeType;
    private String64 fundType;
    private String area;
    private String64 agencyStatus;
    private String64 serviceStatus;
    private String64 agencyRepName;
    private String agencyPhone;
    private String agencyOpt1;
    private String agencyOpt2;
}
