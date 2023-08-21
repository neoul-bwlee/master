package com.neoulsoft.tcare.config;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public enum Errors {
    E400_LOGIN_FAILED(400, "LOGIN_FAILED"),
    E400_JOIN_FAILED(400, "JOIN_FAILED"),

    E401_WRONG_ATTEMPT(401, "WRONG_ATTEMPT"),
    E401_INVALID_AUTH(401, "INVALID_AUTH"),

    E403_ACCOUNT_LOCKED(403, "ACCOUNT_LOCKED"),
    E403_BAD_CRED(403, "BAD_CRED"),
    E403_AUTH_REQUIRED(403, "AUTH_REQUIRED"),
    E403_NOT_AUTHORIZED(403, "NOT_AUTHORIZED"),

    E404_PARAM_NOT_FOUND(404, "PARAM_NOT_FOUND"),
    E404_USER_NOT_FOUND(404, "USER_NOT_FOUND"),
    E404_AUTH_REQ_NOT_FOUND(404, "AUTH_REQ_NOT_FOUND"),
    E404_ITEM_NOT_FOUND(404, "ITEM_NOT_FOUND"),
    E404_ACCOUNT_NOT_FOUND(404, "ACCOUNT_NOT_FOUND"),
    E404_RECV_ACCOUNT_NOT_FOUND(404, "RECV_ACCOUNT_NOT_FOUND"),

    E410_DB_ERROR(410, "DB_ERROR"),

    E411_HANDLER_NOT_FOUND(411, "HANDLER_NOT_FOUND"),
    E411_DECRYPT_FAILED(411, "DECRYPT_FAILED"),
    E411_EMAIL_NOT_MATCH(411, "EMAIL_NOT_MATCH"),
    E411_AUTH_NOT_MATCH(411, "AUTH_NOT_MATCH"),
    E411_AUTH_TIMEOUT(411, "AUTH_TIMEOUT"),
    E411_ALREADY_AUTHORIZED(411, "ALREADY_AUTHORIZED"),
    E411_DATA_ERROR(411, "DATA_ERROR"),
    E411_ACCOUNT_NOT_MINE(411, "ACCOUNT_NOT_MINE"),
    E411_RECV_ACCOUNT_INVALID(411, "RECV_ACCOUNT_INVALID"),
    E411_ACCOUNT_EMPTY_ASSETS(411, "ACCOUNT_EMPTY_ASSETS"),
    E411_BALANCE_INSUFFICIENT(411, "BALANCE_INSUFFICIENT"),
    E411_DUP_NICKNAME(411, "DUP_NICKNAME"),
    E411_PROD_SOLDOUT(411, "PROD_SOLDOUT"),

    E412_AZURE_UPLOAD_FAILED(412, "AZURE_UPLOAD_FAILED"),
    E412_TX_FAILED(412, "TX_FAILED"),

    E421_EXIST_USER(421, "EXIST_USER"),
    E422_EXIST_EMAIL(422, "EXIST_EMAIL"),
    E423_EXIST_PROVIDER(423, "E423_EXIST_PROVIDER"),

    NULL(999, "NULL");

    private int code;
    private String langToken;
    private String message;
    private Locale locale;

    private static final Map<String, String> langMap = new HashMap<>();
    private static final Map<String, Errors> langEnumMap = new HashMap<>();

    Errors(int code, String langToken) {
        this(code, langToken, Locale.getDefault());
    }

    Errors(int code, String langToken, Locale locale) {
        this.code = code;
        this.langToken = langToken;
        this.locale = (locale == null) ? Locale.getDefault() : locale;
    }

    public int getCode() {
        return code;
    }
    public String getErrorCode() {
        return "E" + code + "_" + langToken;
    }
    public String getLangToken() {
        return langToken;
    }
    public String getMessage() {
        return this.getMessage(Locale.getDefault());
    }
    public String getMessage(Locale locale) {
        return langMap.get("E" + code + "_" + langToken + "_" + locale.getLanguage().toUpperCase(Locale.ROOT));
    }

    @Override
    public String toString() {
        return getErrorCode() + "," + getMessage(Locale.getDefault());
    }

    public static Errors parse(String errorCode) {
        return langEnumMap.get(errorCode);
    }

    public static Errors getType(int code, String langToken) {
        return langEnumMap.get("E" + code + "_" + langToken);
    }

    static {
        langEnumMap.put("E400_LOGIN_FAILED", E400_LOGIN_FAILED);
        langMap.put("E400_LOGIN_FAILED_KO", "로그인에 실패했습니다.");
        langMap.put("E400_LOGIN_FAILED_EN", "Login failed.");

        langEnumMap.put("E400_JOIN_FAILED", E400_JOIN_FAILED);
        langMap.put("E400_JOIN_FAILED_KO", "회원 가입에 실패했습니다.");
        langMap.put("E400_JOIN_FAILED_EN", "Sign-up failed.");

        langEnumMap.put("E401_WRONG_ATTEMPT", E401_WRONG_ATTEMPT);
        langMap.put("E401_WRONG_ATTEMPT_KO", "잘못된 인증 시도입니다.");
        langMap.put("E401_WRONG_ATTEMPT_EN", "Wrong authentication attempt.");

        langEnumMap.put("E401_INVALID_AUTH", E401_INVALID_AUTH);
        langMap.put("E401_INVALID_AUTH_KO", "인증을 실패했습니다. 로그인 과정을 다시 시도해 주세요.");
        langMap.put("E401_INVALID_AUTH_EN", "Authorization failed. Retry to login.");

        langEnumMap.put("E403_ACCOUNT_LOCKED", E403_ACCOUNT_LOCKED);
        langMap.put("E403_ACCOUNT_LOCKED_KO", "로그인이 실패했습니다. 계정이 잠겨 있습니다.");
        langMap.put("E403_ACCOUNT_LOCKED_EN", "Login failed. Account is locked.");

        langEnumMap.put("E403_BAD_CRED", E403_BAD_CRED);
        langMap.put("E403_BAD_CRED_KO", "로그인이 실패했습니다. 아이디 혹은 비밀번호를 확인하세요.");
        langMap.put("E403_BAD_CRED_EN", "Login failed. Bad credentials.");

        langEnumMap.put("E403_AUTH_REQUIRED", E403_AUTH_REQUIRED);
        langMap.put("E403_AUTH_REQUIRED_KO", "권한이 필요합니다.");
        langMap.put("E403_AUTH_REQUIRED_EN", "Authentication required.");

        langEnumMap.put("E403_NOT_AUTHORIZED", E403_NOT_AUTHORIZED);
        langMap.put("E403_NOT_AUTHORIZED_KO", "인증에 실패했거나 인증이 진행되지 않았습니다.");
        langMap.put("E403_NOT_AUTHORIZED_EN", "Authorization failed or not performed.");

        langEnumMap.put("E404_PARAM_NOT_FOUND", E404_PARAM_NOT_FOUND);
        langMap.put("E404_PARAM_NOT_FOUND_KO", "파라미터가 없습니다.");
        langMap.put("E404_PARAM_NOT_FOUND_EN", "Parameter is required.");

        langEnumMap.put("E404_ITEM_NOT_FOUND", E404_ITEM_NOT_FOUND);
        langMap.put("E404_ITEM_NOT_FOUND_KO", "요청 내용을 찾을 수 없습니다.");
        langMap.put("E404_ITEM_NOT_FOUND_EN", "Information request failed.");

        langEnumMap.put("E404_USER_NOT_FOUND", E404_USER_NOT_FOUND);
        langMap.put("E404_USER_NOT_FOUND_KO", "사용자를 찾을 수 없습니다.");
        langMap.put("E404_USER_NOT_FOUND_EN", "User not found.");

        langEnumMap.put("E404_AUTH_REQ_NOT_FOUND", E404_AUTH_REQ_NOT_FOUND);
        langMap.put("E404_AUTH_REQ_NOT_FOUND_KO", "인증 요청 정보가 없습니다.");
        langMap.put("E404_AUTH_REQ_NOT_FOUND_EN", "Authorization request not found.");

        langEnumMap.put("E404_ACCOUNT_NOT_FOUND", E404_ACCOUNT_NOT_FOUND);
        langMap.put("E404_ACCOUNT_NOT_FOUND_KO", "지갑 정보를 찾을 수 없습니다.");
        langMap.put("E404_ACCOUNT_NOT_FOUND_EN", "Account not found.");

        langEnumMap.put("E404_RECV_ACCOUNT_NOT_FOUND", E404_RECV_ACCOUNT_NOT_FOUND);
        langMap.put("E404_RECV_ACCOUNT_NOT_FOUND_KO", "받는 지갑 정보를 찾을 수 없습니다.");
        langMap.put("E404_RECV_ACCOUNT_NOT_FOUND_EN", "Recipient account not found.");

        langEnumMap.put("E410_DB_ERROR", E410_DB_ERROR);
        langMap.put("E410_DB_ERROR_KO", "DB_ERROR [ %s ]");
        langMap.put("E410_DB_ERROR_EN", "DB_ERROR [ %s ]");

        langEnumMap.put("E411_HANDLER_NOT_FOUND", E411_HANDLER_NOT_FOUND);
        langMap.put("E411_HANDLER_NOT_FOUND_KO", "요청을 수행할 수 없습니다. [Handler not found]");
        langMap.put("E411_HANDLER_NOT_FOUND_EN", "Request execution failed. [Handler not found]");

        langEnumMap.put("E411_DECRYPT_FAILED", E411_DECRYPT_FAILED);
        langMap.put("E411_DECRYPT_FAILED_KO", "파라미터를 해석할 수 없습니다.");
        langMap.put("E411_DECRYPT_FAILED_EN", "Parameter decrypt failed.");

        langEnumMap.put("E411_EMAIL_NOT_MATCH", E411_EMAIL_NOT_MATCH);
        langMap.put("E411_EMAIL_NOT_MATCH_KO", "요청한 이메일과 맞지 않습니다.");
        langMap.put("E411_EMAIL_NOT_MATCH_EN", "Requested email not match.");

        langEnumMap.put("E411_AUTH_NOT_MATCH", E411_AUTH_NOT_MATCH);
        langMap.put("E411_AUTH_NOT_MATCH_KO", "인증번호가 맞지 않습니다.");
        langMap.put("E411_AUTH_NOT_MATCH_EN", "Authorization number not match.");

        langEnumMap.put("E411_AUTH_TIMEOUT", E411_AUTH_TIMEOUT);
        langMap.put("E411_AUTH_TIMEOUT_KO", "인증 유효 시간이 초과되었습니다. 다시 시도해 주세요.");
        langMap.put("E411_AUTH_TIMEOUT_EN", "Execution timed out. Retry to verification.");

        langEnumMap.put("E411_ALREADY_AUTHORIZED", E411_ALREADY_AUTHORIZED);
        langMap.put("E411_ALREADY_AUTHORIZED_KO", "이미 인증이 완료된 요청입니다. 다시 시도해 주세요.");
        langMap.put("E411_ALREADY_AUTHORIZED_EN", "Already authorized. Retry to verification.");

        langEnumMap.put("E411_DATA_ERROR", E411_DATA_ERROR);
        langMap.put("E411_DATA_ERROR_KO", "데이터 오류 [ %s ]");
        langMap.put("E411_DATA_ERROR_EN", "DATA_ERROR [ %s ]");

        langEnumMap.put("E411_ACCOUNT_NOT_MINE", E411_ACCOUNT_NOT_MINE);
        langMap.put("E411_ACCOUNT_NOT_MINE_KO", "내 지갑이 아닙니다.");
        langMap.put("E411_ACCOUNT_NOT_MINE_EN", "Account is not mine.");

        langEnumMap.put("E411_RECV_ACCOUNT_INVALID", E411_RECV_ACCOUNT_INVALID);
        langMap.put("E411_RECV_ACCOUNT_INVALID_KO", "대상 지갑 주소가 올바르지 않습니다.");
        langMap.put("E411_RECV_ACCOUNT_INVALID_EN", "Invalid recipient account.");

        langEnumMap.put("E411_ACCOUNT_EMPTY_ASSETS", E411_ACCOUNT_EMPTY_ASSETS);
        langMap.put("E411_ACCOUNT_EMPTY_ASSETS_KO", "지갑에 자산이 없습니다.");
        langMap.put("E411_ACCOUNT_EMPTY_ASSETS_EN", "Account has empty assets.");

        langEnumMap.put("E411_BALANCE_INSUFFICIENT", E411_BALANCE_INSUFFICIENT);
        langMap.put("E411_BALANCE_INSUFFICIENT_KO", "잔고가 부족합니다.");
        langMap.put("E411_BALANCE_INSUFFICIENT_EN", "Your balance is insufficient.");

        langEnumMap.put("E411_DUP_NICKNAME", E411_DUP_NICKNAME);
        langMap.put("E411_DUP_NICKNAME_KO", "중복된 닉네임이 있습니다.");
        langMap.put("E411_DUP_NICKNAME_EN", "Nickname duplicated.");

        langEnumMap.put("E411_PROD_SOLDOUT", E411_PROD_SOLDOUT);
        langMap.put("E411_PROD_SOLDOUT_KO", "스테이킹 상품이 소진되었습니다.");
        langMap.put("E411_PROD_SOLDOUT_EN", "Staking product sold out.");

        langEnumMap.put("E412_AZURE_UPLOAD_FAILED", E412_AZURE_UPLOAD_FAILED);
        langMap.put("E412_AZURE_UPLOAD_FAILED_KO", "AZURE_ERROR [ %s ]");
        langMap.put("E412_AZURE_UPLOAD_FAILED_EN", "AZURE_ERROR [ %s ]");

        langEnumMap.put("E412_TX_FAILED", E412_TX_FAILED);
        langMap.put("E412_TX_FAILED_KO", "TX_ERROR [ %s ]");
        langMap.put("E412_TX_FAILED_EN", "TX_ERROR [ %s ]");

        langEnumMap.put("E421_EXIST_USER", E421_EXIST_USER);
        langMap.put("E421_EXIST_USER_KO", "이미 존재하는 사용자입니다.");
        langMap.put("E421_EXIST_USER_EN", "Already exist user.");

        langEnumMap.put("E422_EXIST_EMAIL", E422_EXIST_EMAIL);
        langMap.put("E422_EXIST_EMAIL_KO", "이미 존재하는 Email 계정입니다.");
        langMap.put("E422_EXIST_EMAIL_EN", "Already exist email account.");

        langEnumMap.put("E423_EXIST_PROVIDER", E423_EXIST_PROVIDER);
        langMap.put("E423_EXIST_PROVIDER_KO", "이미 존재하는 인증 방법입니다.");
        langMap.put("E423_EXIST_PROVIDER_EN", "Already exist auth provider.");

    }
}
