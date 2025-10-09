// ==UserScript==
// @name         Neopets Quick donate for Faerie Festival
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        https://www.neopets.com/faeriefestival/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getRefCK() {
        const scripts = Array.from(document.scripts).map(s => s.textContent).join("\n");
        const match = scripts.match(/_ref_ck['"]?\s*:\s*['"]([a-f0-9]{16,64})['"]/i);
        if (match) return match[1];
        console.warn("_ref_ck token not found!");
        return null;
    }

    async function getObjIdsByName(itemName, refCK) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: '/np-templates/views/faeriefestival/2025/ajax/inventory.php',
                data: {
                    _ref_ck: refCK,
                    action: '',
                    alpha: '',
                    itemStack: 0,
                    refresh: 1
                },
                dataType: 'html',
                success: (html) => {
                    const container = document.createElement('div');
                    container.innerHTML = html;

                    const items = container.querySelectorAll('div.lazy.ff-item-img');
                    const result = [];
                    items.forEach(item => {
                        if (item.dataset.itemname === itemName) {
                            result.push(item.dataset.objid);
                        }
                    });
                    resolve(result);
                },
                error: (_, __, err) => reject(err)
            });
        });
    }

    function donateItemsAJAX(objIds, refCK, button) {
        if (!objIds.length) return console.warn('No object IDs to donate');

        const formData = new FormData();
        formData.append('_ref_ck', refCK);
        formData.append('donateItems', objIds.join(','));

        $.ajax({
            type: 'POST',
            url: '/np-templates/views/faeriefestival/2025/ajax/donateItem.php',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            xhrFields: { withCredentials: true },
            success: function(data) {
                console.log('Donate response:', data);

                if (data.prizeForDayMaxDonation) {
                    button.className = 'button-default__2020 button-green__2020 faeriefestival-recycle-button';
                    button.textContent = `Prize: ${data.prizeForDayMaxDonationName}`;
                } else {
                    button.textContent = `Donated! Success: ${data.success}`;
                }
            },
            error: function(err) {
                console.error('Error donating items:', err);
            }
        });
    }

    const container = document.querySelector('.faeriefestival-donate-container');
    if (!container) return;

    const textPara = container.querySelector('.faeriefestival-recycle-team-text');
    if (textPara) textPara.remove();

    container.style.gridTemplateColumns = '1fr 1fr';

    const itemName = "Voidberry Potion";
    const existingButton = container.querySelector('button.faeriefestival-recycle-button');
    if (!existingButton) return;

    const newButton = document.createElement('button');
    newButton.className = existingButton.className;
    newButton.textContent = `Donate 10 ${itemName}`;

    newButton.addEventListener('click', async () => {
        const refCK = getRefCK();
        if (!refCK) return;

        try {
            const ids = await getObjIdsByName(itemName, refCK);
            const donateIds = ids.slice(0, 9); // first 9 Voidberry Potions
            donateItemsAJAX(donateIds, refCK, newButton);
        } catch (err) {
            console.error('Error fetching or donating items:', err);
        }
    });

    existingButton.insertAdjacentElement('afterend', newButton);
})();
