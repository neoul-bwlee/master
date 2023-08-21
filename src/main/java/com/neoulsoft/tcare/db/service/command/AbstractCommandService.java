package com.neoulsoft.tcare.db.service.command;

import com.google.gson.JsonObject;
import com.neoulsoft.tcare.config.Errors;
import com.neoulsoft.tcare.controller.ApiController;
import org.springframework.security.core.Authentication;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public abstract class AbstractCommandService implements ICommandService {

    @Override
    public IServiceRequest handleRequest(ApiController controller, HttpServletRequest request, Authentication authentication, JsonObject payload) {
        String command = "";
        if (!controller.checkJsonEmpty(payload, "command"))
            command = payload.get("command").getAsString();

        if (command == null || command.isEmpty())
            return onCommandUnknown();

        IServiceRequest serviceRequest = null;
        Constructor<?> constructor = getCommandConstructor(command, authentication);
        if (constructor == null)
            return onCommandNotExecutable(Errors.E411_HANDLER_NOT_FOUND.getCode(),
                    Errors.E411_HANDLER_NOT_FOUND.getMessage());

        try {
            Object instance = null;

            if (authentication == null)
                instance = constructor.newInstance(controller, request, payload);
            else
                instance = constructor.newInstance(controller, request, authentication, payload);

            serviceRequest = (IServiceRequest) instance;
        } catch (InstantiationException | IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
            serviceRequest = onCommandNotExecutable(411, e.getMessage());
        }

        return serviceRequest;
    }

    protected abstract Constructor<?> getCommandConstructor(String command, Authentication authentication);

    private IServiceRequest onCommandNotExecutable(int code, String message) {
        return new CommandNotExecutable(code, message);
    }

    private IServiceRequest onCommandUnknown() {
        return new UnknownCommandRequest();
    }

    private class CommandNotExecutable implements IServiceRequest {
        private int code;
        private String message;

        public CommandNotExecutable(int code, String message) {
            this.code = code;
            this.message = message;
        }

        @Override
        public IServiceResponse execute() {
            return null;
        }

        @Override
        public boolean isExecutable() {
            return false;
        }

        @Override
        public int getCode() {
            return code;
        }

        @Override
        public String getMessage() {
            return message;
        }
    }

    private class UnknownCommandRequest implements IServiceRequest {

        @Override
        public IServiceResponse execute() {
            return null;
        }

        @Override
        public boolean isExecutable() {
            return false;
        }

        @Override
        public int getCode() {
            return 411;
        }

        @Override
        public String getMessage() {
            return "파라미터를 확인하세요.";
        }
    }
}
