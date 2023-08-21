package com.neoulsoft.tcare.db.service.command;

public interface IServiceRequest {
    IServiceResponse execute();
    boolean isExecutable();
    int getCode();
    String getMessage();
}
