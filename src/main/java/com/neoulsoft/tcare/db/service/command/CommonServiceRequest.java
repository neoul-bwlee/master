package com.neoulsoft.tcare.db.service.command;

import com.google.gson.JsonObject;
import com.neoulsoft.tcare.config.Errors;
import com.neoulsoft.tcare.db.type.UserType;
import com.neoulsoft.tcare.ext.HandledServiceException;
import com.neoulsoft.tcare.ext.ResponseHelper;
import com.neoulsoft.tcare.controller.ApiController;
import com.neoulsoft.tcare.db.service.UserService;
import com.neoulsoft.tcare.vo.ResponseVO;
import com.neoulsoft.tcare.vo.UserVO;
import org.springframework.security.core.Authentication;

import javax.servlet.http.HttpServletRequest;

public abstract class CommonServiceRequest implements IServiceRequest {
    protected ApiController controller;
    protected HttpServletRequest httpRequest;
    protected Authentication authentication;
    protected JsonObject payload;

    protected int code;
    protected boolean executable;
    protected String message;

    protected UserVO user;
    protected boolean needAuth = true;

    public CommonServiceRequest(ApiController controller, HttpServletRequest request, JsonObject payload) {
        this(controller, request, null, payload);

        this.needAuth = false;
    }

    public CommonServiceRequest(ApiController controller, HttpServletRequest request, Authentication authentication, JsonObject payload) {
        this.controller = controller;
        this.httpRequest = request;
        this.authentication = authentication;
        this.payload = payload;

        beforeExecute();
    }

    private void beforeExecute() {
        if (authentication != null) {
            String accessToken = httpRequest.getHeader("Authorization");
            if (accessToken == null || (!accessToken.startsWith("bearer") && !accessToken.startsWith("Bearer"))) {
                executable = false;
                code = Errors.E403_AUTH_REQUIRED.getCode();
                message = Errors.E403_AUTH_REQUIRED.getMessage();
            }

            String username = authentication.getPrincipal().toString();
            try {
                user = controller.getService(UserService.class).getUser(
                        username + "@" + controller.getAuthClientId());

                if (user == null) {
                    executable = false;
                    code = Errors.E404_USER_NOT_FOUND.getCode();
                    message = Errors.E404_USER_NOT_FOUND.getMessage();
                }

                executable = true;
            } catch (HandledServiceException e) {
                executable = false;
                code = e.getCode();
                message = e.getMessage();
            }
        }
        else {
            needAuth = false;
            executable = true;
        }
    }

    public IServiceResponse execute() {
        ResponseVO response = null;

        try {
            needAuth = !isAllowedToGuest();
            if ((needAuth == true && (user == null || authentication == null))
                || (needAuth == true && user != null && user.getUserType().equals(UserType.GUEST))) {
                throw new HandledServiceException(Errors.E401_INVALID_AUTH.getCode(),
                        Errors.E401_INVALID_AUTH.getMessage());
            }

            response = onExecuteHandler();
        } catch (HandledServiceException e) {
            e.printStackTrace();
            response = ResponseHelper.error(e.getCode(), e.getMessage());
        }

        CommonServiceResponse csr = new CommonServiceResponse(response) {
            @Override
            public boolean isSuccess() {
                return getCode() == 200;
            }
        };
        return csr;
    }

    protected boolean isAllowedToGuest() {
        return false;
    }

    protected abstract ResponseVO onExecuteHandler() throws HandledServiceException;

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
