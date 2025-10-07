// ==UserScript==
// @name         Neopets Home: Groom & Feed Pet Button
// @namespace    http://tampermonkey.net/
// @author       HamletDuFromage
// @version      1.1
// @description  Adds a button on the home page to POST useobject
// @match        https://www.neopets.com/home/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==


(function() {
    'use strict';

    async function findPetcareObjIdByName(petName, itemName, invId) {
        if (typeof $ !== 'function' || !$.ajax) return null;
        const url = '/np-templates/ajax/petcare.php?action=' + invId + '&petname=' + petName;

        const html = await new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'html',
                success: resolve,
                error: (_, __, err) => reject(err)
            });
        });

        const container = document.createElement('div');
        container.innerHTML = html;
        const items = container.querySelectorAll('.petCare-itemgrid-item');
        for (const el of items) {
            const name = el.getAttribute('data-itemname') || '';
            if (name.trim() === itemName) {
                const objId = el.getAttribute('data-objid');
                if (objId) return objId;
            }
        }
        return null;
    }

    function createHomeUseObjectButtons(objName, care, invId) {
        if (typeof $ !== 'function') return;

        let $nameplates = $('div.hp-carousel-nameplate.button-default__2020.button-yellow__2020');
        if ($nameplates.length === 0) {
            $nameplates = $('div.hp-carousel-nameplate');
        }

        $nameplates.each(function() {
            const $plate = $(this);
            const petName = $plate.attr('data-name') || $plate.text().trim() || 'Pet';
            const action = care + ' ' + petName;

            const $btn = $('<button>')
                .text(objName)
                .addClass('button-default__2020 button-yellow__2020 btn-single__2020');

            $btn.on('click', async function() {
                const objId = await findPetcareObjIdByName(petName, objName, invId);
                if (!objId) {
                    $btn.removeClass().addClass('button-default__2020 button-yellow__2020 btn-single__2020').text('✖ Not found: ' + objName);
                    return;
                }
                $.ajax({
                    type: 'POST',
                    url: '/np-templates/views/useobject.phtml',
                    data: {
                        obj_id: objId,
                        action: action,
                        petcare: 1
                    },
                    complete: function() {
                        $btn.removeClass().addClass('button-default__2020 button-yellow__2020 btn-single__2020').text('✔ ' + objName);
                    }
                });
            });

            $plate.after($btn);
        });
    }

    createHomeUseObjectButtons("Snazzy Moon Comb", "Groom", 4);
    createHomeUseObjectButtons("Coffee and Marshmallows", "Feed to", 1);
})();

