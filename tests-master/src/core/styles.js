// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest =
        function (s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s);
            var i;
            var el = this;
            do {
                i = matches.length;
                while (--i >= 0 && matches[i] !== el) { };
            } while ((i < 0) && (el = el.parentElement));
            return el;
        };
}

function insertStyle(container, id, stylesheet) {
    if (!container.querySelector(`style[data-id="${id}"]`)) {
        const style = document.createElement('style');
        style.setAttribute('data-id', id);
        style.appendChild(document.createTextNode(stylesheet));
        container.appendChild(style);
    }
}

export function addStyle(id, stylesheet, element) {
    let container;

    if (element && element.closest('html')) {
        container = element.closest('html').querySelector('head');
    } else {
        container = document.head;
    }

    insertStyle(container, id, stylesheet);
}
