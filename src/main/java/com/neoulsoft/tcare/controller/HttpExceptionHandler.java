package com.neoulsoft.tcare.controller;

import com.neoulsoft.tcare.TCareWebApplication;
import com.neoulsoft.tcare.db.type.String64;
import com.neoulsoft.tcare.ext.HandledServiceException;
import com.neoulsoft.tcare.vo.ResponseVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class HttpExceptionHandler {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @ExceptionHandler(value = HandledServiceException.class)
    public ResponseEntity<?> handledServiceException(HandledServiceException hse) {
        boolean debug = false;
        if (TCareWebApplication.global.getEnvironment() != null
                && TCareWebApplication.global.getEnvironment().getProperty("debug") != null) {
            debug = Boolean.parseBoolean(TCareWebApplication.global.getEnvironment().getProperty("debug"));
        }

        hse.printStackTrace();

        ResponseVO result = new ResponseVO();
        if (debug)
            result.setMessage(hse.getMessage());
        else
            result.setMessage(new String64(hse.getMessage()));

        if (hse.getCode() == 401) {
            result.setCode(401);
            return ResponseEntity.status(401).body(result);
        } else if (hse.getCode() == 403) {
            result.setCode(403);
            return ResponseEntity.status(403).body(result);
        } else if (hse.getCode() == 404) {
            result.setCode(404);
            return ResponseEntity.status(404).body(result);
        } else if (hse.getCode() == 409) {
            result.setCode(409);
            return ResponseEntity.status(409).body(result);
        } else if (hse.getCode() == 411) {
            result.setCode(411);
            return ResponseEntity.status(411).body(result);
        } else if (hse.getCode() == 421) {
            result.setCode(421);
            return ResponseEntity.status(421).body(result);
        } else if (hse.getCode() == 422) {
            result.setCode(422);
            return ResponseEntity.status(422).body(result);
        } else if (hse.getCode() == 423) {
            result.setCode(423);
            return ResponseEntity.status(423).body(result);
        } else if (hse.getCode() == 400) {
            result.setCode(400);
            return ResponseEntity.badRequest().body(result);
        } else {
            result.setCode(500);
            return ResponseEntity.internalServerError().body(result);
        }
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<?> handledException(Exception e) {
        boolean debug = false;
        if (TCareWebApplication.global.getEnvironment() != null
                && TCareWebApplication.global.getEnvironment().getProperty("debug") != null) {
            debug = Boolean.parseBoolean(TCareWebApplication.global.getEnvironment().getProperty("debug"));
        }

        e.printStackTrace();

        ResponseVO result = new ResponseVO();
        result.setCode(500);
        if (debug)
            result.setMessage("예기치 않은 오류가 발생하였습니다.");
        else
            result.setMessage(new String64("예기치 않은 오류가 발생하였습니다."));

        return ResponseEntity.badRequest().body(result);
    }
}
