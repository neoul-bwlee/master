package com.neoulsoft.tcare.db.service.command;


import com.neoulsoft.tcare.vo.ResponseVO;

public abstract class CommonServiceResponse implements IServiceResponse {
    protected int code;
    protected boolean executable;
    protected String message;

    protected ResponseVO response;

    public CommonServiceResponse(ResponseVO response) {
        this.response = response;
    }

    public ResponseVO getResponse() {
        return response;
    }

    public void setResponse(ResponseVO response) {
        this.response = response;
    }

    public boolean isExecutable() {
        return executable;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
