package com.neoulsoft.tcare.db.service.command;

import com.google.gson.JsonObject;
import com.neoulsoft.tcare.controller.ApiController;
import com.neoulsoft.tcare.ext.HandledServiceException;
import com.neoulsoft.tcare.ext.ResponseHelper;
import com.neoulsoft.tcare.vo.ResponseVO;
import org.apache.commons.text.CaseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Constructor;

@Service("userCommandService")
public class UserCommandService extends AbstractCommandService {

    @Autowired
    private static RestTemplate restTemplate;

    @Override
    protected Constructor<?> getCommandConstructor(String command, Authentication authentication) {
        try {
            Class<?> clazz = Class.forName(getClass().getCanonicalName() + "$"
                    + CaseUtils.toCamelCase(command, true, '-'));
            Constructor<?> constructor = null;
            if (authentication == null)
                constructor = clazz.getConstructor(ApiController.class, HttpServletRequest.class, JsonObject.class);
            else
                constructor = clazz.getConstructor(ApiController.class, HttpServletRequest.class, Authentication.class, JsonObject.class);
            return constructor;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static class ServiceData extends CommonServiceRequest {

        public ServiceData(ApiController controller, HttpServletRequest request, JsonObject payload) {
            super(controller, request, payload);
        }

        public ServiceData(ApiController controller, HttpServletRequest request, Authentication authentication, JsonObject payload) {
            super(controller, request, authentication, payload);
        }

        @Override
        protected boolean isAllowedToGuest() {
            return true;
        }

        @Transactional
        protected ResponseVO onExecuteHandler() throws HandledServiceException {
            JsonObject serviceData = new JsonObject();

            return ResponseHelper.response(200, "Success - service data", serviceData);
        }
    }

}