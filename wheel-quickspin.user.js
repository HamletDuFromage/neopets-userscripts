// ==UserScript==
// @name        Neopets Wheel Quick Spin
// @namespace   Violentmonkey Scripts
// @author      HamletDuFromage
// @match       https://www.neopets.com/medieval/knowledge.phtml
// @match       https://www.neopets.com/faerieland/wheel.phtml
// @match       https://www.neopets.com/prehistoric/mediocrity.phtml
// @match       https://www.neopets.com/halloween/wheel/index.phtml
// @grant       none
// @version     1.1
// @description Replaces the wheel button with a quick-spin version
// ==/UserScript==

(function() {
    'use strict';

    const wheelMap = {
        "/medieval/knowledge.phtml": 1,
        "/faerieland/wheel.phtml": 2,
        "/prehistoric/mediocrity.phtml": 3,
        "/halloween/wheel/index.phtml": 4,
    };

    const type = wheelMap[window.location.pathname];

    const origBtn = document.getElementById("wheelButtonSpin");
    if (!origBtn) return;

    const newBtn = document.createElement("button");
    newBtn.id = "wheelButtonQuickSpin";
    newBtn.className = "button-default__2020 button-yellow__2020 btn-single__2020";
    newBtn.textContent = "Quick Spin";
    newBtn.style.filter = "none";

    origBtn.parentNode.replaceChild(newBtn, origBtn);

    newBtn.addEventListener("click", () => {
        $.ajax({
            type: "POST",
            url: "/np-templates/ajax/wheels/getResult.php",
            data: { type: type },
            success: (data) => {
                console.log(`Wheel type ${type} result:`, data);
                newBtn.textContent = data.name;
                newBtn.className = "button-default__2020 button-green__2020 btn-single__2020";
                newBtn.disabled = true;
            },
            error: (xhr, status, err) => {
                console.error("Error sending request:", status, err);
                newBtn.textContent = "✖ Error";
                newBtn.className = "button-default__2020 button-red__2020 btn-single__2020";
            }
        });
    });
})();
