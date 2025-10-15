// ==UserScript==
// @name         Neopets TVW Rewards fast purchase
// @namespace    http://tampermonkey.net/
// @match        https://www.neopets.com/tvw/rewards/*
// @version      1.1
// @author       HamletDuFromage
// @icon         https://www.neopets.com/favicon.ico
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const confirmBtn = document.querySelector('#PlotConfirmButton');
    if (!confirmBtn) return;

    document.querySelectorAll('.plothub-shop-item').forEach(el => {
        el.removeAttribute('onclick');
        el.removeAttribute('onkeyup');

        const img = el.querySelector('img');
        img.addEventListener('click', e => {
            e.stopPropagation();
            const id = el.dataset.purchase;
            confirmBtn.dataset.purchase = id;
            PlotHub.purchasePrize(confirmBtn);
        });

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.placeholder = '#';
        el.appendChild(input);

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                const n = parseInt(input.value, 10);
                const id = el.dataset.purchase;
                input.value = '';
                let count = 0;
                let delay = 250;
                const interval = setInterval(() => {
                    if (count >= n) {
                        clearInterval(interval);
                        return;
                    }
                    confirmBtn.dataset.purchase = id;
                    PlotHub.purchasePrize(confirmBtn);
                                        count++;
                    input.placeholder = "Bought " + count;
                }, delay);
            }
        });
    });
})();
