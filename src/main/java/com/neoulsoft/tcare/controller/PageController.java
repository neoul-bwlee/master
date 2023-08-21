package com.neoulsoft.tcare.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.mobile.device.Device;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(value = "/page")
public class PageController extends ApiController implements ErrorController {

    @RequestMapping("/error")
    public ModelAndView pageError(HttpServletRequest request) {
        ModelAndView mav = new ModelAndView("page/error");
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if (status != null) {
            Integer statusCode = Integer.valueOf(status.toString());
            mav.addObject("statusCode", statusCode);
            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                mav.addObject("errorMessage", "요청내용을 찾을 수 없습니다.");
            } else if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                mav.addObject("errorMessage", "예기치 않은 오류가 발생했습니다.");
            }
        }
        return mav;
    }

    @RequestMapping("/index")
    public ModelAndView pageIndex(Device device) {
        ModelAndView mav = new ModelAndView(device.isMobile() ? "page/m-index" : "page/index");
        mav.addObject("pageType", device.isMobile() ? "mobile" : "pc");
        return mav;
    }

    @RequestMapping("/main")
    public ModelAndView pageWalletMain(Device device) {
        ModelAndView mav = new ModelAndView(device.isMobile() ? "page/m-main" : "page/main");
        mav.addObject("pageType", device.isMobile() ? "mobile" : "pc");
        return mav;
    }

}
