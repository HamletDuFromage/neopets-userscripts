// ==UserScript==
// @name         Neopets autoclaim questlog button
// @namespace    http://tampermonkey.net/
// @author       HamletDuFromage
// @version      1.9
// @description  Add a Neo-style "Claim Quests" section above the NeoPass quest link
// @match        https://www.neopets.com/questlog/*
// @icon         https://www.neopets.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function insertClaimBlock() {
        function updateCounter() {
            const count = document.querySelectorAll('div.ql-quest-buttons button.ql-claim:not([disabled])').length;
            btn.toggleAttribute('disabled', count === 0);
        }

        let btn = document.querySelector('#claimQuestsBtn');
        if (btn) {
            updateCounter();
            return true;
        }

        const neoPassLink = document.querySelector('.questlog-neopass-link');
        if (!neoPassLink) return false;

        const customBlock = document.createElement('div');
        customBlock.className = 'questlog-claim-link questlog-neopass-link';

        const textDiv = document.createElement('div');
        textDiv.className = 'ql-neopass-text';
        textDiv.textContent = 'Claim all available quests automatically:';
        customBlock.appendChild(textDiv);

        btn = document.createElement('button');
        btn.tabIndex = 0;
        btn.id = 'claimQuestsBtn'
        btn.className = 'button-default__2020 button-yellow__2020 btn-single__2020';
        btn.textContent = 'Claim Quests';
        customBlock.appendChild(btn);

        neoPassLink.parentNode.insertBefore(customBlock, neoPassLink);

        btn.addEventListener('click', async () => {
            while (true) {
                const el =
                    document.querySelector('div.ql-quest-buttons button.ql-claim:not([disabled])') ||
                    document.querySelector('.ql-bonus-claim');
        
                if (!el) break;
        
                el.onclick();
                await new Promise(r => setTimeout(r, 1500));
            }
        });

        return true;
    }

    const observer = new MutationObserver(() => {
        insertClaimBlock();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    })();
