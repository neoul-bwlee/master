const isMobileDebug = false;

var ua = navigator.userAgent,
    iphone = ~ua.indexOf('iPhone') || ~ua.indexOf('iPod'),
    ipad = ~ua.indexOf('iPad'),
    ios = iphone || ipad,
    fullscreen = window.navigator.standalone,
    android = ~ua.indexOf('Android');

//ios = !ios;

var mconsole = {
    log: function() {
        if (!arguments) return;
        var logLine = "";
        for (let i = 0; i < arguments.length; i++) {
            if (logLine !== "") logLine += ", ";
            logLine += arguments[i];
        }
        if (isMobileDebug === true) {
            if ($("#mobile-debug").length === 0) {
                var mobileDebug = document.createElement("span");
                document.body.appendChild(mobileDebug);
                mobileDebug.id = "mobile-debug";
                mobileDebug.style.position = "fixed";
                mobileDebug.style["z-index"] = 70001;
                mobileDebug.style.top = "50%";
                mobileDebug.style.left = "50%";
                mobileDebug.style.width = "100%";
                mobileDebug.style.height = "100px";
                mobileDebug.style["transform"] = "translateX(-50%) translateY(-50%)";
                mobileDebug.style.display = "inline-block";
                mobileDebug.style.color = "#ff0000";
                mobileDebug.style["font-weight"] = 700;
                mobileDebug.style["text-align"] = "center";
            }
            var logLines = $("#mobile-debug").get(0).innerHTML;
            if (!logLines) logLines = "";
            logLines += "<br/>" + logLine;
            $("#mobile-debug").html(logLines);
        }
        else {
            console.log(logLine);
        }
    }
};