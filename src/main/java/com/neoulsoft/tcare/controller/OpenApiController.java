package com.neoulsoft.tcare.controller;

import com.google.gson.JsonObject;
import com.neoulsoft.tcare.TCareWebApplication;
import com.neoulsoft.tcare.config.Errors;
import com.neoulsoft.tcare.config.ServerConstants;
import com.neoulsoft.tcare.db.service.AgencyService;
import com.neoulsoft.tcare.db.service.UserService;
import com.neoulsoft.tcare.db.type.CryptoField;
import com.neoulsoft.tcare.db.type.LongDate;
import com.neoulsoft.tcare.db.type.String64;
import com.neoulsoft.tcare.db.type.UserType;
import com.neoulsoft.tcare.ext.HandledServiceException;
import com.neoulsoft.tcare.ext.ResponseHelper;
import com.neoulsoft.tcare.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;

import static org.springframework.http.HttpStatus.Series.CLIENT_ERROR;
import static org.springframework.http.HttpStatus.Series.SERVER_ERROR;

@Controller
@RequestMapping(value = "/open-api")
@RequiredArgsConstructor
public class OpenApiController extends ApiController {
    private static final Logger logger = LoggerFactory.getLogger(OpenApiController.class);

    @Value("${tcare.host.server}")
    private String serverHost;

    @Value("${tcare.auth-root}")
    private String authRoot;

    @Value("${neoulsoft.auth.client-id}")
    private String authClientId;

    @Value("${neoulsoft.auth.client-secret}")
    private String authClientSecret;

    @Autowired
    private Environment envServer;

    @Autowired
    private RestTemplate restTemplate;

    private static long EMAIL_NEXT_SEQ = System.currentTimeMillis();

    // env
    @RequestMapping(value = "/env")
    @ResponseBody
    public Object openApiEnvironment() throws HandledServiceException {
        EnvironmentVO env = new EnvironmentVO();
        env.setAllowedAppVersions(Arrays.asList("1.0.0"));
        env.setNeedUpdateAppVersions(new ArrayList<String>());
        env.setUseEncryption(false);
        env.setAndroidServiceVersion("0.0.1");
        env.setIosServiceVersion("0.0.1");
        env.setWebappServiceVersion("0.0.1");
        env.setActiveHost(envServer.getProperty("tcare.active.host"));
        if (env.getActiveHost() == null || env.getActiveHost().isEmpty() == true) {
            env.setActiveHost("http://" + serverHost + ":59443");
        }
        env.setUploadHost(envServer.getProperty("tcare.upload.host"));
        if (env.getUploadHost() == null || env.getUploadHost().isEmpty() == true) {
            env.setUploadHost(env.getActiveHost());
        }

        boolean debug = false;
        if (TCareWebApplication.global.getEnvironment() != null
                && TCareWebApplication.global.getEnvironment().getProperty("debug") != null) {
            debug = Boolean.parseBoolean(TCareWebApplication.global.getEnvironment().getProperty("debug"));
        }
        env.setDebugMode(debug);

        return env;
    }

    // verify
    @RequestMapping(value = "/verify")
    @ResponseBody
    public Object openApiVerify(@RequestBody JsonObject payload) throws HandledServiceException {
        String epVerify = authRoot + "/auth/verify";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        payload.addProperty("clientId", authClientId);
        payload.addProperty("clientSecret", authClientSecret);
        HttpEntity<JsonObject> reqPost = new HttpEntity<>(payload, headers);

        JsonObject verifyResultData = restTemplate.postForObject(epVerify, reqPost, JsonObject.class);
        VerifyResultVO verifyResult = ServerConstants.GSON.fromJson(verifyResultData, VerifyResultVO.class);

        if (verifyResult.getNauthUserInfo() != null) {
            UserVO user = getService(UserService.class).getUserBySeq(verifyResult.getNauthUserInfo().getUid());
            if (user != null) {
                verifyResult.setUserInfo(user);
                verifyResult.setNauthUserInfo(null);

                user.setAgencyInfo(getService(AgencyService.class).getAgencyByCode(user.getUsername()));
            }
        }

        return verifyResult;
    }

    // refresh
    @RequestMapping(value = "/refresh")
    @ResponseBody
    public Object openApiRefresh(@RequestBody JsonObject payload) throws HandledServiceException {
        String epRefresh = authRoot + "/auth/refresh";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        payload.addProperty("clientId", authClientId);
        payload.addProperty("clientSecret", authClientSecret);
        HttpEntity<JsonObject> reqPost = new HttpEntity<>(payload, headers);
        VerifyResultVO refreshResult = restTemplate.postForObject(epRefresh, reqPost, VerifyResultVO.class);

        if (refreshResult.getNauthUserInfo() != null) {
            UserVO user = getService(UserService.class).getUserBySeq(refreshResult.getNauthUserInfo().getUid());
            if (user != null) {
                refreshResult.setUserInfo(user);
                refreshResult.setNauthUserInfo(null);
            }
        }

        return refreshResult;
    }

    // login
    @RequestMapping(value = "/login")
    @ResponseBody
    public Object openApiLogin(HttpServletRequest request, @RequestBody JsonObject payload) throws HandledServiceException {
        String accessToken = request.getHeader("Authorization");
        if (accessToken == null) {
            throw new HandledServiceException(Errors.E401_WRONG_ATTEMPT.getCode(),
                    Errors.E401_WRONG_ATTEMPT.getMessage(getServerLocale()));
        }

        if (payload == null || payload.isJsonNull() == true) {
            throw new HandledServiceException(Errors.E404_PARAM_NOT_FOUND.getCode(),
                    Errors.E404_PARAM_NOT_FOUND.getMessage(getServerLocale()));
        }

        String epLogin = authRoot + "/auth/login";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", request.getHeader("Authorization"));
        headers.setContentType(MediaType.APPLICATION_JSON);
        payload.addProperty("clientId", authClientId);
        payload.addProperty("clientSecret", authClientSecret);
        HttpEntity<JsonObject> reqPost = new HttpEntity<>(payload, headers);

        ResponseErrorHandler errorHandler = restTemplate.getErrorHandler();
        restTemplate.setErrorHandler(new ResponseErrorHandler() {
            @Override
            public boolean hasError(ClientHttpResponse response) throws IOException {
                return (response.getStatusCode().series() == CLIENT_ERROR
                        || response.getStatusCode().series() == SERVER_ERROR);
            }

            @SneakyThrows
            @Override
            public void handleError(ClientHttpResponse clientResponse) throws IOException {
                if (clientResponse.getStatusCode().series() == HttpStatus.Series.SERVER_ERROR) {
                    // handle SERVER_ERROR
                } else if (clientResponse.getStatusCode().series() == HttpStatus.Series.CLIENT_ERROR) {
                    String responseText = null;
                    try (Scanner scanner = new Scanner(clientResponse.getBody(), StandardCharsets.UTF_8.name())) {
                        responseText = scanner.useDelimiter("\\A").next();
                    }
                    ResponseVO respError = ServerConstants.GSON.fromJson(responseText, ResponseVO.class);
                    String respErrorMessage = "";
                    if (respError.getMessage() instanceof String)
                        respErrorMessage = (String) respError.getMessage();
                    else if (respError.getMessage() instanceof String64)
                        respErrorMessage = ((String64) respError.getMessage()).originOf();

                    if (respError.getCode() == 403) {
                        if (respErrorMessage.contains("locked"))
                            respErrorMessage = Errors.E403_ACCOUNT_LOCKED.getMessage(getServerLocale());
                        else
                            respErrorMessage = Errors.E403_BAD_CRED.getMessage(getServerLocale());
                    }
                    else if (respError.getCode() == 401)
                        respErrorMessage = Errors.E401_INVALID_AUTH.getMessage(getServerLocale());
                    else if (respError.getCode() == 421)
                        respErrorMessage = Errors.E421_EXIST_USER.getMessage(getServerLocale());
                    else if (respError.getCode() == 422)
                        respErrorMessage = Errors.E422_EXIST_EMAIL.getMessage(getServerLocale());
                    else if (respError.getCode() == 423)
                        respErrorMessage = Errors.E423_EXIST_PROVIDER.getMessage(getServerLocale());
                    else
                        respErrorMessage = Errors.E400_LOGIN_FAILED.getMessage(getServerLocale());

                    throw new HandledServiceException(respError.getCode(), respErrorMessage);
                }
            }
        });

        JsonObject loginResultData = restTemplate.postForObject(epLogin, reqPost, JsonObject.class);
        VerifyResultVO loginResult = ServerConstants.GSON.fromJson(loginResultData, VerifyResultVO.class);

        restTemplate.setErrorHandler(errorHandler);

        UserVO user = getService(UserService.class).getUserBySeq(loginResult.getNauthUserInfo().getUid());
        if (user == null) {
            throw new HandledServiceException(Errors.E404_USER_NOT_FOUND.getCode(),
                    Errors.E404_USER_NOT_FOUND.getMessage(getServerLocale()));
        }

        if (!checkJsonEmpty(payload, "pushToken"))
            user.setPushToken(payload.get("pushToken").getAsString());
        if (!checkJsonEmpty(payload, "deviceOsType"))
            user.setDeviceOsType(payload.get("deviceOsType").getAsString());

        getService(UserService.class).updateUser(user);

        loginResult.setUserInfo(user);
        loginResult.setNauthUserInfo(null);

        user.setAgencyInfo(getService(AgencyService.class).getAgencyByCode(user.getUsername()));

        JsonObject loginPayload = new JsonObject();
        loginPayload.addProperty("username", payload.get("username").getAsString());
        //loginPayload.addProperty("password", payload.get("password").getAsString());
        loginPayload.addProperty("provider", payload.get("provider").getAsString());

        loginResult.setLoginToken(new CryptoField(new String64(ServerConstants.GSON.toJson(loginPayload)).valueOf()));

        return loginResult;
    }

    // join
    @RequestMapping(value = "/join")
    @ResponseBody
    public Object openApiJoin(HttpServletRequest request, @RequestBody JsonObject payload) throws HandledServiceException {
        String accessToken = request.getHeader("Authorization");
        if (accessToken == null) {
            throw new HandledServiceException(Errors.E401_WRONG_ATTEMPT.getCode(),
                    Errors.E401_WRONG_ATTEMPT.getMessage(getServerLocale()));
        }

        if (payload == null || payload.isJsonNull() == true) {
            throw new HandledServiceException(Errors.E404_PARAM_NOT_FOUND.getCode(),
                    Errors.E404_PARAM_NOT_FOUND.getMessage(getServerLocale()));
        }

        UserVO user = getService(UserService.class).getUser(payload.get("username").getAsString() + "@" + authClientId);
        if (user != null) {
            throw new HandledServiceException(Errors.E422_EXIST_EMAIL.getCode(),
                    Errors.E422_EXIST_EMAIL.getMessage(getServerLocale()));
        }

        throw new HandledServiceException(411, "Join not allowed.");
    }

    @RequestMapping(value = "/extract-login-payload")
    @ResponseBody
    public Object openApiExtractLoginPayload(HttpServletRequest request, @RequestBody JsonObject payload) throws HandledServiceException {
        String accessToken = request.getHeader("Authorization");
        if (accessToken == null) {
            throw new HandledServiceException(Errors.E401_WRONG_ATTEMPT.getCode(),
                    Errors.E401_WRONG_ATTEMPT.getMessage(getServerLocale()));
        }

        if (payload == null || payload.isJsonNull() == true) {
            throw new HandledServiceException(Errors.E404_PARAM_NOT_FOUND.getCode(),
                    Errors.E404_PARAM_NOT_FOUND.getMessage(getServerLocale()));
        }

        if (checkJsonEmpty(payload, "loginToken")) {
            throw new HandledServiceException(Errors.E404_PARAM_NOT_FOUND.getCode(),
                    Errors.E404_PARAM_NOT_FOUND.getMessage(getServerLocale()));
        }

        CryptoField loginToken = CryptoField.decode(payload.get("loginToken").getAsString(), "");
        if (loginToken == null || loginToken.isEmpty()) {
            throw new HandledServiceException(Errors.E411_DECRYPT_FAILED.getCode(),
                    Errors.E411_DECRYPT_FAILED.getMessage(getServerLocale()));
        }

        String64 loginData = String64.decode(loginToken.originOf());
        if (loginData == null || loginData.isEmpty()) {
            throw new HandledServiceException(Errors.E411_DECRYPT_FAILED.getCode(),
                    Errors.E411_DECRYPT_FAILED.getMessage(getServerLocale()));
        }

        JsonObject loginPayload = ServerConstants.GSON.fromJson(loginData.originOf(), JsonObject.class);
        return loginPayload;
    }

    @RequestMapping(value = "/upload/{resourceFolder}")
    @ResponseBody
    public ResponseVO openApiUpload(@RequestParam("attach") MultipartFile attach,
                                    @PathVariable("resourceFolder") String resourceFolder) throws Exception {

        return ResponseHelper.response(200, "Success - Uploaded", "");
    }

}
