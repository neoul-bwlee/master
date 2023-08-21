var NsSubpage = function () {
    var __this = this;

    __this.subPageArea = null;
    __this.subPageZIndexFlat = 201;
    __this.subPageStack = 0;

    __this.aniDuration = 400;
    __this.subPageContentMap = {};
    __this.activePageContainer = null;
    __this.init = function (aniDuration) {
        __this.subPageArea = $("#sub-page-area");
        __this.subPageArea.addClass("hide");

        if (!NSCommon.isEmpty(aniDuration))
            __this.aniDuration = aniDuration;
    };

    __this.showSubPage = function (contentName, headerFragment, callback, hideCallback) {
        if (__this.subPageArea.hasClass("hide")) __this.subPageArea.removeClass("hide");

        var subPageHtml = "" +
            "<div class=\"sub-page-container\" style=\"z-index: " + (__this.subPageZIndexFlat + __this.subPageStack) + "\">\n" +
            "  <div class=\"sub-page-header\">\n" +
            "    <i class=\"ns-icon page-back\"></i>\n" +
            "    <div class=\"header-fragment\">\n";
        if (NSCommon.isEmpty(headerFragment))
            subPageHtml += "<span class=\"sub-page-title\"></span>\n";
        else
            subPageHtml += headerFragment;

        subPageHtml += "    </div>\n" +
            "    <i class=\"ns-icon close-btn\"></i>\n" +
            "  </div>\n" +
            "  <div class=\"sub-page-content neoul-scrollbar\"></div>\n" +
            "</div>";

        __this.subPageArea.find("> div").append(subPageHtml);
        var subPageContainer = __this.subPageArea.find(".sub-page-container:eq(" + __this.subPageStack + ")");
        __this.subPageStack++;
        __this.activePageContainer = subPageContainer;

        // subPage 내용 처리.

        var subPageHeader = subPageContainer.find(".sub-page-header");
        var subPageContent = subPageContainer.find(".sub-page-content");

        var elemSubPage = $("#" + contentName).detach();
        subPageContent.append(elemSubPage);
        __this.subPageContentMap[contentName] = elemSubPage;

        setTimeout(function () {
            subPageContainer.addClass("showing");
        }, 500);

        subPageContent.off("scroll");
        subPageContent.on("scroll", function () {
            if ($(this).scrollTop() > 2) {
                if (!subPageHeader.hasClass("on-scroll")) subPageHeader.addClass("on-scroll");
            } else {
                if (subPageHeader.hasClass("on-scroll")) subPageHeader.removeClass("on-scroll");
            }
        });

        // page-back 버튼
        subPageHeader.find(".page-back").off("click");
        subPageHeader.find(".page-back").on("click", function () {
            __this.hideSubPage(contentName, subPageContainer, hideCallback);
        });


        if (callback) callback(subPageContainer);
    };

    __this.clearContainers = function (callback) {
        if (__this.activePageContainer === null) {
            if (callback) callback();
            return;
        }

        __this.activePageContainer.removeClass("showing");
        __this.activePageContainer.addClass("hiding");
        __this.subPageArea.addClass("hide");
        setTimeout(function () {
            __this.activePageContainer.removeClass("hiding");

            var keys = Object.keys(__this.subPageContentMap);
            for (let i = keys.length - 1; i >= 0; i--) {
                var elemSubPage = __this.subPageContentMap[keys[i]];
                if (elemSubPage != null) {
                    $(elemSubPage).detach();
                    $("#sub-page-part").append(elemSubPage);
                    elemSubPage = null;
                    delete __this.subPageContentMap[keys[i]];
                }
            }

            __this.subPageStack = 0;
            __this.subPageArea.find("> div").empty();
            __this.activePageContainer = null;

            if (callback) callback();
        }, 400);
    };

    __this.hideSubPage = function (contentName, subPageContainer, hideCallback) {
        subPageContainer.removeClass("showing");
        subPageContainer.addClass("hiding");

        console.log(__this.aniDuration);
        setTimeout(function () {
            subPageContainer.removeClass("hiding");
            var elemSubPage = __this.subPageContentMap[contentName];
            if (elemSubPage != null) {
                $(elemSubPage).detach();
                $("#sub-page-part").append(elemSubPage);
                elemSubPage = null;
                delete __this.subPageContentMap[contentName];
            }

            subPageContainer.remove();
            __this.subPageStack--;

            if (__this.subPageStack <= 0) {
                __this.subPageArea.addClass("hide");
                __this.activePageContainer = null;
            } else {
                __this.activePageContainer = __this.subPageArea.find(".sub-page-container:eq(" + (__this.subPageStack - 1) + ")");
            }

            if (hideCallback) hideCallback();

        }, __this.aniDuration + 10);

    };

    __this.openPhotoSlider = function (imageFiles, imageIndex) {
        var pageHeader = null;
        NSSP.showSubPage("photo-browser", null, function (pageContainer) {
            var pageContent = pageContainer.find(".sub-page-content");

            pageHeader = pageContainer.find(".sub-page-header");
            pageHeader.addClass("dark-mode");

            NSControl.initImageSlider(pageContent.find(".image-slider"), imageFiles, imageIndex, function () {
                console.log(NSControl.getSliderIndex(), imageFiles.length);

                if (NSControl.getSliderIndex() == 0)
                    pageContent.find(".studysenior-icon.caret-left").addClass("hide");
                else
                    pageContent.find(".studysenior-icon.caret-left").removeClass("hide");

                if (NSControl.getSliderIndex() == imageFiles.length - 1)
                    pageContent.find(".studysenior-icon.caret-right").addClass("hide");
                else
                    pageContent.find(".studysenior-icon.caret-right").removeClass("hide");
            });

            pageContent.find(".studysenior-icon.caret-left").off("click");
            pageContent.find(".studysenior-icon.caret-left").on("click", function () {
                if (NSControl.getSliderIndex() == 0) return;

                NSControl.moveSliderPrev();
            });

            pageContent.find(".studysenior-icon.caret-right").off("click");
            pageContent.find(".studysenior-icon.caret-right").on("click", function () {
                if (NSControl.getSliderIndex() >= imageFiles.length - 1) {
                    return;
                }

                NSControl.moveSliderNext();
            });

            pageContent.find(".studysenior-icon.download").off("click");
            pageContent.find(".studysenior-icon.download").on("click", function () {
                var imageFile = imageFiles[NSControl.getSliderIndex()];
                var anchorHtml = "<a id='hidden-file-download' href='" + imageFile.fileUrl + "?d=true' download></a>";
                $(document.body).append(anchorHtml);
                $("#hidden-file-download")[0].click();
                setTimeout(function () {
                    $("#hidden-file-download").remove();
                }, 2000);
            });

        }, function () {
            pageHeader.removeClass("dark-mode");
        });
    };

    return __this;
};

var NSSP = new NsSubpage();
