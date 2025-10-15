// ==UserScript==
// @name         Click tvw-essence Elements with Counter
// @namespace    http://tampermonkey.net/
// @author       HamletDuFromage
// @version      1.1
// @description  Click all .tvw-essence divs sequentially with a 1s delay when pressing a button, with a live counter
// @match        https://www.neopets.com/*
// @exclude      https://www.neopets.com/questlog/*
// @icon         https://www.neopets.com/favicon.ico
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    // Create container for button + counter
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    document.body.appendChild(container);

    // Create the button
    const btn = document.createElement('button');
    btn.textContent = 'Click tvw-essence';
    btn.style.padding = '10px 15px';
    btn.style.background = '#d9534f';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.fontSize = '14px';
    btn.style.cursor = 'pointer';
    container.appendChild(btn);

    // Create the counter
    const counter = document.createElement('div');
    counter.style.marginTop = '5px';
    counter.style.fontSize = '12px';
    counter.style.color = 'white';
    counter.style.background = '#333';
    counter.style.padding = '3px 6px';
    counter.style.borderRadius = '3px';
    container.appendChild(counter);

    // Function to update counter
    function updateCounter() {
        const count = document.querySelectorAll('div.tvw-essence').length;
        counter.textContent = `Found: ${count}`;
    }

    updateCounter();
    setInterval(updateCounter, 500);

    // Core collector
    async function clickEssences() {
        const elements = Array.from(document.querySelectorAll('div.tvw-essence'));
        console.log(`Found ${elements.length} essences.`);

        for (let i = 0; i < elements.length; i++) {
            try {
                // Call site's function directly instead of .click()
                if (typeof collectEssence === "function") {
                    collectEssence(elements[i]);
                    console.log(`Called collectEssence() on element ${i + 1}/${elements.length}`);
                } else {
                    console.warn("collectEssence not defined yet.");
                }
            } catch (err) {
                console.error("Error collecting essence:", err);
            }
            await new Promise(r => setTimeout(r, 3000));
        }

        // After finishing, wait a bit and check if any remain
        await new Promise(r => setTimeout(r, 1000));
        if (document.querySelectorAll('div.tvw-essence').length > 0) {
            console.log("Essences remain — reloading page...");
            location.reload();
        }
    }


    // Run when button clicked
    btn.addEventListener('click', clickEssences);

    // Auto-run 3s after page load
    window.addEventListener('load', () => {
        setTimeout(clickEssences, 3000);
    });

})();
