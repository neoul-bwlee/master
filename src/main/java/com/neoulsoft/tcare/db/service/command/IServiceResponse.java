package com.neoulsoft.tcare.db.service.command;

import com.neoulsoft.tcare.vo.ResponseVO;

public interface IServiceResponse {
    boolean isSuccess();
    int getCode();
    String getMessage();

    ResponseVO getResponse();
    void setResponse(ResponseVO response);
}
