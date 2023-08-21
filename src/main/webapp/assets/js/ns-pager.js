var NSPager = function () {
    var __this = this;

    __this.options = null;
    __this.targetContainer = null;
    __this.holders = [];

    var __cparam = {};
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

    __this.init = function (targetContainer, options) {
        __this.targetContainer = targetContainer;
        __this.options = options;

        if (__cfunc.isEmpty(__this.options)) {
            console.log("pager option missing.");
            return;
        }

        if (__cfunc.isEmpty(__this.options.transitionTime))
            __this.options.transitionTime = 400;

        if (__cfunc.isEmpty(__this.options.useSwipe))
            __this.options.useSwipe = true;

        if (__cfunc.isEmpty(__this.options.overflow))
            __this.options.overflow = "hidden";

        let definedStyle = __this.targetContainer.attr("style");

        __this.targetContainer.empty();
        __this.targetContainer.css({
            "position": "relative",
            // "width": __this.options.pagerWidth + "px",
            "height": __this.options.pagerHeight + "px",
            "overflow": __this.options.overflow
        });
        //let containerStyle = __this.targetContainer.attr("style");
        //__this.targetContainer.attr("style", containerStyle + "; " + definedStyle);

        __this.targetContainer.append("<div style=\"position: absolute; left: 0px; top: 0px;\"></div>");
        __cparam.holderContainer = __this.targetContainer.find("div");

        $(__this.targetContainer).off("mousedown");
        $(__this.targetContainer).off("mousemove");
        $(__this.targetContainer).off("mouseup");
        $(__this.targetContainer).off("mouseleave");
        $(__this.targetContainer).off("mouseout");
        $(__this.targetContainer).off("touchstart");
        $(__this.targetContainer).off("touchmove");
        $(__this.targetContainer).off("touchend");
        $(__this.targetContainer).off("touchcancel");

        $(__this.targetContainer).on("mousedown", __cfunc.actionDownHandler);
        $(__this.targetContainer).on("mousemove", __cfunc.actionMoveHandler);
        $(__this.targetContainer).on("mouseup", __cfunc.actionUpHandler);
        $(__this.targetContainer).on("mouseleave", __cfunc.actionUpHandler);
        $(__this.targetContainer).on("mouseout", __cfunc.actionUpHandler);
        $(__this.targetContainer).on("touchstart", __cfunc.actionDownHandler);
        $(__this.targetContainer).on("touchmove", __cfunc.actionMoveHandler);
        $(__this.targetContainer).on("touchend", __cfunc.actionUpHandler);
        $(__this.targetContainer).on("touchcancel", __cfunc.actionUpHandler);

        if (!__cfunc.isMobileAndTabletMode()) {
            if (__this.options.useWheel === true) {
                $(__this.targetContainer).bind('wheel', function (evt) {
                    evt.preventDefault();
                    evt.stopImmediatePropagation();
                    evt.stopPropagation();

                    if (evt.originalEvent.wheelDelta > 0 || evt.originalEvent.detail < 0) {
                        __this.pagePrev();
                    } else {
                        __this.pageNext();
                    }
                });
            }
        }
    };

    __this.getCurrentPage = function () {
        return __cparam.pageNo;
    };

    __this.pagePrev = function () {
        if (__cparam.isPageScrolling || __cparam.pageNo == 0) return;
        if (__cfunc.isEmpty(__cparam.holderContainer)) return;

        __cparam.isPageScrolling = true;
        __cparam.tp = {
            x: __cfunc.parseInt(__cparam.holderContainer.css("left").replace(/[^0-9\-]/g, '')),
            y: __cfunc.parseInt(__cparam.holderContainer.css("top").replace(/[^0-9\-]/g, ''))
        };

        __cfunc.startProgress();
        if (__this.options.direction === "horizontal") {
            $(__cparam.holderContainer).animate({left: ((__cparam.pageNo - 1) * __this.options.pagerWidth * (-1))}, __this.options.transitionTime, "swing", function () {
                __cparam.pageNo--;
                __cparam.isPageScrolling = false;
                __cfunc.stopProgress();
                if (__this.options.completeListener)
                    __this.options.completeListener(__cparam.pageNo);
            });
        } else {
            $(__cparam.holderContainer).animate({top: ((__cparam.pageNo - 1) * __this.options.pagerHeight * (-1))}, __this.options.transitionTime, "swing", function () {

                __cparam.pageNo--;
                __cparam.isPageScrolling = false;
                __cfunc.stopProgress();
                if (__this.options.completeListener)
                    __this.options.completeListener(__cparam.pageNo);
            });
        }
    };

    __this.pageNext = function () {

        if (__cparam.isPageScrolling || __cparam.pageNo == __this.holders.length - 1) return;
        if (__cfunc.isEmpty(__cparam.holderContainer)) return;

        __cparam.isPageScrolling = true;
        __cparam.tp = {
            x: __cfunc.parseInt(__cparam.holderContainer.css("left").replace(/[^0-9\-.]/g, '')),
            y: __cfunc.parseInt(__cparam.holderContainer.css("top").replace(/[^0-9\-.]/g, ''))
        };

        __cfunc.startProgress();
        if (__this.options.direction === "horizontal") {
            $(__cparam.holderContainer).animate({left: ((__cparam.pageNo + 1) * __this.options.pagerWidth * (-1))}, __this.options.transitionTime, "swing", function () {
                __cparam.pageNo++;
                __cparam.isPageScrolling = false;
                __cfunc.stopProgress();
                if (__this.options.completeListener)
                    __this.options.completeListener(__cparam.pageNo);
            });
        } else {
            $(__cparam.holderContainer).animate({top: ((__cparam.pageNo + 1) * __this.options.pagerHeight * (-1))}, __this.options.transitionTime, "swing", function () {

                __cparam.pageNo++;
                __cparam.isPageScrolling = false;
                __cfunc.stopProgress();
                if (__this.options.completeListener)
                    __this.options.completeListener(__cparam.pageNo);
            });
        }
    };

    __this.movePage = function (pageNo, useAni) {
        if (__cfunc.isEmpty(__cparam.holderContainer)) return;

        useAni = __cfunc.isEmpty(useAni) ? true : useAni;

        if (useAni === true) {
            __cparam.isPageScrolling = true;

            __cparam.pt = {x: 0, y: 0};
            __cparam.tp = {
                x: __cfunc.parseInt(__cparam.holderContainer.css("left").replace(/[^0-9\-.]/g, '')),
                y: __cfunc.parseInt(__cparam.holderContainer.css("top").replace(/[^0-9\-.]/g, ''))
            };
            __cparam.ct = {
                x: __cparam.pt.x - __this.targetContainer.position().left,
                y: __cparam.pt.y - __this.targetContainer.position().top
            };

            __cfunc.startProgress();
            if (__this.options.direction === "horizontal") {
                // console.log('애니메이션',(pageNo * __this.options.pagerWidth * (-1)));
                // console.log('애니메이션',pageNo );
                $(__cparam.holderContainer).animate({left: (pageNo * __this.options.pagerWidth * (-1))}, __this.options.transitionTime, "swing", function () {
                    __cparam.pageNo = pageNo;
                    __cparam.isPageScrolling = false;
                    // console.log('애니메이션',__cparam.pageNo);
                    __cfunc.stopProgress();
                    if (__this.options.completeListener)
                        __this.options.completeListener(__cparam.pageNo);
                });
            } else {
                $(__cparam.holderContainer).animate({top: (pageNo * __this.options.pagerHeight * (-1))}, __this.options.transitionTime, "swing", function () {
                    __cparam.pageNo = pageNo;
                    __cparam.isPageScrolling = false;
                    __cfunc.stopProgress();
                    if (__this.options.completeListener)
                        __this.options.completeListener(__cparam.pageNo);
                });
            }
        } else {
            __cparam.pt = {x: 0, y: 0};
            __cparam.tp = {
                x: __cfunc.parseInt(__cparam.holderContainer.css("left").replace(/[^0-9\-.]/g, '')),
                y: __cfunc.parseInt(__cparam.holderContainer.css("top").replace(/[^0-9\-.]/g, ''))
            };
            __cparam.ct = {
                x: __cparam.pt.x - __this.targetContainer.position().left,
                y: __cparam.pt.y - __this.targetContainer.position().top
            };

            if (__this.options.direction === "horizontal") {
                $(__cparam.holderContainer).css({"left": (pageNo * __this.options.pagerWidth * (-1)) + "px"});
                __cparam.pageNo = pageNo;
                __cparam.isPageScrolling = false;
                if (__this.options.completeListener)
                    __this.options.completeListener(__cparam.pageNo);
            } else {
                $(__cparam.holderContainer).css({"top": (pageNo * __this.options.pagerHeight * (-1)) + "px"});
                __cparam.pageNo = pageNo;
                __cparam.isPageScrolling = false;
                if (__this.options.completeListener)
                    __this.options.completeListener(__cparam.pageNo);
            }
        }
    };

    __cfunc.startProgress = function () {
        setTimeout(function () {
            __cparam.isProgress = true;
            __cfunc.onProgress();
        }, 1000 / __this.options.fps);
    };

    __cfunc.stopProgress = function () {
        __cparam.isProgress = false;
    };

    __cfunc.onProgress = function () {
        if (__cfunc.isEmpty(__cparam.holderContainer)) return;

        var percent = 0;
        if (__this.options.direction === "horizontal") {
            var hx = __cfunc.parseInt(__cparam.holderContainer.css("left").replace(/[^0-9\-.]/g, ''));
            percent = Math.abs(__cparam.tp.x - hx) / __this.options.pagerWidth * 100;
        } else {
            var hy = __cfunc.parseInt(__cparam.holderContainer.css("top").replace(/[^0-9\-.]/g, ''));
            percent = Math.abs(__cparam.tp.y - hy) / __this.options.pagerHeight * 100;
        }

        if (__this.options.progressListener)
            __this.options.progressListener(percent);

        if (__cparam.isProgress) {
            setTimeout(function () {
                __cfunc.onProgress();
            }, 1000 / __this.options.fps);
        }
    };

    __cfunc.actionDownHandler = function (evt) {

        if (__this.options != null && !__this.options.useSwipe) return;
        if (__this.holders.length < 2) return;
        if (__cfunc.holdPage <= __cparam.pageNo) return;

        __cparam.pt = {x: 0, y: 0};
        if (evt.type.indexOf("touch") > -1) {
            var touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
            __cparam.pt.x = touch.pageX;
            __cparam.pt.y = touch.pageY;
        } else if (evt.type.indexOf("mouse") > -1) {
            __cparam.pt.x = evt.pageX;
            __cparam.pt.y = evt.pageY;
        }

        __cparam.tp = {
            x: __cfunc.parseInt(__cparam.holderContainer.css("left").replace(/[^0-9\-.]/g, '')),
            y: __cfunc.parseInt(__cparam.holderContainer.css("top").replace(/[^0-9\-.]/g, ''))
        };
        __cparam.ct = {
            x: __cparam.pt.x - __this.targetContainer.position().left,
            y: __cparam.pt.y - __this.targetContainer.position().top
        };

        __cparam.oTime = new Date().getTime();
        __cparam.ot = {x: __cparam.pt.x, y: __cparam.pt.y};

        __cfunc.startProgress();
        __cparam.isActionDown = true;
    };

    __cfunc.actionMoveHandler = function (evt) {
        if (__cparam.isActionDown == false) return;
        if (__this.holders.length < 2) return;

        var pt = {x: 0, y: 0};
        if (evt.type.indexOf("touch") > -1) {
            var touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
            pt.x = touch.pageX;
            pt.y = touch.pageY;
        } else if (evt.type.indexOf("mouse") > -1) {
            pt.x = evt.pageX;
            pt.y = evt.pageY;
        }
        __cparam.dt = {x: pt.x - __cparam.pt.x, y: pt.y - __cparam.pt.y};

        if (__cparam.isDragging) {
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();

            if (__this.options.direction === "horizontal") {
                var minMoveTo = Math.min(0, __cparam.tp.x + __cparam.dt.x);
                var maxMoveTo = Math.max(($(__cparam.holderContainer).width() - __this.options.pagerWidth) * (-1), __cparam.tp.x + __cparam.dt.x);
                if (__cparam.dt.x < 0)
                    __cparam.holderContainer.css({"left": maxMoveTo + "px"});
                else
                    __cparam.holderContainer.css({"left": minMoveTo + "px"});

                var hx = __cfunc.parseInt(__cparam.holderContainer.css("left").replace(/[^0-9\-.]/g, ''));
                __cparam.distanceDelta = Math.abs(__cparam.tp.x - hx);
            } else {
                var minMoveTo = Math.min(0, __cparam.tp.y + __cparam.dt.y);
                var maxMoveTo = Math.max(($(__cparam.holderContainer).height() - __this.options.pagerHeight) * (-1), __cparam.tp.y + __cparam.dt.y);
                if (__cparam.dt.y < 0)
                    __cparam.holderContainer.css({"top": maxMoveTo + "px"});
                else
                    __cparam.holderContainer.css({"top": minMoveTo + "px"});

                var hy = __cfunc.parseInt(__cparam.holderContainer.css("top").replace(/[^0-9\-.]/g, ''));
                __cparam.distanceDelta = Math.abs(__cparam.tp.y - hy);
            }

            __cparam.oTime = new Date().getTime();
            __cparam.ot = pt;
        } else {
            if ((__this.options.direction === "horizontal" && Math.abs(__cparam.dt.x) > 16)
                || (__this.options.direction === "vertical" && Math.abs(__cparam.dt.y) > 16)) {
                // start drag
                __cparam.isDragging = true;
            } else {
                // not triggered drag
            }
        }
    };

    __cfunc.actionUpHandler = function (evt) {
        if (__cparam.isActionDown == false) return;
        if (__this.holders.length < 2) return;

        __cparam.rTime = new Date().getTime();
        __cparam.isActionDown = false;

        if (__cparam.isDragging == false) {
            // check click?

            __cfunc.stopProgress();
        } else {
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();

            // calc drag amount
            var timeDelta = __cparam.rTime - __cparam.oTime;
            var moveDistance = 0;

            var pt = {x: 0, y: 0};
            if (evt.type.indexOf("touch") > -1) {
                var touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
                pt.x = touch.pageX;
                pt.y = touch.pageY;
            } else if (evt.type.indexOf("mouse") > -1) {
                pt.x = evt.pageX;
                pt.y = evt.pageY;
            }
            __cparam.dt = {x: pt.x - __cparam.pt.x, y: pt.y - __cparam.pt.y};

            console.log("distance=" + __cparam.distanceDelta + ", dc=" + (__cparam.distanceDelta > __this.options.pagerHeight * 0.5)
                + ", velocity=" + (__cparam.distanceDelta / timeDelta));

            __cparam.isPageScrolling = true;
            if (__cparam.distanceDelta > __this.options.pagerHeight * 0.5
                || (__cparam.distanceDelta / timeDelta) > 30) {
                if (__this.options.direction === "horizontal") {
                    moveDistance = __this.options.pagerWidth - __cparam.distanceDelta;
                    if (__cparam.dt.x < 0) {
                        $(__cparam.holderContainer).animate({left: ((__cparam.pageNo + 1) * __this.options.pagerWidth * (-1))}, 400, "swing", function () {
                            __cparam.pageNo++;
                            __cparam.isPageScrolling = false;
                            __cfunc.stopProgress();
                            if (__this.options.completeListener)
                                __this.options.completeListener(__cparam.pageNo);
                        });
                    } else {
                        $(__cparam.holderContainer).animate({left: ((__cparam.pageNo - 1) * __this.options.pagerWidth * (-1))}, 400, "swing", function () {
                            __cparam.pageNo--;
                            __cparam.isPageScrolling = false;
                            __cfunc.stopProgress();
                            if (__this.options.completeListener)
                                __this.options.completeListener(__cparam.pageNo);
                        });
                    }
                } else {
                    moveDistance = __this.options.pagerHeight - __cparam.distanceDelta;
                    if (__cparam.dt.y < 0) {
                        $(__cparam.holderContainer).animate({top: ((__cparam.pageNo + 1) * __this.options.pagerHeight * (-1))}, 400, "swing", function () {
                            __cparam.pageNo++;
                            __cparam.isPageScrolling = false;
                            __cfunc.stopProgress();
                            if (__this.options.completeListener)
                                __this.options.completeListener(__cparam.pageNo);
                        });
                    } else {
                        $(__cparam.holderContainer).animate({top: ((__cparam.pageNo - 1) * __this.options.pagerHeight * (-1))}, 400, "swing", function () {
                            __cparam.pageNo--;
                            __cparam.isPageScrolling = false;
                            __cfunc.stopProgress();
                            if (__this.options.completeListener)
                                __this.options.completeListener(__cparam.pageNo);
                        });
                    }
                }
            } else {
                if (__this.options.direction === "horizontal") {
                    $(__cparam.holderContainer).animate({left: (__cparam.pageNo * __this.options.pagerWidth * (-1))}, 400, "swing", function () {
                        __cparam.isPageScrolling = false;
                        __cfunc.stopProgress();
                    });
                } else {
                    $(__cparam.holderContainer).animate({top: (__cparam.pageNo * __this.options.pagerHeight * (-1))}, 400, "swing", function () {
                        __cparam.isPageScrolling = false;
                        __cfunc.stopProgress();
                    });
                }
            }

            __cparam.isDragging = false;
        }
    };

    __this.getPageContent = function (pageNo) {
        return $(__this.holders[pageNo]);
    };

    __this.getPageSize = function () {
        console.log(__this.holders.length)
        return __this.holders.length;
    };

    __this.updatePagerSize = function (w, h) {
        if (__cfunc.isEmpty(__cparam.holderContents)) return;

        __this.options.pagerWidth = w;
        __this.options.pagerHeight = h;

        __this.targetContainer.css({
            "position": "relative",
            "width": __this.options.pagerWidth + "px",
            "height": __this.options.pagerHeight + "px",
            "overflow": "hidden"
        });

        let updateStyle = "position: absolute; opacity: 1; width: " + w + "px !important; height: " + h + "px !important; ";
        if (__this.options.direction === "horizontal")
            updateStyle += "overflow-x: hidden; overflow-y: auto;";
        else
            updateStyle += "overflow-x: auto; overflow-y: hidden;";

        $(__cparam.holderContainer).find(".page-holder").each(function () {
            $(this).attr("style", updateStyle);
        });

        setTimeout(function () {
            __cfunc.arrangePositions();
        }, 100);
    };

    __this.addPage = function (pageContent, isDetach) {
        if (__cfunc.isEmpty(isDetach) || isDetach)
            __cparam.holderContents[__cparam.holderContents.length] = pageContent.detach();
        else
            __cparam.holderContents[__cparam.holderContents.length] = $(pageContent).get(0);
        // var holderHtml = "<div class=\"page-holder neoul-scrollbar\" style=\"position: absolute; opacity: 1; width: " +
        //       "100% !important; height: " +
        //     __this.options.pagerHeight + "px !important; ";
        var holderHtml = "<div class=\"page-holder neoul-scrollbar\" style=\"position: absolute; opacity: 1; width: " +
            __this.options.pagerWidth + "px !important; height: " +
            __this.options.pagerHeight + "px !important; ";

        if (__this.options.direction === "horizontal") {
            holderHtml += "overflow-x: hidden; overflow-y: auto;\">";
        } else {
            holderHtml += "overflow-x: auto; overflow-y: hidden;\">";
        }

        holderHtml += "</div>";

        __cparam.holderContainer.append(holderHtml);
        __this.holders[__this.holders.length] =
            __cparam.holderContainer.find("div.page-holder:last-child");
        __this.holders[__this.holders.length - 1].append(
            __cparam.holderContents[__cparam.holderContents.length - 1]);

        __cfunc.arrangePositions();
    };

    __this.releasePages = function (pagerPartName) {
        __cfunc.stopProgress();

        if (__cparam.holderContents.length === 0) return;

        pagerPartName = __cfunc.isEmpty(pagerPartName) ? "pager-part" : pagerPartName;
        $("#" + pagerPartName).empty();
        for (var i = __cparam.holderContents.length - 1; i >= 0; i--) {
            var pageContent = __cparam.holderContents[i].detach();
            $("#" + pagerPartName).prepend(pageContent.get(0));
        }
        $(__this.targetContainer).empty();
        // $(__this.targetContainer).attr("style", "");

        $(__this.targetContainer).off("mousedown");
        $(__this.targetContainer).off("mousemove");
        $(__this.targetContainer).off("mouseup");
        $(__this.targetContainer).off("mouseleave");
        $(__this.targetContainer).off("mouseout");
        $(__this.targetContainer).off("touchstart");
        $(__this.targetContainer).off("touchmove");
        $(__this.targetContainer).off("touchend");
        $(__this.targetContainer).off("touchcancel");

        __cparam.tp = null;
        __cparam.pt = null;
        __cparam.ct = null;
        __cparam.ot = null;
        __cparam.dt = null;
        __cparam.oTime = 0;
        __cparam.rTime = 0;
        __cparam.distanceDelta = 0;
        __cparam.pageNo = 0;
        __cparam.isDragging = false;
        __cparam.isActionDown = false;
        __cparam.isProgress = false;
        __cparam.isPageScrolling = false;
        __cparam.holderContainer = null;
        __cparam.holderContents = [];
        __cfunc.holdPage = 0;

        __this.holders = [];
    };

    __cfunc.arrangePositions = function () {
        if (__this.options.direction === "horizontal")
            __cparam.holderContainer.css({
                "width": (__this.holders.length * __this.options.pagerWidth) + "px",
                "height": __this.options.pagerHeight + "px"
            });
        else
            __cparam.holderContainer.css({
                "width": __this.options.pagerWidth + "px",
                "height": (__this.holders.length * __this.options.pagerHeight) + "px"
            });

        var offsetPosition = 0;
        for (var i = 0; i < __this.holders.length; i++) {
            var holder = __this.holders[i];
            if (__this.options.direction === "horizontal") {
                $(holder).css({"left": offsetPosition + "px"});
                offsetPosition += __this.options.pagerWidth;
            } else {
                $(holder).css({"top": offsetPosition + "px"});
                offsetPosition += __this.options.pagerHeight;
            }
        }
        __cfunc.holdPage = __this.holders.length;
    };

    __this.holdPage = function (pageNo) {
        __cfunc.holdPage = pageNo;
    };

    __cfunc.isEmpty = function (testVal) {
        if (testVal === null || testVal === "null"
            || testVal === undefined || testVal === "undefined"
            || testVal === "" || testVal.length === 0) {
            return true;
        }
        return false;
    };

    __cfunc.isMobileMode = function () {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    __cfunc.isMobileAndTabletMode = function () {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    __cfunc.parseFloat = function (targetVal, defaultVal) {
        let fVal = parseFloat(targetVal);
        if (isNaN(fVal) === true) return defaultVal;
        return fVal;
    };

    __cfunc.parseInt = function (targetVal, defaultVal) {
        let fVal = Math.round(__cfunc.parseFloat(targetVal));
        if (isNaN(fVal) === true) return defaultVal;
        return fVal;
    };

    return __this;
};

var CS_SLIDER = new NSPager();
