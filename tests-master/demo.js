/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function testBar0() {
    const element = document.querySelector('progress-bar:not([motif])');
    element.setAttribute('load', 46);
    element.setAttribute('buffer', 56);
}

function testBar1() {
    const element = document.querySelector('progress-bar[motif="magenta"]');
    element.setAttribute('load', 64);
    element.setAttribute('buffer', 66);
}

function testBar2() {
    const element = document.querySelector('progress-bar[motif="purple"]');
    element.setAttribute('load', 56);
    element.setAttribute('buffer', 76);
}

function testBar3() {
    const element = document.querySelector('progress-bar[motif="grey"]');
    element.setAttribute('load', 66);
    element.setAttribute('buffer', 86);
}
