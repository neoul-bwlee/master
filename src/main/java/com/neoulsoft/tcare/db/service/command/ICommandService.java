package com.neoulsoft.tcare.db.service.command;

import com.google.gson.JsonObject;
import com.neoulsoft.tcare.controller.ApiController;
import org.springframework.security.core.Authentication;

import javax.servlet.http.HttpServletRequest;

public interface ICommandService {
    IServiceRequest handleRequest(ApiController controller, HttpServletRequest request, Authentication authentication, JsonObject payload);
}
