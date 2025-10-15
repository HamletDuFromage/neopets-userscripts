// ==UserScript==
// @name         Neopets Auto-buy (no confirm, no redirect)
// @namespace    http://tampermonkey.net/
// @author       HamletDuFromage
// @version      1.0
// @match        https://www.neopets.com/generalstore.phtml*
// @icon         https://www.neopets.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.confirm = () => true;

    document.addEventListener("click", async (e) => {
        let el = e.target.closest("input.np-item-image[type=image]");
        if (!el) return; 

        e.preventDefault();

        el.form.buy_oii.value = el.value;

        let formData = new FormData(el.form);

        let res = await fetch(el.form.action, {
            method: el.form.method || "POST",
            body: formData,
            credentials: "include"
        });

        console.log("✅ Purchase request sent!", res);

        let note = document.createElement("div");
        note.textContent = "✅ Purchase sent for item ID " + el.value;
        note.style.color = "green";
        note.style.fontWeight = "bold";
        el.insertAdjacentElement("afterend", note);

        // If you want to check success:
        // let text = await res.text();
        // console.log(text);
    });
})();
