import * as Popper from 'popper.js/dist/umd/popper.js';
import {addStyle} from './styles';

const css = '';

if (window.customElements) window.customElements.forcePolyfill = true;
window.ShadyDOM = {force: true};
require('@webcomponents/webcomponentsjs/webcomponents-lite');
require('./closest.js');

// eds-dropdown, eds-tooltip, eds-popover...
// Maybe optimize this include later
window.Popper = Popper.default;

window.EDSElement = require('./element');
// For component configuration
window.EDS = window.EDS || {};
window.EDS.setValue = (path, value) => {
    let obj = window.EDS;
    const parts = path.split('.');

    while (parts.length > 1) {
        const part = parts.shift();
        obj[part] = obj[part] || {};
        obj = obj[part];
    }

    obj[parts.shift()] = value;
};

addStyle('eds-global-styles', css);

// Show body after web components are ready
// This can be bypassed by adding "eds-show-body" class to the body tag
window.addEventListener('WebComponentsReady', () => {
    const body = document.querySelector('body');
    body.classList.add('eds');
    body.classList.add('eds-show-body');
});
