var helpTip = null;

Tooltip.defaults = {
    baseClass: "tooltip",
    typeClass: null,
    effectClass: "fade",
    inClass: "fade-in",
    place: "top",
    spacing: null,
    auto: 1
};

document.addEventListener("mouseover", function (e) {
    var target = e.target;

    if (!target.classList.contains("help-bubble")) {
        return;
    }

    var content = document.createElement("span");
    content.innerHTML = target.dataset.tooltip;

    helpTip = new Tooltip(content);
    helpTip.show(target);
});

document.addEventListener("mouseout", function (e) {
    var target = e.target;

    if (!target.classList.contains("help-bubble")) {
        return;
    }

    if (helpTip) {
        helpTip.hide();
        helpTip = null;
    }
});