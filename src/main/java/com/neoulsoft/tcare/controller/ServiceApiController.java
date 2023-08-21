package com.neoulsoft.tcare.controller;

import com.google.gson.JsonObject;
import com.neoulsoft.tcare.db.service.command.IServiceRequest;
import com.neoulsoft.tcare.db.service.command.IServiceResponse;
import com.neoulsoft.tcare.db.service.command.UserCommandService;
import com.neoulsoft.tcare.ext.HandledServiceException;
import com.neoulsoft.tcare.vo.ResponseVO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(value = "/api/{serviceVersion}")
@RequiredArgsConstructor
public class ServiceApiController extends ApiController {
    private static final Logger logger = LoggerFactory.getLogger(ServiceApiController.class);

    @Value("${neoulsoft.auth.client-id}")
    private String authClientId;

    @Value("${neoulsoft.auth.client-secret}")
    private String authClientSecret;

    @Autowired
    private Environment envServer;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public String getAuthClientId() {
        return authClientId;
    }

    @Override
    public String getAuthClientSecret() {
        return authClientSecret;
    }

    @RequestMapping("/user")
    @ResponseBody
    public ResponseVO apiUser(@PathVariable("serviceVersion") String serviceVersion,
                              @RequestBody JsonObject payload, HttpServletRequest request,
                              Authentication authentication) throws HandledServiceException {
        IServiceRequest serviceRequest = getCommandService(UserCommandService.class)
                .handleRequest(this, request, authentication, payload);
        if (!serviceRequest.isExecutable())
            throw new HandledServiceException(serviceRequest.getCode(), serviceRequest.getMessage());

        IServiceResponse serviceResponse = serviceRequest.execute();
        if (serviceResponse.isSuccess())
            throw new HandledServiceException(serviceResponse.getCode(), serviceResponse.getMessage());

        return serviceResponse.getResponse();
    }

}
