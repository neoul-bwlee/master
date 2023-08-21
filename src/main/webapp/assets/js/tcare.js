var TCare = function () {
    var __this = this;

    var __cfunc = {};
    var __cparam = {};

    __this.doLogin = function () {
        let loginId = $("#agency-code").val();
        let loginPwd = $("#password").val();
        let useSaveAccount = $(".ns-checkbox.save-account").hasClass("active");

        if (NSCommon.isEmpty(loginId)) {
            NSCommon.alert("매장 코드를 입력하세요.");
            $("#agency-code").focus();
            return;
        }
        if (NSCommon.isEmpty(loginPwd)) {
            NSCommon.alert("비밀번호를 입력하세요.");
            $("#password").focus();
            return;
        }

        let loginData = {};
        loginData.username = loginId;
        loginData.password = loginPwd;
        loginData.provider = "neoulsoft";
        NSCommon.apiPost("/open-api/login", loginData, "json", true, function (jsonResult) {
            if (NSCommon.isEmpty(jsonResult.code) === false) {
                NSCommon.alert(NSCommon.B64.decode(jsonResult.message));
                return;
            }

            NSCommon.createCookie("tcare.access-token", jsonResult.authentication.value, 12 * 60 * 60 * 1000);
            NSCommon.createCookie("tcare.refresh-token", jsonResult.authentication.refreshToken.value, 30 * 24 * 60 * 60 * 1000);
            NSCommon.createCookie("tcare.user-type", jsonResult.authentication.additionalInformation.userType, 12 * 60 * 60 * 1000);
            NSCommon.createCookie("tcare.user-info", JSON.stringify(jsonResult.userInfo), 12 * 60 * 60 * 1000);

            if (useSaveAccount) {
                NSCommon.createCookie("tcare.login-token", jsonResult.loginToken, 30 * 24 * 60 * 60 * 1000);
            } else {
                NSCommon.eraseCookie("tcare.login-token");
            }

            location.href = "/page/main";
        });
    };

    __this.logout = function () {
        location.replace("/page/index");
    };

    return __this;
};

var TCARE = new TCare();
