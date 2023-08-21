
/* ======================================= side panel show/hide =================*/
var elemSidePanel = null;
var activeSidePanelContainer = null;
function showSidePanel(sidePanelName, panelSide,openCallback, callback) {
    if (elemSidePanel != null) {
        $(elemSidePanel).detach();
        $("#side-panel-part").append(elemSidePanel);
        elemSidePanel = null;
    }

    elemSidePanel = $("#" + sidePanelName).detach();
    var panelContainer = $("#side-panel-container .side-panel-content." + panelSide);
    $(panelContainer).empty();
    $(panelContainer).append(elemSidePanel);
    activeSidePanelContainer = panelContainer;

    var outerFactor = ((panelSide === "bottom")
        ? $(panelContainer).find(" > div:eq(0)").outerHeight()
        : $(panelContainer).find(" > div:eq(0)").outerWidth()) + "px";
    $(panelContainer).get(0).style.setProperty("--panel-outer-factor", outerFactor);

    setTimeout(function () {
        $(panelContainer).addClass("active");
    }, 410);

    $("#side-panel-container").removeClass("hide");
    setTimeout(function() {
        $("#side-panel-container .side-panel-dim").addClass("active");
    }, 30);

    $("#side-panel-container .side-panel-dim").off("click");
    $("#side-panel-container .side-panel-dim").on("click", function() {
        hideSidePanel(panelSide);
    });

    $("#side-panel-container .side-panel-header .side-panel-cancel-btn").off("click");
    $("#side-panel-container .side-panel-header .side-panel-cancel-btn").on("click", function() {
        hideSidePanel(panelSide);
    });
    //
    // TARIA.preventBackPress(true, function() {
    //     $("#side-panel-container .side-panel-dim").trigger("click");
    // });

    if (callback) callback();
    if (openCallback) openCallback($(panelContainer).find('>div'));
}

function showSidePanelRefresh(sidePanelName, panelSide, callback, refreshCallback) {
    if (elemSidePanel != null) {
        $(elemSidePanel).detach();
        $("#side-panel-part").append(elemSidePanel);
        elemSidePanel = null;
    }

    elemSidePanel = $("#" + sidePanelName).detach();
    var panelContainer = $("#side-panel-container .side-panel-content." + panelSide);
    $(panelContainer).empty();
    $(panelContainer).append(elemSidePanel);
    activeSidePanelContainer = panelContainer;

    var outerFactor = ((panelSide === "bottom")
        ? $(panelContainer).find(" > div:eq(0)").outerHeight()
        : $(panelContainer).find(" > div:eq(0)").outerWidth()) + "px";
    $(panelContainer).get(0).style.setProperty("--panel-outer-factor", outerFactor);

    setTimeout(function () {
        $(panelContainer).addClass("active");
    }, 410);

    $("#side-panel-container").removeClass("hide");
    setTimeout(function() {
        $("#side-panel-container .side-panel-dim").addClass("active");
    }, 30);

    $("#side-panel-container .side-panel-dim").off("click");
    $("#side-panel-container .side-panel-dim").on("click", function() {
        hideSidePanel(panelSide, refreshCallback);
    });

    $("#side-panel-container .side-panel-header .side-panel-cancel-btn").off("click");
    $("#side-panel-container .side-panel-header .side-panel-cancel-btn").on("click", function() {
        hideSidePanel(panelSide, refreshCallback);
    });
    //
    // TARIA.preventBackPress(true, function() {
    //     $("#side-panel-container .side-panel-dim").trigger("click");
    // });

    if (callback) callback();
}

function hideSidePanel(panelSide, callback) {
    var panelContainer = $("#side-panel-container .side-panel-content." + panelSide);
    var outerFactor = ((panelSide === "bottom")
        ? $(panelContainer).find(" > div:eq(0)").outerHeight()
        : $(panelContainer).find(" > div:eq(0)").outerWidth()) + "px";
    $(panelContainer).get(0).style.setProperty("--panel-outer-factor", outerFactor);
    $(panelContainer).removeClass("active");

    setTimeout(function() {
        $("#side-panel-container .side-panel-dim").removeClass("active");
        setTimeout(function() {
            if (elemSidePanel != null) {
                $(elemSidePanel).detach();
                $("#side-panel-part").append(elemSidePanel);
                elemSidePanel = null;
            }
            $("#side-panel-container").addClass("hide");
            if (callback) callback();
            activeSidePanelContainer = null;
        }, 410);
    }, 410);
}
/* ======================================= side panel show/hide =================*/
