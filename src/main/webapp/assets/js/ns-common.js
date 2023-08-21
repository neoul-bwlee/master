/* for test */
var isTestMode = true; //git에 올릴시 false로 바꿔서 올리기!

var NSCommonScript = function () {
    var __this = {};

    __this.userInfo = null;
    __this.userType = "guest";
    __this.isModalOpen = false;
    __this.SZERO = "b80b7c522b96debaab4f071b34f8a3591db5564a12d47ec3dbde07cac0fe9d83";
    __this.NAUTH_SZERO = "eed0c44f272a05d77c81ecaa22d834c763eae4d76646c5d538272678cc801d7c";
    __this.CRYPTO_EMPTY = "c0013e425d3893b2acb9872a5878ea7dc91092dbb121eeb1452926a703feb0a0";

    __this.options = null;
    __this.targetContainer = null;
    __this.holders = [];


    var __cparam = {};
    __cparam.modalPart = null;
    __cparam.modalPartStack = [];
    __cparam.loadScriptStatus = {};
    __cparam.requestMap = {};
    __cparam.timerMap = {};
    __cparam.lastRequestSeq = -1;
    __cparam.uploadFile = null;

    __cparam.tp = null;
    __cparam.pt = null;
    __cparam.ct = null;
    __cparam.ot = null;
    __cparam.dt = null;
    __cparam.oTime = 0;
    __cparam.rTime = 0;
    __cparam.distanceDelta = 0;
    __cparam.pageNo = 0;
    __cparam.prevPageNo = 0;
    __cparam.isDragging = false;
    __cparam.isActionDown = false;
    __cparam.isProgress = false;
    __cparam.isPageScrolling = false;
    __cparam.holderContainer = null;
    __cparam.holderContents = [];

    var __cfunc = {};

    __this.init = function () {
        __cfunc.initPrototypes();
    };

    __this.createCookie = function (name, value, expiresAt) {
        var expires = "";
        var date = new Date();
        date.setTime(date.getTime() + expiresAt);
        expires = "; expires=" + date.toUTCString();
        document.cookie = name + "=" + value + expires + "; path=/";
    };

    __this.readCookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    __this.eraseCookie = function (name) {
        __this.createCookie(name, "", -999999999999);
    };

    __this.clearAllCookies = function (domain, path) {
        var doc = document,
            domain = domain || doc.domain,
            path = path || '/',
            cookies = doc.cookie.split(';'),
            now = +(new Date);
        for (var i = cookies.length - 1; i >= 0; i--) {
            doc.cookie = cookies[i].split('=')[0] + '=; expires=' + now + '; domain=' + domain + '; path=' + path;
        }
    };

    __this.extractQueryString = function (key) {
        var qs = location.search;
        qs = (qs == null) ? "" : qs.trim();
        qs = (qs.length > 0 && qs.substring(0, 1) === "?") ? qs.substring(1) : qs;
        var qsMap = qs.split("&");
        for (var i = 0; i < qsMap.length; i++) {
            var split = qsMap[i].split('=');
            if (decodeURIComponent(split[0]) === key) {
                return decodeURIComponent(split[1]);
            }
        }
        return null;
    };

    __this.apiGet = function (url, params, sendType, useAuth, callback) {
        if (__cparam.lastRequestSeq === -1) __cparam.lastRequestSeq = new Date().getTime();
        var executionId = __cparam.lastRequestSeq++;
        __cparam.requestMap["req-" + executionId] = {
            executionId: executionId,
            execution: __this.apiGet,
            url: url,
            params: params,
            sendType: sendType,
            useAuth: useAuth,
            callback: callback,
        };

        $.ajax({
            url: url,
            type: "GET",
            data: __this.transformParams(params),
            success: function (jsonResult) {
                if (jsonResult.code === 401) {
                    __this.refreshAccessToken(executionId);
                    return;
                }
                delete __cparam.requestMap["req-" + executionId];
                if (callback) {
                    callback(__this.handleApiResponse(jsonResult));
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("code:" + jqXHR.status + "\nmessage:" + jqXHR.responseText + "\nerror:" + errorThrown);
                if (jqXHR.status === 401) {
                    __this.refreshAccessToken(executionId);
                    return;
                }
                if (jqXHR.status === 409) {
                    // 리프레시 만료로 기존 인증 토큰 제거.
                    __this.eraseCookie("tcare.access-token");
                    __this.eraseCookie("tcare.refresh-token");
                    location.href = '/page/index'; // 재시도 이후 로그인 페이지 유지.
                }
                if (__cparam.requestMap["req-" + executionId].callback) {
                    __cparam.requestMap["req-" + executionId].callback(
                        __this.handleApiResponse(JSON.parse(jqXHR.responseText)));
                } else
                    __this.error(jqXHR.responseText);
                delete __cparam.requestMap["req-" + executionId];

            },
            beforeSend: function (xhr) {
                if (useAuth === true) {
                    var accessToken = __this.readCookie("tcare.access-token", "", 0);
                    if (__this.isEmpty(accessToken) === false)
                        xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
                }
            }
        });
    };

    __cparam.successJsesionId = null;

    __this.apiPost = function (url, params, sendType, useAuth, callback) {
        if (__cparam.lastRequestSeq === -1) __cparam.lastRequestSeq = new Date().getTime();
        var executionId = __cparam.lastRequestSeq++;
        __cparam.requestMap["req-" + executionId] = {
            executionId: executionId,
            execution: __this.apiPost,
            url: url,
            params: params,
            sendType: sendType,
            useAuth: useAuth,
            callback: callback,
        };

        if (sendType === "form") {
            $.ajax({
                url: url,
                type: "POST",
                data: params,
                success: function (jsonResult) {
                    if (jsonResult.code === 401) {
                        __this.refreshAccessToken(executionId);
                        return;
                    }
                    delete __cparam.requestMap["req-" + executionId];
                    if (callback) {
                        callback(__this.handleApiResponse(jsonResult));
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("code:" + jqXHR.status + "\nmessage:" + jqXHR.responseText + "\nerror:" + errorThrown);
                    if (jqXHR.status === 401) {
                        __this.refreshAccessToken(executionId);
                        return;
                    }
                    if (jqXHR.status === 409) {
                        // 리프레시 만료로 기존 인증 토큰 제거.
                        __this.eraseCookie("tcare.access-token");
                        __this.eraseCookie("tcare.refresh-token");
                        location.href = '/page/index'; // 재시도 이후 로그인 페이지 유지.
                    }
                    if (__cparam.requestMap["req-" + executionId].callback) {
                        __cparam.requestMap["req-" + executionId].callback(
                            __this.handleApiResponse(JSON.parse(jqXHR.responseText)));
                    } else
                        __this.error(jqXHR.responseText);
                    delete __cparam.requestMap["req-" + executionId];
                },
                beforeSend: function (xhr) {
                    if (useAuth === true) {
                        var accessToken = __this.readCookie("tcare.access-token", "", 0);
                        if (__this.isEmpty(accessToken) === false)
                            xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
                    }
                }
            });
        } else if (sendType === "json") {
            // console.log("================================== request params ==========================");
            // console.log(params);
            // console.log("================================== request params ==========================");

            $.ajax({
                url: url,
                type: "POST",
                accept: "application/json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(params),
                dataType: "json",
                success: function (jsonResult) {
                    if (jsonResult.code === 401) {
                        __this.refreshAccessToken(executionId);
                        return;
                    }
                    delete __cparam.requestMap["req-" + executionId];
                    if (callback) {
                        // console.log("================================== response params ==========================");
                        // console.log(jsonResult.response);
                        // console.log("================================== respnose params ==========================");
                        callback(__this.handleApiResponse(jsonResult));
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("code:" + jqXHR.status + "\nmessage:" + jqXHR.responseText + "\nerror:" + errorThrown);
                    if (jqXHR.status === 401) {
                        __this.refreshAccessToken(executionId);
                        return;
                    }
                    if (jqXHR.status === 409) {
                        // 리프레시 만료로 기존 인증 토큰 제거.
                        __this.eraseCookie("tcare.access-token");
                        __this.eraseCookie("tcare.refresh-token");
                        location.href = '/page/index'; // 재시도 이후 로그인 페이지 유지.
                    }
                    if (__cparam.requestMap["req-" + executionId].callback) {
                        __cparam.requestMap["req-" + executionId].callback(
                            __this.handleApiResponse(JSON.parse(jqXHR.responseText)));
                    } else
                        __this.error(jqXHR.responseText);
                    delete __cparam.requestMap["req-" + executionId];
                },
                beforeSend: function (xhr) {
                    if (useAuth === true) {
                        var accessToken = __this.readCookie("tcare.access-token", "", 0);
                        if (__this.isEmpty(accessToken) === false)
                            xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
                    }
                }
            });
        } else if (sendType === "file") {
            $.ajax({
                url: url,
                type: "POST",
                cache: false,
                contentType: false,
                processData: false,
                data: params,
                dataType: "json",
                success: function (jsonResult) {
                    if (jsonResult.code === 401) {
                        __this.refreshAccessToken(executionId);
                        return;
                    }
                    delete __cparam.requestMap["req-" + executionId];
                    if (callback) {
                        callback(__this.handleApiResponse(jsonResult));
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("code:" + jqXHR.status + "\nmessage:" + jqXHR.responseText + "\nerror:" + errorThrown);
                    if (jqXHR.status === 401) {
                        __this.refreshAccessToken(executionId);
                        return;
                    }
                    if (jqXHR.status === 409) {
                        // 리프레시 만료로 기존 인증 토큰 제거.
                        __this.eraseCookie("tcare.access-token");
                        __this.eraseCookie("tcare.refresh-token");
                        location.href = '/page/index'; // 재시도 이후 로그인 페이지 유지.
                    }
                    if (__cparam.requestMap["req-" + executionId].callback) {
                        __cparam.requestMap["req-" + executionId].callback(
                            __this.handleApiResponse(JSON.parse(jqXHR.responseText)));
                    } else
                        __this.error(jqXHR.responseText);
                    delete __cparam.requestMap["req-" + executionId];
                },
                beforeSend: function (xhr) {
                    if (useAuth === true) {
                        var accessToken = __this.readCookie("tcare.access-token", "", 0);
                        if (__this.isEmpty(accessToken) === false)
                            xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
                    }
                }
            });
        }
    };

    __this.isScriptReady = function () {

        let keys = Object.keys(__cparam.loadScriptStatus);

        if (keys === null || keys.length === 0) return true;
        for (let i = 0; i < keys.length; i++) {
            if (__cparam.loadScriptStatus[keys[i]] === false)
                return false;
        }
        return true;
    };

    __this.loadScript = function (url, callback) {
        console.log('loading scripts... ' + url);
        __cparam.loadScriptStatus[url] = false;

        $.ajax({
            url: url + '?v=' + (new Date()).getTime(),
            dataType: 'script',
            success: function () {
                __cparam.loadScriptStatus[url] = true;
                if (callback) callback();
            },
            complete: function () {
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("code:" + jqXHR.status + "\nmessage:" + jqXHR.responseText + "\nerror:" + errorThrown);
            },
            async: true
        });
    };

    __this.loadStyleSheet = function (url) {
        console.log("loading stylesheet... " + url);
        $('head').append('<link rel="stylesheet" type="text/css" href="' + (url + "?v=" + new Date().getTime()) + '" />');
    };

    __this.B64 = {
        encode: function (s) {
            $.base64.utf8encode = true;
            $.base64.utf8decode = true;
            var encoded = $.base64('encode', s);
            return __this.isEmpty(encoded) ? "" : encoded;
        },
        decode: function (s) {
            $.base64.utf8encode = true;
            $.base64.utf8decode = true;
            var decoded = $.base64('decode', s);
            return __this.isEmpty(decoded) ? "" : decoded;
        }
    };

    __this.isEmpty = function (testVal) {
        if (testVal == null || testVal === "null"
            || testVal == undefined || testVal === "undefined"
            || testVal === "" || testVal.length == 0) {
            return true;
        }
        return false;
    };

    __this.isValidateEmail = function (email) {
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    };

    __this.isValidatePassword = function (uid, upw, callback) {
        if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*#?&~])[A-Za-z\d$@$!%*#?&~]{8,20}$/.test(upw)) {
            if (callback)
                callback('비밀번호는 숫자와 영문자, 특수문자 조합으로 8~20자리를 사용해야 합니다.', 'The password must be 8-20 characters long and include both letters, numbers and special characters.');
            else
                __this.alert('비밀번호는 숫자와 영문자, 특수문자 조합으로 8~20자리를 사용해야 합니다.');
            return false;
        }

        var chk_num = upw.search(/[0-9]/g);
        var chk_eng = upw.search(/[a-z]/ig);

        if (chk_num < 0 || chk_eng < 0) {
            if (callback)
                callback('비밀번호는 영문자와 숫자를 혼용해야 합니다.', 'The password should include both letters and numbers.');
            else
                __this.alert('비밀번호는 영문자와 숫자를 혼용해야 합니다.');
            return false;
        }

        if (/(\w)\1\1\1/.test(upw)) {
            if (callback)
                callback('비밀번호에 같은 문자를 4번 이상 사용하실 수 없습니다.', 'You cannot use the same character more than 4 times in your password.');
            else
                __this.alert('비밀번호에 같은 문자를 4번 이상 사용하실 수 없습니다.');
            return false;
        }

        if (!__this.isEmpty(uid) && upw.search(uid) > -1) {
            if (callback)
                callback('ID가 포함된 비밀번호는 사용하실 수 없습니다.', 'You cannot use your ID in your password.');
            else
                __this.alert('ID가 포함된 비밀번호는 사용하실 수 없습니다.');
            return false;
        }

        if (callback) callback('', '');

        return true;
    };

    __this.objectCopy = function (source) {
        var copy = {};
        var keys = Object.keys(source);
        for (var i = 0; i < keys.length; i++) {
            var valueType = "" + typeof (source[keys[i]]);
            if (valueType === "object" && source[keys[i]].length == undefined) {
                copy[keys[i]] = __this.objectCopy(source[keys[i]]);
            } else if (valueType === "object" && source[keys[i]].length >= 0) {
                copy[keys[i]] = [];
                for (var j = 0; j < source[keys[i]].length; j++) {
                    var subValueType = "" + typeof (source[keys[i]][j]);
                    if (subValueType === "object" && source[keys[i]][j].length == undefined)
                        copy[keys[i]][copy[keys[i]].length] = __this.objectCopy(source[keys[i]][j]);
                    else
                        copy[keys[i]][copy[keys[i]].length] = source[keys[i]][j];
                }
            } else if (valueType === "function") {
            } else {
                copy[keys[i]] = source[keys[i]];
            }
        }
        return copy;
    };

    __this.clearAllTimer = function () {
        var keys = Object.keys(__cparam.timerMap);
        if (__this.isEmpty(keys)) return;
        for (var i = 0; i < keys.length; i++) {
            var timerInfo = __cparam.timerMap[keys[i]];
            if (timerInfo.timerId == -1) continue;
            clearTimeout(timerInfo.timerId);
            delete __cparam.timerMap[keys[i]];
        }
        __cparam.timerMap = {};
    };

    __this.isTimerCompleted = function (name) {
        var timerInfo = __cparam.timerMap[name];
        if (__this.isEmpty(timerInfo)) return true;
        if (timerInfo.msec > 0) return false;
        return true;
    };

    __this.startTimerFor = function (name, msec, timeStep, reset, format, callback, stopCallback) {
        if (__this.isEmpty(format)) format = "mm:ss";
        var timerInfo = __cparam.timerMap[name];

        if (__this.isEmpty(timerInfo) === true) {
            timerInfo = {
                name: name, timerId: -1, msec: msec, timeStep: timeStep, reset: reset,
                offset: new Date().getTime(), callback: callback, format: format, stopCallback: stopCallback
            };
            __cparam.timerMap[name] = timerInfo;
        }
        if (timerInfo.timerId !== -1) {
            clearTimeout(timerInfo.timerId);
            timerInfo.timerId = -1;
        }
        if (reset) {
            timerInfo.msec = msec;
            timerInfo.offset = new Date().getTime();
        }
        if (timerInfo.callback)
            timerInfo.callback(__this.timeFormat(timerInfo.msec, timerInfo.format), name); // callback for starting.

        timerInfo.snapTime = new Date().getTime();
        timerInfo.timerId = setTimeout(__this.updateTimer, timeStep, name);
    };

    __this.stopTimer = function (name, skipCallback) {
        if (__this.isEmpty(skipCallback))
            skipCallback = false;

        var timerInfo = __cparam.timerMap[name];
        if (__this.isEmpty(timerInfo) === true) return;
        if (timerInfo.timerId !== -1) {
            clearTimeout(timerInfo.timerId);
            timerInfo.timerId = -1;
        }
        if (skipCallback === false && timerInfo.stopCallback) {
            timerInfo.stopCallback(name, timerInfo.msec);
        }
        delete __cparam.timerMap[name];
    };

    __this.updateTimer = function (name) {
        var timerInfo = __cparam.timerMap[name];
        if (__this.isEmpty(timerInfo) === true) return;

        const snapTime = new Date().getTime();
        const realStep = snapTime - timerInfo.snapTime;

        if (timerInfo.reset === false) {
            timerInfo.msec -= timerInfo.timeStep;
        } else {
            timerInfo.offset = new Date().getTime();
        }

        if (timerInfo.callback) {
            timerInfo.callback(__this.timeFormat(timerInfo.msec, timerInfo.format), name); // callback for starting.
        }

        if (timerInfo.msec > 0) {
            timerInfo.snapTime = snapTime;
            timerInfo.timerId = setTimeout(
                __this.updateTimer,
                timerInfo.timeStep - (realStep - timerInfo.timeStep), name);
            return;
        }

        // stop timer
        __this.stopTimer(name);
    };

    __this.timeFormat = function (inMillis, format) {
        var sec = Math.floor(inMillis / 1000);
        var msec = inMillis - sec * 1000;
        var min = Math.floor(sec / 60);
        sec = sec - min * 60;
        var hour = Math.floor(min / 60);
        min = min - hour * 60;
        var day = Math.floor(hour / 24);
        hour = hour - day * 24;

        var result = "";
        if (format.indexOf("ZZZ") > -1)
            result = ((msec < 10) ? "00" + msec : (msec < 100) ? "0" + msec : "" + msec);
        if (format.indexOf("ss") > -1)
            result = ((sec < 10) ? "0" + sec : "" + sec) + ((result != '') ? "." + result : "");
        if (format.indexOf("mm") > -1)
            result = ((min < 10) ? "0" + min : "" + min) + ((result != '') ? ":" + result : "");
        if (format.indexOf("hh") > -1)
            result = (hour + ((result != '') ? ":" + result : ""));
        if (format.indexOf("d") > -1)
            result = (day + ((result != '') ? ":" + result : ""));

        return result;
    };

    __this.transformParams = function (params) {
        if (params === "undefined" || params === "null")
            return "";
        var paramsStr = "";
        var keys = Object.keys(params);
        for (var i = 0; i < keys.length; i++) {
            if (paramsStr != "") paramsStr += "&";
            paramsStr += (keys[i] + "=" + encodeURIComponent(params[keys[i]]));
        }

        if (paramsStr != "")
            return "&" + paramsStr;
        return paramsStr;
    };

    __this.parseFloat = function (targetVal, defaultVal) {
        var fVal = parseFloat(targetVal);
        if (isNaN(fVal) == true) return defaultVal;
        return fVal;
    };

    __this.parseInt = function (targetVal, defaultVal) {
        var fVal = Math.round(__this.parseFloat(targetVal));
        if (isNaN(fVal) == true) return defaultVal;
        return fVal;
    };

    __this.checkScrollBar = function (element, dir) {
        dir = (dir === 'vertical') ?
            'scrollTop' : 'scrollLeft';

        var res = !!element[dir];
        if (!res) {
            element[dir] = 1;
            res = !!element[dir];
            element[dir] = 0;
        }
        return res;
    };

    __cfunc.initPrototypes = function () {
        console.log("initPrototypes...");

        Date.prototype.format = function (f) {
            if (!this.valueOf()) return " ";

            var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
            var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
            var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            var d = this;

            return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {
                switch ($1) {
                    case "yyyy":
                        return d.getFullYear(); // 년 (4자리)
                    case "yy":
                        return (d.getFullYear() % 1000).zf(2); // 년 (2자리)
                    case "MM":
                        return (d.getMonth() + 1).zf(2); // 월 (2자리)
                    case "dd":
                        return d.getDate().zf(2); // 일 (2자리)
                    case "KS":
                        return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
                    case "KL":
                        return weekKorName[d.getDay()]; // 요일 (긴 한글)
                    case "ES":
                        return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
                    case "EL":
                        return weekEngName[d.getDay()]; // 요일 (긴 영어)
                    case "HH":
                        return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)
                    case "hh":
                        return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)
                    case "mm":
                        return d.getMinutes().zf(2); // 분 (2자리)
                    case "ss":
                        return d.getSeconds().zf(2); // 초 (2자리)
                    case "a/p":
                        return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
                    default:
                        return $1;
                }
            });
        };

        String.prototype.string = function (len) {
            var s = '', i = 0;
            while (i++ < len) {
                s += this;
            }
            return s;
        };
        String.prototype.zf = function (len) {
            return "0".string(len - this.length) + this;
        };
        Number.prototype.zf = function (len) {
            return this.toString().zf(len);
        };
    };

    __this.getTimestamp = function (dateStr) {
        var stdFormat = dateStr.substring(0, 4)
            + "-" + dateStr.substring(4, 6)
            + "-" + dateStr.substring(6, 8)
            + " " + dateStr.substring(8, 10)
            + ":" + dateStr.substring(10, 12)
            + ":" + dateStr.substring(12, 14);
        //stdFormat += ".000Z";
        return Date.parse(stdFormat);
    };

    __this.getMonthLastDay = function (dateStr) {
        dateStr = dateStr.replace(/[^0-9]/g, '');
        var now = new Date();
        now = new Date(now.setFullYear(__this.parseInt(dateStr.substring(0, 4))));
        now = new Date(now.setMonth(__this.parseInt(dateStr.substring(4, 6)) - 1));
        now = new Date(now.setDate(1));
        now = new Date(now.setMonth(now.getMonth() + 1));
        now = new Date(now.setDate(now.getDate() - 1));
        return now.getDate();
    };

    __this.parseBounds = function (bounds) {
        // console.log(bounds);
        bounds = bounds.replace(/ /g, '');
        bounds = bounds.replace(/Rect\(/g, '');
        bounds = bounds.replace(/\)/g, '');
        var rect = {x: 0, y: 0, w: 0, h: 0};
        var splitHipen = bounds.split(/-/);
        var splitPos = splitHipen[0].split(/,/);
        var splitSize = splitHipen[1].split(/,/);
        rect.x = parseInt(splitPos[0]);
        rect.y = parseInt(splitPos[1]);
        rect.w = parseInt(splitSize[0]);
        rect.h = parseInt(splitSize[1]);
        // console.log("(x=" + rect.x + ",y=" + rect.y + ",w=" + rect.w + ",h=" + rect.h);
        return rect;
    };

    __this.accessInitialize = function (callback) {
        console.log("start authentication.");

        // must call at first.
        __this.apiGet("/open-api/env", {}, "json", false, function (jsonResult) {
            console.log(JSON.stringify(jsonResult));
            __this.createCookie("tcare.env", JSON.stringify(jsonResult), 30 * 24 * 60 * 60 * 1000);
            __this.verifyAccessToken(callback);
        });
    };

    __this.verifyAccessToken = function (callback) {
        var verifyData = {};
        verifyData.accessToken = __this.readCookie("tcare.access-token", "", 0);
        verifyData.refreshToken = __this.readCookie("tcare.refresh-token", "", 0);
        verifyData.deviceOsType = "webapp";
        verifyData.accessLanguage = "ko";
        verifyData.forcedLanguage = "ko";

        console.log("verifyData.accessToken=" + verifyData.accessToken);
        var jsonEnv = JSON.parse(__this.readCookie("tcare.env"));
        __this.apiPost(jsonEnv.activeHost + "/open-api/verify", verifyData, "json", false, function (jsonResult) {
            __this.createCookie("tcare.access-token", jsonResult.authentication.value, 12 * 60 * 60 * 1000);
            __this.createCookie("tcare.refresh-token", jsonResult.authentication.refreshToken.value, 30 * 24 * 60 * 60 * 1000);
            __this.createCookie("tcare.user-type", jsonResult.authentication.additionalInformation.userType, 12 * 60 * 60 * 1000);
            __this.createCookie("tcare.user-info", JSON.stringify(jsonResult.userInfo), 12 * 60 * 60 * 1000);

            __this.userInfo = jsonResult.userInfo;
            __this.userType = jsonResult.authentication.additionalInformation.userType;

            if (__this.isEmpty(__this.userType) === true) __this.userType = "guest";

            if (__this.userType === "guest") {
                var loginInfo = __this.readCookie("tcare.login-info", "");
                if (__this.isEmpty(loginInfo) === false) {
                    loginInfo = __this.B64.decode(loginInfo);
                    loginInfo = JSON.parse(loginInfo);
                    if (loginInfo.username && loginInfo.password) {
                        if (callback) callback();
                        return;
                    }
                } else {
                    console.log("auto login data missing...");
                }
            }

            if (callback) callback();
        });
    };

    __this.refreshAccessToken = function (pendingExecutionId) {
        var refreshData = {};
        refreshData.refreshToken = __this.readCookie("tcare.refresh-token", "", 0);
        if (__this.isEmpty(refreshData.refreshToken))
            return;

        var jsonEnv = JSON.parse(__this.readCookie("tcare.env"));
        $.ajax({
            url: jsonEnv.activeHost + "/open-api/refresh",
            type: "POST",
            accept: "application/json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(refreshData),
            dataType: "json",
            success: function (jsonResult) {
                __this.createCookie("tcare.access-token", jsonResult.authentication.value, 12 * 60 * 60 * 1000);
                __this.createCookie("tcare.refresh-token", jsonResult.authentication.refreshToken.value, 30 * 24 * 60 * 60 * 1000);
                __this.createCookie("tcare.user-type", jsonResult.authentication.additionalInformation.userType, 12 * 60 * 60 * 1000);
                __this.createCookie("tcare.user-info", JSON.stringify(jsonResult.userInfo), 12 * 60 * 60 * 1000);

                // 게스트 시 인증 만료로 홈으로 보냄.
                if (__this.isMobileMode()) {
                    if (jsonResult.authentication.additionalInformation.userType === "guest") {
                        __this.eraseCookie("tcare.access-token");
                        __this.eraseCookie("tcare.refresh-token");
                        location.href = "/page/index";
                        return;
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("code:" + jqXHR.status + "\nmessage:" + jqXHR.responseText + "\nerror:" + errorThrown);
                if (__this.isMobileMode()) {
                    if (jqXHR.status === 409) {
                        __this.eraseCookie("tcare.access-token");
                        __this.eraseCookie("tcare.refresh-token");
                        location.href = "/page/index";
                        return;
                    }
                    if (jqXHR.status === 401) {
                        __this.eraseCookie("tcare.access-token");
                        __this.eraseCookie("tcare.refresh-token");
                        location.href = "/page/index";
                        return;
                    }
                }
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "");
            }
        });
    };

    __this.openBlankWebPage = function (link) {
        var timestamp = new Date().getTime();
        window.open(link, "pop" + timestamp, '');
    };

    __this.fileDownload = function (fileUrl) {
        $.fileDownload(fileUrl);
    };

    __this.registFileUpload = function (parentPath, accept, callback) {
        if (__this.isEmpty(accept)) accept = "*/*";
        $("#attach").attr("accept", accept);

        $("#attach").off("change");
        $("#attach").on("change", function (e) {
            if (__this.isEmpty($("#attach").val()) == true)
                return;
            __cparam.uploadFile = e.target.files[0];
            console.log(__cparam.uploadFile);
            __this.attachUpload(parentPath, callback);
        });
    };

    __this.attachUpload = function (parentPath, callback) {
        //var envInfo = JSON.parse(SSA.readAppCookie("tcare.env", "", 0));
        var ajaxData = new FormData($("#uploadForm").get(0));
        ajaxData.append($("#attach").attr("name"), __cparam.uploadFile);
        $.ajax({
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        console.log("percentComplete=" + (percentComplete * 100));
                    }
                }, false);
                return xhr;
            },
            url: "/open-api/upload/" + parentPath,
            type: "POST",
            data: ajaxData,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            complete: function (xhr) {
                console.log("uploadCompleted=" + JSON.stringify(xhr));
            },
            success: function (jsonResult) {
                if (jsonResult.code != 200) {
                    __this.alert(__this.B64.decode(jsonResult.message));
                    return;
                }

                if (callback) callback(jsonResult.response);
                $("#attach").val("");
            },
            error: function () {
                __this.error("Upload failed.");
            }
        });
    };

    __this.alert = __this.error = function (message, closeCallback, hideButtons) {
        __this.showDialog("app-alert", function (dialogContent) {
            $(dialogContent).find(".dialog-message").html(message);
            if (hideButtons)
                $(dialogContent).parent().find(".dialog-action").css({"display": "none"});
            else
                $(dialogContent).parent().find(".dialog-action").css({"display": "flex"});
        }, function () {
            __this.closeDialog(true);
            if (closeCallback) {
                closeCallback();
            }
        }, true);
    };


    __this.auctionAlert = __this.error = function (message, closeCallback, hideButtons) {
        __this.showDialog("auction-alert", function (dialogContent) {
            $(dialogContent).find(".dialog-message").html(message);
            if (hideButtons)
                $(dialogContent).parent().find(".dialog-action").css({"display": "none"});
            else
                $(dialogContent).parent().find(".dialog-action").css({"display": "flex"});
        }, function () {
            __this.closeDialog(true);
            if (closeCallback) {
                closeCallback();
            }
        }, true);
    };

    __this.confirm = function (message, confirmCallback, closeCallback) {
        __cparam.confirmCloseCallback = closeCallback;

        __this.showDialog("app-confirm", function (dialogContent) {
            $(dialogContent).find(".dialog-message").html(message);
        }, function () {
            __cparam.confirmCloseCallback = null;
            __this.closeDialog(true);
            if (confirmCallback) confirmCallback();
        }, true);
    };

    __this.getServiceImageUrl = function (imageType, originUrl, defaultImageUrl) {
        if (__this.isEmpty(originUrl)) {
            if (imageType === "profile")
                return (__this.isEmpty(defaultImageUrl)) ? "/images/no_profile.svg" : defaultImageUrl;
            else
                return (__this.isEmpty(defaultImageUrl)) ? "/images/no_image.svg" : defaultImageUrl;
        } else {
            var jsonEnv = JSON.parse(__this.readCookie("tcare.env", "", 0));
            var si = -1;
            if ((si = originUrl.indexOf("/open-api/res/")) > -1) {
                //console.log("find open-api/res  ::: " + (jsonEnv.uploadHost + originUrl.substring(si)));
                return jsonEnv.uploadHost + originUrl.substring(si);
            } else {
                return originUrl;
            }
        }
    };

    __this.showDialog = function (dialogName, openCallback, confirmCallback, isAppend) {
        if (__this.isEmpty(isAppend) == true) isAppend = false;

        if (isAppend == false) {
            if (__cparam.modalPart != null) {
                var openDialogName = $(__cparam.modalPart).attr("class").replace(/dialog-main/g, '').replace(/\s/g, '');
                $(__cparam.modalPart).detach();
                if (openDialogName === "app-confirm" || openDialogName === "app-alert" || openDialogName === "login") {
                    $("#app-dialog-part").append(__cparam.modalPart);
                } else {
                    $("#dialog-part").append(__cparam.modalPart);
                }
                __cparam.modalPart = null;
            }

            __cparam.modalPartStack.splice(__cparam.modalPartStack.length - 1, 1);
            if (__cparam.modalPartStack.length > 0)
                __cparam.modalPart = __cparam.modalPartStack[__cparam.modalPartStack.length - 1];
            else
                __cparam.modalPart = null;

            var dlgLength = $("#dialog-wrap .neoul-dialog-container").length;
            $("#dialog-wrap .neoul-dialog-container:eq(" + (dlgLength - 1) + ")").removeClass("active");
            $("#dialog-wrap .neoul-dialog-container:eq(" + (dlgLength - 1) + ")").remove();
        }

        __cparam.modalPart = $(".dialog-main." + dialogName).detach();
        __cparam.modalPartStack[__cparam.modalPartStack.length] = __cparam.modalPart;

        $("#dialog-wrap").append("<div class=\"neoul-dialog-container tari\"></div>");

        var dlgLength = $("#dialog-wrap .neoul-dialog-container").length;
        $("#dialog-wrap .neoul-dialog-container:eq(" + (dlgLength - 1) + ")").append(__cparam.modalPart);
        $("#dialog-wrap .neoul-dialog-container:eq(" + (dlgLength - 1) + ")").addClass("active");
        $("#dialog-wrap .neoul-dialog-container:eq(" + (dlgLength - 1) + ")").css({"z-index": dlgLength + 1});
        $("#dialog-wrap .neoul-dialog-container:eq(" + (dlgLength - 1) + ")").css("height", $(window).height()).css("min-height", $(window).height());

        if ($("#dialog-wrap").hasClass("active") == false)
            $("#dialog-wrap").addClass("active");

        __this.isModalOpen = true;

        $(__cparam.modalPart).find(".dialog-close").off("click");
        $(__cparam.modalPart).find(".dialog-close").on("click", function () {
            __this.closeDialog(isAppend);
            if (__cparam.confirmCloseCallback) {
                __cparam.confirmCloseCallback();
                __cparam.confirmCloseCallback = null;
            }
        });


        $(__cparam.modalPart).find(".dialog-action .btn-secondary").off("click");
        $(__cparam.modalPart).find(".dialog-action .btn-secondary").on("click", function () {

            // 수강생 등록 리스트 지우기
            $(".unregi-student-list").remove();
            $(".all-check").removeClass("active");

            __this.closeDialog(isAppend);
            if (__cparam.confirmCloseCallback) {
                __cparam.confirmCloseCallback();
                __cparam.confirmCloseCallback = null;
            }
        });

        $(__cparam.modalPart).find(".dialog-action .btn-primary").off("click");
        $(__cparam.modalPart).find(".dialog-action .btn-primary").on("click", function () {
            if (confirmCallback)
                confirmCallback();
            else
                __this.closeDialog(isAppend); // confirm이 없을 경우 닫기 실행.
        });


        if (openCallback) openCallback($(__cparam.modalPart));
    };

    __this.getCurrentDialogContent = function () {
        if (__this.isEmpty(__cparam.modalPart))
            return null;

        return $(__cparam.modalPart);
    };

    __this.closeDialog = function (isAppend) {
        if (__this.isEmpty(isAppend) == true) isAppend = false;

        if (isAppend == false) {
            // 모든 다이얼로그 닫기.
            do {
                if (__cparam.modalPart != null) {
                    var openDialogName = $(__cparam.modalPart).attr("class").replace(/dialog-main/g, '').replace(/\s/g, '');
                    $(__cparam.modalPart).detach();
                    if (openDialogName === "app-confirm" || openDialogName === "app-alert" || openDialogName === "login") {
                        $("#app-dialog-part").append(__cparam.modalPart);
                    } else {
                        $("#dialog-part").append(__cparam.modalPart);
                    }
                    __cparam.modalPart = null;
                }

                __cparam.modalPartStack.splice(__cparam.modalPartStack.length - 1, 1);
                if (__cparam.modalPartStack.length > 0)
                    __cparam.modalPart = __cparam.modalPartStack[__cparam.modalPartStack.length - 1];
                else
                    __cparam.modalPart = null;

                var dlgLength = $("#dialog-wrap .neoul-dialog-container").length;
                $("#dialog-wrap .neoul-dialog-container:eq(" + (dlgLength - 1) + ")").removeClass("active");
                $("#dialog-wrap .neoul-dialog-container:eq(" + (dlgLength - 1) + ")").remove();

                if (dlgLength - 1 == 0) $("#dialog-wrap").removeClass("active");
            } while (__cparam.modalPartStack.length > 0);

            $("#dialog-wrap").removeClass("active");
            __this.isModalOpen = true;
        } else {
            // 마지막만 닫기.
            if (__cparam.modalPart != null) {
                var openDialogName = $(__cparam.modalPart).attr("class").replace(/dialog-main/g, '').replace(/\s/g, '');
                $(__cparam.modalPart).detach();
                if (openDialogName === "app-confirm" || openDialogName === "app-alert" || openDialogName === "login") {
                    $("#app-dialog-part").append(__cparam.modalPart);
                } else {
                    $("#dialog-part").append(__cparam.modalPart);
                }
                __cparam.modalPart = null;
            }

            __cparam.modalPartStack.splice(__cparam.modalPartStack.length - 1, 1);
            if (__cparam.modalPartStack.length > 0)
                __cparam.modalPart = __cparam.modalPartStack[__cparam.modalPartStack.length - 1];
            else
                __cparam.modalPart = null;

            var dlgLength = $("#dialog-wrap .neoul-dialog-container").length;
            $("#dialog-wrap .neoul-dialog-container:eq(" + (dlgLength - 1) + ")").removeClass("active");
            $("#dialog-wrap .neoul-dialog-container:eq(" + (dlgLength - 1) + ")").remove();

            if (dlgLength - 1 == 0) {
                $("#dialog-wrap").removeClass("active");
                __this.isModalOpen = true;
            }
        }
    };

    __this.initClickOutside = function () {
        $(window).click(function () {
            $(".neoul-select").each(function () {
                var promptButton = $(this).find("button");
                var optionLayer = $(this).find(".neoul-select-options");
                $(promptButton).find(".select-arrow").removeClass("rotate-180");
                optionLayer.hide();
            });

            if (typeof onClickOutside === "function") {
                onClickOutside();
            }
        });
    };

    __this.genCheckbox = function (fieldName, fieldLabel) {
        var fieldVal = fieldName.replace(/check-/g, '');
        var genHtml =
            "<div class=\"neoul-check\"> \
                <span><em></em></span> \
                <input type=\"checkbox\" id=\"" + fieldName + "\" name=\"" + fieldName + "\" value=\"" + fieldVal + "\"/> \
                <label for=\"" + fieldName + "\" id=\"" + fieldName + "-label\" class=\"check-label\">" + fieldLabel + "</label> \
            </div>";
        return genHtml;
    };

    /* 유틸 함수 */
    __this.formatDate = function (yy, mm, dd, hh, mi, ss) {
        if (__this.isEmpty(yy)
            || __this.isEmpty(mm)
            || __this.isEmpty(dd)
            || __this.isEmpty(hh)
            || __this.isEmpty(mi)
            || __this.isEmpty(ss)) return "";
        return yy + "-" + mm.toString().zf(2) + "-" + dd.toString().zf(2) + " " +
            hh.toString().zf(2) + ":" + mi.toString().zf(2) + ":" + ss.toString().zf(2);
    };

    __this.flattenJson = function (obj, parentPath, parentData) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            if (typeof obj[keys[i]] === "object")
                __this.flattenJson(obj[keys[i]], ((parentPath == "") ? keys[i] : (parentPath + "/" + keys[i])), parentData);
            else
                parentData[parentPath + ((parentPath == "") ? "" : "/") + keys[i]] = obj[keys[i]];
        }
        return parentData;
    };

    __this.handleApiResponse = function (jsonResult) {
        var jsonEnvData = __this.readCookie("tcare.env", "", 0);
        var jsonEnv = null;

        if (__this.isEmpty(jsonEnvData) == false)
            jsonEnv = JSON.parse(jsonEnvData);

        jsonResult.message = __this.B64.encode(jsonResult.message);

        return jsonResult;
    };

    __this.isMobileMode = function () {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    __this.isMobileAndTabletMode = function () {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    __this.rand = function (maxNum, withZero) {
        var randVal = Math.floor(Math.random() * (maxNum + 1)) % (maxNum + 1);
        if (!withZero) {
            while (randVal == 0) randVal = Math.floor(Math.random() * (maxNum + 1)) % (maxNum + 1);
            return randVal;
        }
        return randVal;
    };

    // for LongDate object
    __this.timeDiff = function (diffWhat) {
        if (diffWhat.timestamp == 0) return "";

        var currentMillis = new Date().getTime();
        var currentYear = new Date().getFullYear();

        var timeDiff = currentMillis - diffWhat.timestamp;
        if (timeDiff < 60 * 1000) {
            return "just now";
        }

        // N분 전
        if (timeDiff < 60 * 60 * 1000) {
            return Math.floor(timeDiff / (60 * 1000)) + " mins ago";
        }

        // N시간 전
        if (timeDiff < 24 * 60 * 60 * 1000) {
            return Math.floor(timeDiff / (60 * 60 * 1000)) + " hours ago";
        }

        // N일 전
        if (timeDiff < 3 * 24 * 60 * 60 * 1000) {
            return Math.floor(timeDiff / (24 * 60 * 60 * 1000)) + " days ago";
        }

        // 기타 날짜 표시
        var diffDate = diffWhat.dateTime; // 2021-12-24 13:06:21

        if (diffWhat.dateTime.indexOf(".") == -1) {
            diffDate = diffWhat.dateTime.substring(0, 4)
                + "." + diffWhat.dateTime.substring(5, 7)
                + "." + diffWhat.dateTime.substring(8, 11);
            // + "." + diffWhat.dateTime.substring(4, 6)
            // + "." + diffWhat.dateTime.substring(6, 8);
        } else {
            diffDate = diffWhat.dateTime.substring(0, 16); // 일시까지 나오게 하기 위해 10 -> 16으로 변경
        }
        var diffYear = __this.parseInt(diffDate.substring(0, 4));
        if (currentYear == diffYear) {
            diffDate = diffDate.substring(2); //2021-12-14
            // return (diffDate.replace(/-/g, '\.')); //21/12/14 13:29
            // return diffDate.substring(5).replace(/-/g, '\/');
        }
        return diffDate;
    };

    __this.timeDiffDay = function (diffWhat) {
        let diffMillis = diffWhat.timestamp - new Date().getTime();
        let diffDay = ((((diffMillis / 1000) / 60) / 60) / 24);
        return diffDay;
    };

    __this.timeDiff2 = function (diffWhat) {
        var timeDiff = diffWhat.dateTime.substring(11, 16);
        var hour = __this.parseInt(timeDiff.substring(0, 2));
        if (hour < 12)
            timeDiff = "오전 " + timeDiff;
        else
            timeDiff = ("오후 " + ((hour - 12) == 0 ? 12 : (hour - 12)).zf(2) + timeDiff.substring(2, 5));
        return timeDiff;
    };

    __this.fitImageRect = function (targetImage, maxWidth, maxHeight) {
        __cfunc.renderFitImage(targetImage, maxWidth, maxHeight);
    };

    __cfunc.renderFitImage = function (targetImage, maxWidth, maxHeight) {
        var iw = $(targetImage).prop("naturalWidth");
        var ih = $(targetImage).prop("naturalHeight");
        if (iw == 0 || ih == 0) {
            setTimeout(function () {
                __cfunc.renderFitImage(targetImage, maxWidth, maxHeight);
            }, 50);
            return;
        }

        var container = $(targetImage).parent();
        var cw = $(container).width();
        var ch = $(container).height();

        if (!__this.isEmpty(maxWidth)) {
            if (cw > maxWidth) cw = maxWidth;
        }

        if (!__this.isEmpty(maxHeight)) {
            if (ch > maxHeight) ch = maxHeight;
        }

        var tw = 0, th = 0;
        var rw = iw / cw, rh = ih / ch;

        if (rw > rh) {
            // 가로로 긴 이미지 -> 높이를 맞춤.
            th = ih;
            tw = Math.round((th * iw) / ih);

            th = ch;
            tw = iw * (ch / ih);
        } else {
            // 세로로 긴 이미지 -> 넓이를 맞춤.
            tw = iw;
            th = Math.round((tw * ih) / iw);
            tw = cw;
            th = ih * (cw / iw);
        }

        $(targetImage).css({
            "width": tw + "px",
            "height": th + "px" /*, "max-width": tw + "px", "max-height": th + "px" */
        });
        if (maxWidth && maxHeight)
            $(container).css({
                "width": cw + "px",
                "height": ch + "px" /*, "max-width": tw + "px", "max-height": th + "px" */
            });
        $(container).addClass("render");
    };

    __this.removeHarmfulTags = function (source) {
        source = source.replace(/\<script.*\>.*\<\/script\>/ims, '');
        source = source.replace(/\<SCRIPT.*\>.*\<\/SCRIPT\>/ims, '');
        source = source.replace(/\<iframe.*\>.*\<\/iframe\>/ims, '');
        source = source.replace(/\<IFRAME.*\>.*\<\/IFRAME\>/ims, '');
        return source;
    };

    __this.covertToHex = function (i) {
        var bbggrr = ("000000" + i.toString(16)).slice(-6);
        var rrggbb = bbggrr.substr(4, 2) + bbggrr.substr(2, 2) + bbggrr.substr(0, 2);
        return "#" + rrggbb;
    };

    __this.convertToColor = function (rrggbb) {
        if (rrggbb.substring(0, 1) === "#")
            rrggbb = rrggbb.substring(1);
        var bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
        return parseInt(bbggrr, 16);
    };

    __this.parseColorName = function (colorName) {
        var colors = [];
        if (colorName === "blue") {
            colors[0] = "#75a6f0";
            colors[1] = "#99bff5";
        } else if (colorName === "purple") {
            colors[0] = "#9a84f7";
            colors[1] = "#ab98fb";
        } else if (colorName === "orange") {
            colors[0] = "#f29282";
            colors[1] = "#f7b47b";
        } else if (colorName === "yellow") {
            colors[0] = "#efbe79";
            colors[1] = "#eec489";
        }
        return colors;
    };

    __this.parseColorHex = function (fromHex, toHex) {
        if (fromHex.toLowerCase() === "#75a6f0" && toHex.toLowerCase() === "#99bff5")
            return "blue";
        if (fromHex.toLowerCase() === "#9a84f7" && toHex.toLowerCase() === "#ab98fb")
            return "purple";
        if (fromHex.toLowerCase() === "#f29282" && toHex.toLowerCase() === "#f7b47b")
            return "orange";
        if (fromHex.toLowerCase() === "#efbe79" && toHex.toLowerCase() === "#eec489")
            return "yellow";
        return "";
    };

    __this.getServerDateFormat = function (dateObj) {
        var saveDateObj = {};
        saveDateObj.dateFormat = "yyyy.MM.dd HH:mm:ss";
        saveDateObj.dateTime = dateObj.dateTime;
        saveDateObj.timestamp = Date.parse(saveDateObj.dateTime);
        return saveDateObj;
    };

    __this.getLongDate = function (millis) {
        var saveDateObj = {};
        saveDateObj.dateFormat = "yyyy.MM.dd HH:mm:ss";
        saveDateObj.timestamp = millis;

        var date = new Date(millis);
        saveDateObj.dateTime = date.getFullYear() +
            "." + (date.getMonth() + 1).zf(2) +
            "." + date.getDate().zf(2) +
            " " + date.getHours().zf(2) +
            ":" + date.getMinutes().zf(2) +
            ":" + date.getSeconds().zf(2);

        return saveDateObj;
    };

    __this.getByteFormat = function (source) {
        var kb = Math.round(source / 1024);
        if (kb == 0)
            return $.number(source, 0) + "B";

        var mb = Math.round(kb / 1024);
        if (mb == 0) {
            if (kb > 0 && kb < 1)
                return $.number(kb, 2) + "KB";
            return $.number(kb, 0) + "KB";
        }

        var gb = Math.round(mb / 1024);
        if (gb == 0) {
            if (mb > 0 && mb < 1)
                return $.number(mb, 2) + "MB";
            return $.number(mb, 0) + "MB";
        }

        return $.number(gb, 2) + "GB";
    };

    //주소 부분 확인후 화면 조절 - sy
    __this.isMobileAndroid = function () {
        var varUA = navigator.userAgent.toLowerCase();
        if (varUA.indexOf('android') > -1) {
            let vh = window.innerHeight;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        } else if (varUA.indexOf('iphone') > -1) {
            let vh = window.innerHeight;
            // console.log(document.getElementsByClassName())
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            console.log(document.documentElement.style)
        }
    }

    __this.copy = function (copyText, copyToast) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(copyText)
                .then(function () {
                    popup(copyToast);
                })
                .catch((error) => {
                    const textArea = document.createElement('textarea');
                    document.body.appendChild(textArea);
                    textArea.value = copyText;
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    popup(copyToast);
                });
        } else {
            const textArea = document.createElement('textarea');
            document.body.appendChild(textArea);
            textArea.value = copyText;
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            popup(copyToast);
        }
    };

    __this.init();

    __this.showMultiDialog = function (dialogName, openCallback, confirmCallback, isAppend) {
        if (__this.isEmpty(isAppend) == true) isAppend = false;



        __cparam.modalPart = $(".dialog-multi-main." + dialogName).detach();
        __cparam.modalPartStack[__cparam.modalPartStack.length] = __cparam.modalPart;

        $("#dialog-wrap").append("<div class=\"neoul-dialog-container tari\"></div>");

        var dlgLength = $("#dialog-wrap .neoul-dialog-container").length;

        $("#dialog-wrap .neoul-dialog-container:eq(" + (dlgLength - 1) + ")").append(__cparam.modalPart);
        $("#dialog-wrap .neoul-dialog-container:eq(" + (dlgLength - 1) + ")").addClass("active");
        $("#dialog-wrap .neoul-dialog-container:eq(" + (dlgLength - 1) + ")").css({"z-index": dlgLength + 1});
        $("#dialog-wrap .neoul-dialog-container:eq(" + (dlgLength - 1) + ")").css("height", $(window).height()).css("min-height", $(window).height());

        if ($("#dialog-wrap").hasClass("active") == false)
            $("#dialog-wrap").addClass("active");

        __this.isModalOpen = true;

      

      


        if (openCallback) openCallback($(__cparam.modalPart));
    };


    __this.DATE_FORMAT_FULL = "yyyy년 MM월 dd일 a/p hh:mm";

    return __this;
};

var NSCommon = new NSCommonScript();
