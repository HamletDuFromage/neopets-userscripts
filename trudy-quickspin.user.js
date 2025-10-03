// ==UserScript==
// @name        Skip Trudy's Wheel Button
// @namespace   Violentmonkey Scripts
// @author      HamletDuFromage
// @match       https://www.neopets.com/trudys_surprise.phtml*
// @grant       none
// @version     1.9
// ==/UserScript==

(function () {
    "use strict";

    const container = document.querySelector("#trudyContainer");
    if (!container) return;

    const btn = document.createElement("button");
    btn.textContent = "Claim Prize";
    btn.className = "button-default__2020 button-yellow__2020 btn-single__2020";
    btn.style.filter = "none";

    btn.addEventListener("click", () => {
        btn.disabled = true; // disable immediately on click

        $.ajax({
            type: "POST",
            url: "/trudydaily/ajax/claimprize.php",
            data: { "action": "beginroll" },
            dataType: "json",
            success: data => {
                if (data?.["prizes"] && data["prizes"].length > 0) {
                    // finalize claim
                    $.ajax({
                        type: "POST",
                        url: "/trudydaily/ajax/claimprize.php",
                        data: { "action": "prizeclaimed" },
                        dataType: "json",
                        success: () => {
                            // update button with prizes
                            const prizeStrings = data["prizes"].map(p => {
                                return p.value ? `${p.value} ${p.name}` : p.name;
                            });
                            btn.textContent = "You won " + prizeStrings.join(", ") + "!";
                            btn.className = "button-default__2020 button-green__2020 btn-single__2020";
                        },
                        error: () => {
                            btn.textContent = "Error Claiming Prize";
                            btn.className = "button-default__2020 button-red__2020 btn-single__2020";
                            btn.disabled = false; // allow retry
                        }
                    });
                } else {
                    btn.textContent = "No Prize";
                    btn.className = "button-default__2020 button-red__2020 btn-single__2020";
                }
            },
            error: () => {
                btn.textContent = "Connection Error";
                btn.className = "button-default__2020 button-red__2020 btn-single__2020";
                btn.disabled = false; // allow retry
            }

        });
    });

    container.replaceWith(btn);
})();
