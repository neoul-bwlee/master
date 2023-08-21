var NSControls = function () {
    var __this = this;

    var cparams = {};
    var cfunc = {};

    var __cparam = {};
    var __cfunc = {};

    __cparam.slidePickerContainers = {};
    __cparam.slidePicker = {};
    __cparam.slidePicker.tp = {};
    __cparam.slidePicker.op = {};
    __cparam.slidePicker.evtTarget = null;
    __cparam.isSlidePickerActive = false;

    __cparam.eventMap = {};

    __this.regist = function (controlName, useIcon, callback) {
        let eventObj = {};
        eventObj.controlName = controlName;
        eventObj.useIcon = useIcon;
        eventObj.completeCallback = callback;
        __cparam.eventMap[controlName + ((useIcon) ? "_icon" : "")] = eventObj;
    };

    __this.buildSingleControl = function (controlType, controlTarget, controlLabel, controlPlaceHolder, controlListOption, search, controlGrid, changedCallback) {
        var camelControlType = controlType.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
        });
        var funcName = "build" + camelControlType.substring(2);
        cfunc[funcName](controlTarget, controlLabel, controlPlaceHolder, controlListOption, search, controlGrid, changedCallback);
    };


    __this.initSlidePickerSingle = function (container, changedCallback) {
        var pickerName = $(container).attr("class").replace(/slider\-picker\-single /g, '');
        __cparam.slidePickerContainers[pickerName] = {
            pickerName: pickerName,
            container: container,
            onChanged: changedCallback
        };

        $(container).empty();
        $(container).append("<div class='slider-control-wrap single'>" +
            "<span class='slider-track single'></span>" +
            "<span class='slider-progress single'></span>" +
            "<i class='ns-icon slider-thumb'></i></div>");

        /*
        $(container).find(".slider-thumb").on("touchstart", __cfunc.onSlidePickerSingleTouchStart);
        $(container).find(".slider-thumb").on("touchmove", __cfunc.onSlidePickerSingleTouchMove);
        $(container).find(".slider-thumb").on("touchend", __cfunc.onSlidePickerSingleTouchEnd);
        */

        $(container).find(".slider-thumb").on("mousedown", __cfunc.onSlidePickerSingleTouchStart);
        $(container).find(".slider-thumb").on("mouseup", __cfunc.onSlidePickerSingleTouchEnd);
    };

    __cfunc.onSlidePickerSingleTouchStart = function (e) {
        if (e.type.indexOf("touch") > -1) {
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            __cparam.slidePicker.tp.x = touch.pageX;
            __cparam.slidePicker.tp.y = touch.pageY;

            __cparam.slidePicker.evtTarget = touch.target;
            __cparam.slidePicker.op.x = $(__cparam.slidePicker.evtTarget).position().left;
            __cparam.slidePicker.op.y = $(__cparam.slidePicker.evtTarget).position().top;
        } else if (e.type.indexOf("mouse") > -1) {
            __cparam.slidePicker.tp.x = e.pageX;
            __cparam.slidePicker.tp.y = e.pageY;

            __cparam.slidePicker.evtTarget = e.currentTarget;
            __cparam.slidePicker.op.x = $(__cparam.slidePicker.evtTarget).position().left;
            __cparam.slidePicker.op.y = $(__cparam.slidePicker.evtTarget).position().top;
        }
        __cparam.isSlidePickerDragging = false;
        __cparam.isSlidePickerActive = true;

        $(document).on("mousemove", __cfunc.onSlidePickerSingleTouchMove);
    };

    __cfunc.onSlidePickerSingleTouchMove = function (e) {
        if (__cparam.isSlidePickerActive === false) return;

        var cp = {};
        var op = {};

        if (e.type.indexOf("touch") > -1) {
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            cp.x = touch.pageX;
            cp.y = touch.pageY;

            op.x = $(__cparam.slidePicker.evtTarget).position().left;
            op.y = $(__cparam.slidePicker.evtTarget).position().top;
        } else if (e.type.indexOf("mouse") > -1) {
            cp.x = e.pageX;
            cp.y = e.pageY;

            op.x = $(__cparam.slidePicker.evtTarget).position().left;
            op.y = $(__cparam.slidePicker.evtTarget).position().top;
        }

        var pickerName = "contrast";
        var pickerObj = __cparam.slidePickerContainers[pickerName];

        var leftThumb = $(pickerObj.container).find(".ns-icon.slider-thumb");
        var maxMoveTo = $(pickerObj.container).width() - $(leftThumb).width() / 2;

        if (Math.abs(cp.x - __cparam.slidePicker.tp.x) > 10) {
            __cparam.isSlidePickerDragging = true;

            if (cp.x - __cparam.slidePicker.tp.x > 0) {
                // 오른쪽으로 이동.
                var moveTo = __cparam.slidePicker.op.x + (cp.x - __cparam.slidePicker.tp.x);
                if (moveTo > $(pickerObj.container).find(".slider-control-wrap.single").width() - 16)
                    moveTo = $(pickerObj.container).find(".slider-control-wrap.single").width() - 16;
                $(__cparam.slidePicker.evtTarget).css({"left": moveTo + "px"});
            } else {
                // 왼쪽으로 이동.
                var moveTo = __cparam.slidePicker.op.x + (cp.x - __cparam.slidePicker.tp.x);
                if (moveTo < -8) moveTo = -8;
                $(__cparam.slidePicker.evtTarget).css({"left": moveTo + "px"});
            }
            __cfunc.renderSlidePickerSingleProgress($(__cparam.slidePicker.evtTarget));
        } else {
            $(__cparam.slidePicker.evtTarget).css({"left": __cparam.slidePicker.op.x + "px"});
            __cfunc.renderSlidePickerSingleProgress($(__cparam.slidePicker.evtTarget));
            __cparam.isSlidePickerDragging = false;
        }
    };

    __cfunc.renderSlidePickerSingleProgress = function (target) {
        var progressObj = $(target).parent().find(".slider-progress.single");
        var leftThumb = $(target).parent().find(".ns-icon.slider-thumb");

        var pickerName = "contrast";
        var pickerObj = __cparam.slidePickerContainers[pickerName];

        var containerWidth = $(pickerObj.container).find(".slider-control-wrap.single").width();
        var currentPosition = $(leftThumb).position().left + $(leftThumb).width() / 2;

        $(progressObj).css({"left": "0px", "width": (currentPosition + $(leftThumb).width() / 2) + "px"});

        if (pickerObj.onChanged) pickerObj.onChanged((currentPosition / containerWidth * 100.0));
    };

    __cfunc.onSlidePickerSingleTouchEnd = function (e) {
        $(document).off("mousemove", __cfunc.onSlidePickerSingleTouchMove);
        __cparam.isSlidePickerDragging = false;
        __cparam.isSlidePickerActive = false;
    };

    __this.initSlidePicker = function (container, params, changedCallback) {
        var pickerName = $(container).attr("class").replace(/slider\-picker /g, '');
        __cparam.slidePickerContainers[pickerName] = {
            pickerName: pickerName,
            container: container,
            options: params,
            onChanged: changedCallback
        };

        $(container).empty();
        $(container).append("<div class='slider-control-wrap'>" +
            "<span class='slider-track'></span>" +
            "<span class='slider-progress'></span>" +
            "<i class='wooriga-icon slider-thumb left'></i>" +
            "<i class='wooriga-icon slider-thumb right'></i></div>" +
            "<ul class='slider-labels' style='position: relative;'></ul>");

        $(container).find(".slider-labels").empty();
        var blockWidth = Math.round($(container).find(".slider-labels").width() / (params.data.length + 1));
        var blockPos = Math.round(($(container).find(".slider-labels").width() - 8) / (params.data.length - 1));
        var blockOffset = 4;
        for (var i = 0; i < params.data.length; i++) {
            var labelObj = params.data[i];
            var blockItem = "<li class='slider-label-item' " +
                "style='position: absolute; left: " + Math.round((blockOffset - blockWidth / 2)) + "px; " +
                "width:" + blockWidth + "px;'>" +
                labelObj.label + "</li>";
            labelObj.left = blockOffset; // 스탑 포인트 기억.
            labelObj.posUnit = blockPos;
            $(container).find(".slider-labels").append(blockItem);
            blockOffset += blockPos;
        }

        $(container).find(".slider-thumb").on("touchstart", __cfunc.onSlidePickerTouchStart);
        $(container).find(".slider-thumb").on("touchmove", __cfunc.onSlidePickerTouchMove);
        $(container).find(".slider-thumb").on("touchend", __cfunc.onSlidePickerTouchEnd);
        $(container).find(".slider-thumb").on("mousedown", __cfunc.onSlidePickerTouchStart);
        $(container).find(".slider-thumb").on("mousemove", __cfunc.onSlidePickerTouchMove);
        $(container).find(".slider-thumb").on("mouseup", __cfunc.onSlidePickerTouchEnd);
    };

    __cfunc.onSlidePickerTouchStart = function (e) {
        let evtTarget = null;
        if (e.type.indexOf("touch") > -1) {
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            __cparam.slidePicker.tp.x = touch.pageX;
            __cparam.slidePicker.tp.y = touch.pageY;

            evtTarget = touch.target;
            __cparam.slidePicker.op.x = $(evtTarget).position().left;
            __cparam.slidePicker.op.y = $(evtTarget).position().top;
        } else if (e.type.indexOf("mouse") > -1) {
            __cparam.slidePicker.tp.x = e.pageX;
            __cparam.slidePicker.tp.y = e.pageY;

            evtTarget = e.currentTarget;
            __cparam.slidePicker.op.x = $(evtTarget).position().left;
            __cparam.slidePicker.op.y = $(evtTarget).position().top;
        }
        __cparam.isSlidePickerDragging = false;
    };

    __cfunc.onSlidePickerTouchMove = function (e) {
        var cp = {};
        var op = {};

        let evtTarget = null;
        if (e.type.indexOf("touch") > -1) {
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            cp.x = touch.pageX;
            cp.y = touch.pageY;

            evtTarget = touch.target;
            op.x = $(evtTarget).position().left;
            op.y = $(evtTarget).position().top;
        } else if (e.type.indexOf("mouse") > -1) {
            cp.x = e.pageX;
            cp.y = e.pageY;

            evtTarget = e.currentTarget;
            op.x = $(evtTarget).position().left;
            op.y = $(evtTarget).position().top;
        }

        var pickerName = $(evtTarget).parent().parent().attr("class").replace(/slider\-picker /g, '');
        var pickerObj = __cparam.slidePickerContainers[pickerName];

        var leftThumb = $(evtTarget).parent().find(".wooriga-icon.left");
        var rightThumb = $(evtTarget).parent().find(".wooriga-icon.right");
        var isLeft = $(evtTarget).hasClass("left");
        var maxMoveTo = 0;

        if (isLeft) {
            maxMoveTo = $(rightThumb).position().left - 12;
        } else {
            maxMoveTo = $(leftThumb).position().left + 12;
        }

        if (Math.abs(cp.x - __cparam.slidePicker.tp.x) > 10) {
            __cparam.isSlidePickerDragging = true;

            if (cp.x - __cparam.slidePicker.tp.x > 0) {
                // 오른쪽으로 이동.
                var moveTo = __cparam.slidePicker.op.x + (cp.x - __cparam.slidePicker.tp.x);
                if (moveTo > $(evtTarget).parent().width() - 16) moveTo = $(evtTarget).parent().width() - 16;
                if (isLeft && moveTo > maxMoveTo) moveTo = maxMoveTo;
                $(evtTarget).css({"left": moveTo + "px"});
            } else {
                // 왼쪽으로 이동.
                var moveTo = __cparam.slidePicker.op.x + (cp.x - __cparam.slidePicker.tp.x);
                if (moveTo < -8) moveTo = -8;
                if (!isLeft && moveTo < maxMoveTo) moveTo = maxMoveTo;
                $(evtTarget).css({"left": moveTo + "px"});
            }
            __cfunc.renderSlidePickerProgress($(evtTarget));
        } else {
            $(evtTarget).css({"left": __cparam.slidePicker.op.x + "px"});
            __cfunc.renderSlidePickerProgress($(evtTarget));
            __cparam.isSlidePickerDragging = false;
        }
    };

    __cfunc.renderSlidePickerProgress = function (target) {
        var progressObj = $(target).parent().find(".slider-progress");
        var leftThumb = $(target).parent().find(".wooriga-icon.left");
        var rightThumb = $(target).parent().find(".wooriga-icon.right");
        var progressWidth = $(rightThumb).position().left - $(leftThumb).position().left + 8;
        var progressLeft = $(leftThumb).position().left + 8;
        $(progressObj).css({"left": progressLeft + "px", "width": progressWidth + "px"});
    };

    __cfunc.onSlidePickerTouchEnd = function (e) {
        var cp = {};
        var op = {};

        let evtTarget = null;
        if (e.type.indexOf("touch") > -1) {
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            cp.x = touch.pageX;
            cp.y = touch.pageY;

            evtTarget = touch.target;
            op.x = $(evtTarget).position().left;
            op.y = $(evtTarget).position().top;
        } else if (e.type.indexOf("mouse") > -1) {
            cp.x = e.pageX;
            cp.y = e.pageY;

            evtTarget = e.currentTarget;
            op.x = $(evtTarget).position().left;
            op.y = $(evtTarget).position().top;
        }

        var pickerName = $(evtTarget).parent().parent().attr("class").replace(/slider\-picker /g, '');
        var pickerObj = __cparam.slidePickerContainers[pickerName];

        var leftThumb = $(evtTarget).parent().find(".wooriga-icon.left");
        var rightThumb = $(evtTarget).parent().find(".wooriga-icon.right");
        var isLeft = $(evtTarget).hasClass("left");
        var maxPos = 0;
        if (isLeft) {
            var rightThumbIndex = __cfunc.getSlidePickerIndex(pickerObj, $(rightThumb));
            maxPos = pickerObj.options.data[rightThumbIndex - 1].left - 12;
        } else {
            var leftThumbIndex = __cfunc.getSlidePickerIndex(pickerObj, $(leftThumb));
            maxPos = pickerObj.options.data[leftThumbIndex + 1].left - 12;
            console.log(maxPos);
        }

        // snap to pointer
        if (__cparam.isSlidePickerDragging == true) {
            var thumbLeft = $(evtTarget).position().left;
            var closestPos = (pickerObj.options.data[0].left - 12);
            for (var i = 1; i < pickerObj.options.data.length; i++) {
                var nextPos = pickerObj.options.data[i].left;
                if (Math.abs(thumbLeft - nextPos) > pickerObj.options.data[i].posUnit / 2) continue;
                closestPos = (nextPos - 12);
                break;
            }
            if (isLeft) {
                if (closestPos > maxPos) closestPos = maxPos;
            } else {
                if (closestPos < maxPos) closestPos = maxPos;
            }

            var aniOptions = {
                duration: 300,
                easing: "easeInOutCubic",
                start: function () {
                },
                progress: function (animation, progress, remainingMs) {
                    $(evtTarget).css({"left": Math.round((thumbLeft + (closestPos - thumbLeft) * progress)) + "px"});
                    __cfunc.renderSlidePickerProgress($(evtTarget));
                },
                complete: function () {
                    $(evtTarget).css({"left": closestPos + "px"});
                    __cfunc.renderSlidePickerProgress($(evtTarget));
                    var fromIndex = __cfunc.getSlidePickerIndex(pickerObj, $(leftThumb));
                    var toIndex = __cfunc.getSlidePickerIndex(pickerObj, $(rightThumb));
                    if (pickerObj.onChanged)
                        pickerObj.onChanged(fromIndex, toIndex);
                }
            };
            $({percent: 0}).animate({percent: 1}, aniOptions);
        }
    };

    __this.getSelectedSlidePicker = function (pickerName) {
        var pickerObj = __cparam.slidePickerContainers[pickerName];
        if (NSCommon.isEmpty(pickerObj)) return null;
        var leftThumb = $(pickerObj.container).find(".wooriga-icon.left");
        var rightThumb = $(pickerObj.container).find(".wooriga-icon.right");
        var leftIndex = __cfunc.getSlidePickerIndex(pickerObj, $(leftThumb));
        var rightIndex = __cfunc.getSlidePickerIndex(pickerObj, $(rightThumb));
        var selected = [];
        selected[0] = pickerObj.options.data[leftIndex].value;
        selected[1] = pickerObj.options.data[rightIndex].value;
        return selected;
    };

    __cfunc.getSlidePickerIndex = function (pickerObj, target) {
        var thumbLeft = $(target).position().left;
        for (var i = 1; i < pickerObj.options.data.length; i++) {
            var nextPos = pickerObj.options.data[i].left;
            if (Math.abs(thumbLeft - nextPos) > pickerObj.options.data[i].posUnit / 2) continue;
            return i;
        }
        return 0;
    };

    __this.buildControls = function () {
        Array.from(document.querySelectorAll(".ns-checkbox")).forEach(span => {
            __this.buildSingleControl("ns-checkbox", span);
        });

        Array.from(document.querySelectorAll(".ns-radio")).forEach(span => {
            __this.buildSingleControl("ns-radio", span);
        });

        Array.from(document.querySelectorAll(".ns-input")).forEach(div => {
            __this.buildSingleControl("ns-input", div);
        });

        Array.from(document.querySelectorAll(".ns-icon-input")).forEach(div => {
            __this.buildSingleControl("ns-icon-input", div);
        });

        Array.from(document.querySelectorAll(".ns-select")).forEach(div => {
            __this.buildSingleControl("ns-select", div);
        });

        Array.from(document.querySelectorAll(".ns-multi-select")).forEach(div => {
            __this.buildSingleControl("ns-multi-select", div);
        });

        Array.from(document.querySelectorAll(".ns-button-input")).forEach(div => {
            __this.buildSingleControl("ns-button-input", div);
        });

        // Array.from(document.querySelectorAll(".ns-toggle")).forEach(div => {
        //     __this.buildSingleControl("ns-toggle", div);
        // });
    };

    // __this.buildSingleControl = function(controlType, controlTarget) {
    //     if (controlType === "ns-checkbox") {
    //         cfunc.buildCheckbox(controlTarget);
    //     }
    //     else if (controlType === "ns-radio") {
    //         cfunc.buildRadio(controlTarget);
    //     }
    //     else if (controlType === "ns-icon-input") {
    //         cfunc.buildIconInput(controlTarget);
    //     }
    //     else if (controlType === "ns-input") {
    //         cfunc.buildInput(controlTarget);
    //     }
    //     else if (controlType === "ns-select") {
    //         cfunc.buildSelect(controlTarget);
    //     }
    //     else if (controlType === "ns-multi-select") {
    //         cfunc.buildMultiSelect(controlTarget);
    //     }
    // };

    cfunc.buildCheckbox = function (controlTarget) {
        $(controlTarget).empty();

        let textColor = NSCommon.isEmpty($(controlTarget).attr("text-color")) ? "#000000" : $(controlTarget).attr("text-color");
        let fieldName = $(controlTarget).attr("class").replace(/ns-checkbox /g, '');

        $(controlTarget).append("<i class='check-icon'><i class='check'></i></i><em style='color: " + textColor + "'>" + $(controlTarget).attr("label") + "</em>");
        let checked = NSCommon.isEmpty($(controlTarget).attr("checked")) ? false : $(controlTarget).attr("checked") === "checked";

        controlTarget.addEventListener("click", function (e) {
            // console.log($(controlTarget).parent().parent().parent().children().find(".ns-checkbox").toggleClass("active"));
            if ($(controlTarget).hasClass("all-check")) {
                $(controlTarget).toggleClass("active");
                $(controlTarget).parent().parent().parent().children().find(".ns-checkbox").toggleClass("active");
            }
            $(controlTarget).toggleClass("active");
        });
        
        if (checked) {
            let selectedTarget = $(controlTarget);
            setTimeout(function () {
          
                $(selectedTarget).trigger("click");
            }, 400);
        }

        if (__cparam.eventMap[fieldName]) {
            if (__cparam.eventMap[fieldName].completeCallback)
                __cparam.eventMap[fieldName].completeCallback(__thisObj);
        }

    };

    cfunc.buildToggle = function (controlTarget, controlLabel, controlCallback) {
        let __thisObj = $(controlTarget);
        __thisObj.addClass("ns-toggle");
        __thisObj.empty();
        let genHtml = "<div class='switch-toggle'> <input role='switch' type='checkbox'/><div class='switch-label'> <span class='label-on active label-on-off'></span> <span class='label-off  label-on-off'></span> </div></div></input><span>" + controlLabel + "</span>";
        __thisObj.append(genHtml);

        __thisObj.find('.switch-label').on('click', function () {
            $(this).find('.label-on-off').toggleClass('active');
            if ($(this).prev().prop('checked')) {
                $(this).prev().prop('checked', false);
            } else {
                $(this).prev().prop('checked', true);
            }
            if (controlCallback) controlCallback($(this).prev().prop('checked'));
        });
    };

    cfunc.buildRadio = function (controlTarget) {
        $(controlTarget).empty();
        let radioName = $(controlTarget).attr("class").replace(/ns-radio /g, '');
        let selected = NSCommon.isEmpty($(controlTarget).attr("selected")) ? false : $(controlTarget).attr("selected") === "selected";
        $(controlTarget).append("<i class='radio-icon'><i class='radio'></i></i><em>" + $(controlTarget).attr("label") + "</em>");

        controlTarget.addEventListener("click", function (e) {
            $(".ns-radio." + radioName).removeClass("active");
            $(controlTarget).addClass("active");
            if ($(controlTarget).attr("label") === "VOD 수업") {
                $("#field-class-date").attr("readonly", true).css("background-color", "#EFEFEF");
                $("#field-class-time").attr("readonly", true).css("background-color", "#EFEFEF");
            } else {
                $("#field-class-date").removeAttr("readonly").css("background-color", "white");
                $("#field-class-time").removeAttr("readonly").css("background-color", "white");
            }
        });

        if (selected) {
            let selectedTarget = $(controlTarget);
            setTimeout(function () {
                $(selectedTarget).trigger("click");
            }, 400);
        }
    };

    cfunc.buildInput = function (controlTarget) {
        $(controlTarget).empty();
        let __thisObj = $(controlTarget);
        let fieldName = $(controlTarget).attr("class").replace(/ns-input /g, '').replace(/form-input /g, '');
        let useValidation = $(controlTarget).attr("use-validation") === "true";
        let validation = $(controlTarget).attr("validation");
        let value = NSCommon.isEmpty($(controlTarget).attr("value")) ? "" : $(controlTarget).attr("value");
        let maxlength = NSCommon.isEmpty($(controlTarget).attr("maxlength")) ? "" : $(controlTarget).attr("maxlength");
        let fieldType = NSCommon.isEmpty($(controlTarget).attr("field-type")) ? "text" : $(controlTarget).attr("field-type");
        let guideMax = NSCommon.isEmpty($(controlTarget).attr("guide-max")) ? 0 : NSCommon.parseInt($(controlTarget).attr("guide-max"));
        let mandatory = $(controlTarget).attr("mandatory") === "true";
        let placeHolder = NSCommon.isEmpty($(controlTarget).attr("placeholder")) ? "" : $(controlTarget).attr("placeholder");
        let fieldWidth = NSCommon.isEmpty($(controlTarget).attr("field-width")) ? "160px"
            : ($(controlTarget).attr("field-width").indexOf("%") > -1) ? $(controlTarget).attr("field-width")
                : $(controlTarget).attr("field-width").replace(/px/g, '') + "px";

        let genHtml = "<div class='field-wrapper'><input type='" + fieldType + "' id='field-" + fieldName + "' name='" + fieldName + "'" +
            " placeholder='" + placeHolder + "' maxlength='"+ maxlength +"' style='width: " + fieldWidth + ";'/>";

        if (guideMax > 0)
            genHtml += "<span class='input-guide'><em>0</em>/<em>" + guideMax + "자</em></span></div>";
        else
            genHtml += "</div>";

        if (useValidation) {
            genHtml += "<label for='field-" + fieldName + "'></label>";
        }

        $(controlTarget).append(genHtml);

        setTimeout(function () {
            let inputGuideWidth = __thisObj.find(".input-guide").outerWidth();
            let fieldWrapperWidth = __thisObj.find(".field-wrapper").width();
            if (fieldWidth !== "100%")
                fieldWrapperWidth = NSCommon.parseInt(fieldWidth.replace(/px/g, ''));
            __thisObj.find("input").attr("style", "width: " + (fieldWrapperWidth - inputGuideWidth) + "px;");

            if (guideMax > 0) {
                __thisObj.find("input").get(0).addEventListener("keyup", function (e) {
                    let currentLength = __thisObj.find("input").val().length;
                    __thisObj.find(".input-guide > em:eq(0)").text(currentLength);
                    if (useValidation && currentLength > guideMax) {
                        __thisObj.find("label").html(validation);
                        __thisObj.addClass("warning");
                    } else
                        __thisObj.removeClass("warning");
                });
                __thisObj.find("input").get(0).addEventListener("change", function (e) {
                    let currentLength = __thisObj.find("input").val().length;
                    __thisObj.find(".input-guide > em:eq(0)").text(currentLength);
                    if (useValidation && currentLength > guideMax) {
                        __thisObj.find("label").html(validation);
                        __thisObj.addClass("warning");
                    } else
                        __thisObj.removeClass("warning");
                });
            }

            if (mandatory) {
                __thisObj.find("input").get(0).addEventListener("blur", function (e) {
                    let currentLength = __thisObj.find("input").val().length;
                    if (useValidation && currentLength === 0) {
                        __thisObj.find("label").html("<i class='ns-icon warning'></i>필수 입력 항목입니다.");
                        __thisObj.addClass("warning");
                    } else
                        __thisObj.removeClass("warning");
                });
            }

            __thisObj.find("input").val(value);

            let currentLength = __thisObj.find("input").val().length;
            __thisObj.find(".input-guide > em:eq(0)").text(currentLength);
        }, 50);
    };

    cfunc.buildIconInput = function (controlTarget) {
        $(controlTarget).empty();
        let __thisObj = $(controlTarget);
        let fieldName = $(controlTarget).attr("class").replace(/ns-icon-input /g, '').replace(/form-input /g, '');
        let value = NSCommon.isEmpty($(controlTarget).attr("value")) ? "" : $(controlTarget).attr("value");
        let fieldType = NSCommon.isEmpty($(controlTarget).attr("field-type")) ? "" : $(controlTarget).attr("field-type");
        let icon = NSCommon.isEmpty($(controlTarget).attr("icon")) ? "" : $(controlTarget).attr("icon");
        let defiedStyle = $(controlTarget).attr("style");
        let placeHolder = NSCommon.isEmpty($(controlTarget).attr("placeholder")) ? "" : $(controlTarget).attr("placeholder");
        let fieldWidth = NSCommon.isEmpty($(controlTarget).attr("field-width")) ? "160px"
            : ($(controlTarget).attr("field-width").indexOf("%") > -1) ? $(controlTarget).attr("field-width")
                : $(controlTarget).attr("field-width").replace(/px/g, '') + "px";

        let genHtml = "<div class='field-wrapper'><input type='" + fieldType + "' id='field-" + fieldName + "' name='" + fieldName + "'" +
            " placeholder='" + placeHolder + "' style='width: " + fieldWidth + ";'/>";

        if (!NSCommon.isEmpty(icon)) {
            genHtml += "<i class='" + icon + "'></i>";
        }

        genHtml += "</div>";

        $(controlTarget).append(genHtml);

        setTimeout(function () {
            let fieldWrapperHeight = __thisObj.find("input").outerHeight();
            let fieldWrapperWidth = __thisObj.find(".field-wrapper").width();
            if (fieldWidth !== "100%")
                fieldWrapperWidth = NSCommon.parseInt(fieldWidth.replace(/px/g, ''));
            __thisObj.attr("style", "width: " + fieldWrapperWidth + "px;" + " height: " + fieldWrapperHeight + "px;" + defiedStyle);

            if (!NSCommon.isEmpty(icon)) {
                __thisObj.find("input").attr("style", "padding: 0px 44px 0px 9px;");

                if (__cparam.eventMap[fieldName + "_icon"]) {
                    if (__cparam.eventMap[fieldName + "_icon"].completeCallback)
                        __cparam.eventMap[fieldName + "_icon"].completeCallback(__thisObj, __thisObj.find("i.ns-icon"));
                }
            }

            if (__cparam.eventMap[fieldName]) {
                if (__cparam.eventMap[fieldName].completeCallback)
                    __cparam.eventMap[fieldName].completeCallback(__thisObj, __thisObj.find("input"));
            }

            __thisObj.find("input").val(value);
        }, 50);
    };

    cfunc.buildSelect = function (controlTarget) {
        $(controlTarget).empty();
        let __thisObj = $(controlTarget);
        let fieldName = $(controlTarget).attr("class").replace(/ns-select /g, '');
        let prompt = NSCommon.isEmpty($(controlTarget).attr("prompt")) ? "" : $(controlTarget).attr("prompt");
        let ref = NSCommon.isEmpty($(controlTarget).attr("ref")) ? "" : $(controlTarget).attr("ref");
        let selectedValue = NSCommon.isEmpty($(controlTarget).attr("selected-value")) ? "" : $(controlTarget).attr("selected-value");
        let fieldWidth = NSCommon.isEmpty($(controlTarget).attr("field-width")) ? "160px"
            : ($(controlTarget).attr("field-width").indexOf("%") > -1) ? $(controlTarget).attr("field-width")
                : $(controlTarget).attr("field-width").replace(/px/g, '') + "px";

        let genHtml =
            "<div class='selected'><span class='prompt " + fieldName + "' selected-value=''>" + prompt + "</span>" +
            "<i class='ns-icon dropdown'></i></div>" +
            "<ul class='select-list'>";

        const refObj = eval(ref);


        if (!NSCommon.isEmpty(refObj)) {
            for (let i = 0; i < refObj.labels.length; i++) {
                let key = refObj.labels[i];
                genHtml += "<li class='option-item' value='" + refObj.map[key] + "'>"
                    + key + "</li>";
            }
        }
        genHtml += "</ul>";

        $(controlTarget).append(genHtml);

        __thisObj.find(".selected").off("click");
        __thisObj.find(".selected").on("click", function () {
            __thisObj.toggleClass("active");
            __thisObj.find(".ns-icon.dropdown").toggleClass("rotate180");

            // __thisObj.addClass("active");
            // __thisObj.find(".ns-icon.dropdown").addClass("rotate180");

            let fieldWrapperWidth = __thisObj.width();
            if (fieldWidth !== "100%")
                fieldWrapperWidth = NSCommon.parseInt(fieldWidth.replace(/px/g, ''));
            let optionListHeight = __thisObj.find(".select-list").outerHeight();
            __thisObj.attr("style", "height: " + (optionListHeight + 44 + 4) + "px; width: " + fieldWrapperWidth + "px;");

            __thisObj.find(".select-list .option-item").removeClass("current");
            let currentSelected = __thisObj.find(".prompt").attr("selected-value");
            if (!NSCommon.isEmpty(currentSelected))
                __thisObj.find(".select-list .option-item[value='" + currentSelected + "']").addClass("current");
        });

        setTimeout(function () {
            let fieldWrapperWidth = __thisObj.width();
            if (fieldWidth !== "100%")
                fieldWrapperWidth = NSCommon.parseInt(fieldWidth.replace(/px/g, ''));
            __thisObj.attr("style", "width: " + fieldWrapperWidth + "px;");

            $(__thisObj).find(".option-item").off("click");
            $(__thisObj).find(".option-item").on("click", function () {
                __thisObj.find(".prompt").text($(this).text());
                __thisObj.find(".prompt").attr("selected-value", $(this).attr("value"));
                __thisObj.find(".ns-icon.dropdown").removeClass("rotate180");
                __thisObj.removeClass("active");

                __thisObj.addClass("selected");

                __thisObj.attr("style", "width: " + fieldWrapperWidth + "px; height: 48px;");
            });

            if (selectedValue !== "") {
                __thisObj.find(".select-list .option-item[value='" + selectedValue + "']").trigger("click");
            }
        }, 50);
    };

    cfunc.buildMultiSelect = function (controlTarget) {
        $(controlTarget).empty();
        let __thisObj = $(controlTarget);
        let fieldName = $(controlTarget).attr("class").replace(/ns-multi-select /g, '');
        let prompt = NSCommon.isEmpty($(controlTarget).attr("prompt")) ? "" : $(controlTarget).attr("prompt");
        let ref = NSCommon.isEmpty($(controlTarget).attr("ref")) ? "" : $(controlTarget).attr("ref");
        let selectedValue = NSCommon.isEmpty($(controlTarget).attr("selected-value")) ? "" : $(controlTarget).attr("selected-value");
        let fieldWidth = NSCommon.isEmpty($(controlTarget).attr("field-width")) ? "160px"
            : ($(controlTarget).attr("field-width").indexOf("%") > -1) ? $(controlTarget).attr("field-width")
                : $(controlTarget).attr("field-width").replace(/px/g, '') + "px";

        let fieldMaxHeight = NSCommon.isEmpty($(controlTarget).attr("field-max-height")) ? "300px"
            : ($(controlTarget).attr("field-max-height").indexOf("%") > -1) ? $(controlTarget).attr("field-max-height")
                : $(controlTarget).attr("field-max-height").replace(/px/g, '') + "px";

        let genHtml =
            "<div class='selected'><span class='prompt " + fieldName + "' selected-value=''>" + prompt + "</span>" +
            "<i class='ns-icon dropdown'></i></div>" +
            "<div class='select-list-wrapper neoul-scrollbar'><ul class='select-list'>";

        const refObj = eval(ref);
        if (!NSCommon.isEmpty(refObj)) {
            for (let i = 0; i < refObj.labels.length; i++) {
                let key = refObj.labels[i];
                genHtml += "<li class='option-item' value='" + refObj.map[key] + "'>" +
                    "<span class=\"ns-checkbox " + fieldName + "\" label=\"" + key + "\"></span></li>";
            }
        }
        genHtml += "</ul></div>" +
            "<div class='button-set'>" +
            "<button type='button' class='btn-ripple btn-square'>취소</button>" +
            "<button type='button' class='btn-ripple btn-square active'>등록</button>" +
            "</div>";

        $(controlTarget).append(genHtml);

        __thisObj.find(".ns-checkbox").each(function () {
            NSCTRL.buildSingleControl("ns-checkbox", $(this).get(0));
        });

        __thisObj.find(".selected").off("click");
        __thisObj.find(".selected").on("click", function () {
            __thisObj.addClass("active");
            __thisObj.find(".ns-icon.dropdown").addClass("rotate180");

            let fieldWrapperWidth = __thisObj.width();
            if (fieldWidth !== "100%")
                fieldWrapperWidth = NSCommon.parseInt(fieldWidth.replace(/px/g, ''));

            let fieldMaxHeight = NSCommon.isEmpty(__thisObj.attr("field-max-height")) ? "300px"
                : (__thisObj.attr("field-max-height").indexOf("%") > -1) ? __thisObj.attr("field-max-height")
                    : __thisObj.attr("field-max-height").replace(/px/g, '') + "px";
            fieldMaxHeight = NSCommon.parseInt(fieldMaxHeight.replace(/px/g, ''));

            let optionListHeight = __thisObj.find(".select-list").outerHeight();
            __thisObj.attr("style", "height: " + Math.min(optionListHeight + 40 + 40 + 4, fieldMaxHeight) + "px; width: " + fieldWrapperWidth + "px;");

            __thisObj.find(".select-list .option-item").removeClass("current");
            let currentSelected = __thisObj.find(".prompt").attr("selected-value");
            if (!NSCommon.isEmpty(currentSelected)) {
                let selectedSplit = currentSelected.split(",");
                for (let i = 0; i < selectedSplit.length; i++) {
                    __thisObj.find(".select-list .option-item[value='" + selectedSplit[i] + "']").addClass("current");
                    __thisObj.find(".select-list .option-item[value='" + selectedSplit[i] + "'] .ns-checkbox").addClass("active");
                }
            }
        });

        setTimeout(function () {
            let fieldWrapperWidth = __thisObj.width();
            if (fieldWidth !== "100%")
                fieldWrapperWidth = NSCommon.parseInt(fieldWidth.replace(/px/g, ''));
            __thisObj.attr("style", "width: " + fieldWrapperWidth + "px;");

            $(__thisObj).find(".option-item").off("click");
            $(__thisObj).find(".option-item").on("click", function () {
                $(this).toggleClass("current");
                if ($(this).hasClass("current"))
                    $(this).find(".ns-checkbox").addClass("active");
                else
                    $(this).find(".ns-checkbox").removeClass("active");
            });

            if (selectedValue !== "") {
                let selectedSplit = selectedValue.split(",");
                let selectedLabel = "";
                for (let i = 0; i < selectedSplit.length; i++) {
                    __thisObj.find(".select-list .option-item[value='" + selectedSplit[i] + "']").trigger("click");

                    if (selectedLabel !== "")
                        selectedLabel += ",";
                    selectedLabel += __thisObj.find(".select-list .option-item[value='" + selectedSplit[i] + "'] .ns-checkbox em").text();
                }

                __thisObj.addClass("selected");
                __thisObj.find(".prompt").text(selectedLabel);
                __thisObj.find(".prompt").attr("selected-value", selectedValue);
            } else {
                __thisObj.find(".prompt").text(prompt);
                __thisObj.find(".prompt").attr("selected-value", "");
            }

            // 취소.
            $(__thisObj).find(".button-set > button:eq(0)").off("click");
            $(__thisObj).find(".button-set > button:eq(0)").on("click", function () {
                selectedValue = __thisObj.find(".prompt").attr("selected-value");
                if (NSCommon.isEmpty(selectedValue)) selectedValue = "";

                if (selectedValue !== "") {
                    __thisObj.find(".select-list .option-item").removeClass("current");
                    __thisObj.find(".select-list .option-item .ns-checkbox").removeClass("active");

                    let selectedSplit = selectedValue.split(",");
                    let selectedLabel = "";
                    for (let i = 0; i < selectedSplit.length; i++) {
                        __thisObj.find(".select-list .option-item[value='" + selectedSplit[i] + "']").trigger("click");
                        if (selectedLabel !== "")
                            selectedLabel += ",";
                        selectedLabel += __thisObj.find(".select-list .option-item[value='" + selectedSplit[i] + "'] .ns-checkbox em").text();
                    }

                    __thisObj.find(".prompt").text(selectedLabel);
                    __thisObj.find(".prompt").attr("selected-value", selectedValue);
                } else {
                    __thisObj.find(".prompt").text(prompt);
                    __thisObj.find(".prompt").attr("selected-value", "");
                }

                __thisObj.find(".ns-icon.dropdown").removeClass("rotate180");
                __thisObj.removeClass("active");
                __thisObj.addClass("selected");
                __thisObj.attr("style", "width: " + fieldWrapperWidth + "px; height: 40px;");
            });

            // 등록
            $(__thisObj).find(".button-set > button:eq(1)").off("click");
            $(__thisObj).find(".button-set > button:eq(1)").on("click", function () {
                let selectObjs = __thisObj.find(".select-list .option-item.current");
                let selectedValue = "";
                let selectedLabel = "";
                for (let i = 0; i < selectObjs.length; i++) {
                    if (selectedValue !== "") selectedValue += ",";
                    selectedValue += $(selectObjs[i]).attr("value");

                    if (selectedLabel !== "") selectedLabel += ",";
                    selectedLabel += $(selectObjs[i]).find(".ns-checkbox em").text();
                }

                if (selectedValue !== "") {
                    __thisObj.find(".prompt").text(selectedLabel);
                    __thisObj.find(".prompt").attr("selected-value", selectedValue);
                } else {
                    __thisObj.find(".prompt").text(prompt);
                    __thisObj.find(".prompt").attr("selected-value", "");
                }

                __thisObj.find(".ns-icon.dropdown").removeClass("rotate180");
                __thisObj.removeClass("active");
                __thisObj.addClass("selected");
                __thisObj.attr("style", "width: " + fieldWrapperWidth + "px; height: 40px;");
            });

        }, 50);
    };

    cfunc.isEmpty = function (testVal) {
        if (testVal == null || testVal === "null"
            || testVal == undefined || testVal === "undefined"
            || testVal === "" || testVal.length == 0) {
            return true;
        }
        return false;
    };

    cfunc.buildListSwitch = function (controlTarget, controlLabel) {
        let ref = cfunc.isEmpty($(controlTarget).attr("ref")) ? "" : $(controlTarget).attr("ref");
        const refObj = eval(ref);

        let __thisObj = $(controlTarget);
        __thisObj.addClass("ns-list-switch");
        __thisObj.empty();

        let selected = cfunc.isEmpty(__thisObj.attr("selected")) ? false : __thisObj.attr("selected") === 'selected';
        // list-switch
        let genHtml = "<div class='list-switch'>";
        // __thisObj.append(genHtml);
        $.each(refObj.value, function (index, item) {
            let selectedCheck = "<div class='label-list' " + ((selected === false) ? "" : "selected='selected'") + "><span>" + item + "</span></div>";
            genHtml += selectedCheck;
        });

        genHtml += "</div>";

        __thisObj.append(genHtml);
        $('.label-list:eq(' + controlLabel + ')').addClass('active');
        $('.label-list:eq(' + controlLabel + ')').attr('selected', 'selected');

        let listWidth = ((__thisObj.find('.list-switch .label-list').css('width')).replace('px', '') * refObj.value.length) + ((refObj.value.length - 1) * (__thisObj.find('.list-switch').css('gap')).replace('px', ''));
        __thisObj.find('.list-switch').css('width', listWidth);

        __thisObj.find('.label-list').on('click', function () {
            $(this).parent().find('.label-list').removeClass('active');
            $(this).addClass('active');

            __thisObj.find('.label-list').each(function (index, item) {
                console.log(item);
                if ($(item).hasClass('active')) {
                    $(item).attr('selected', 'selected');
                } else {
                    $(item).attr('selected', false);
                }

            });
        });

    };

    return __this;
};

var NSCTRL = new NSControls();
