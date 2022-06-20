// ==UserScript==
// @name         z/place Overlay
// @license      MIT
// @version      2.0
// @description  Overlay for z/place
// @author       MinusKube & Grewa
// @match        https://zunivers.zerator.com/place
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zerator.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        none
// ==/UserScript==

const OVERLAY_URL = 'https://s8.gifyu.com/images/overlay1206B.png';
const NOTIFICATION_SOUND = new Audio('https://minuskube.fr/zplace_ready.mp3');
const DEFAULT_CONFIGURATION = {
    showOverlay: true,
    notificationSound: true
};

const configuration = DEFAULT_CONFIGURATION

function main() {
    setKeyBindings(configuration);
    loadOverlay();
    observeDocument(onDocumentChanged);
}

function setKeyBindings(configuration) {
    document.addEventListener('keypress', function (event) {
        if (event.code === 'KeyH') {
            configuration.showOverlay = !configuration.showOverlay
        } else if (event.code === 'KeyJ') {
            configuration.notificationSound = !configuration.notificationSound
            console.log('notification sound : ' + configuration.notificationSound);
        }
    });
}

function loadOverlay() {
    let canvas = document.getElementsByTagName('canvas')[0];
    const parentDiv = canvas.parentElement;

    const image = document.createElement('img');
    image.width = 500;
    image.height = 500;
    image.src = OVERLAY_URL;
    image.style = `position: absolute; left: 0; top: 0; image-rendering: pixelated;`;

    parentDiv.appendChild(image);
}
async function onDocumentChanged(mutations, _) {
    for (const mutation of mutations) {
        if (configuration.notificationSound && mutation.target.textContent === ' Colorier en ' && mutation.oldValue != null) {
            await NOTIFICATION_SOUND.play();
        }
        upsertSquareColorPreview();
    }
}

function upsertSquareColorPreview() {
    const divParent = document.querySelector('.area');
    const selectorImgEl = document.querySelector('.selector');

    let squareColorPreviewEl = document.querySelector('.square-color-preview');
    if (!squareColorPreviewEl) {
        squareColorPreviewEl = document.createElement('div');
        squareColorPreviewEl.setAttribute('class', 'square-color-preview')
        divParent.insertBefore(squareColorPreviewEl, selectorImgEl);
    }
    const style = 'width:8px; height:8px; margin-left:21px; margin-top:21px; position:absolute; top:0; left:0;';
    const transform = 'transform: ' + selectorImgEl.style.getPropertyValue('transform') + ';';
    const color = 'background-color: ' + document.querySelector('.color span').parentNode.style.getPropertyValue('background-color') + ';';
    squareColorPreviewEl.setAttribute('style', style + transform + color);
}

function observeDocument(onDocumentChanged) {
    const observer = new MutationObserver(onDocumentChanged);
    observer.observe(document, {
        childList: true,
        subtree: true,
        characterDataOldValue: true
    });
}

(function () {
    'use strict';
    waitForKeyElements ("canvas", main)
})();