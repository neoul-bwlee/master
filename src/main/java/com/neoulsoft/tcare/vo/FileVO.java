package com.neoulsoft.tcare.vo;

import com.neoulsoft.tcare.db.type.CryptoField;
import com.neoulsoft.tcare.db.type.LongDate;
import com.neoulsoft.tcare.db.type.String64;
import lombok.Data;

@Data
public class FileVO {
    private CryptoField seq;
    private String64 fileName;
    private String64 fileExt;
    private long fileSize;
    private String mimeType;
    private String fileUrl;
    private String originUrl;
    private LongDate registeredAt;

    private boolean marked = false;
}
