const getAttributeKey = function (attribute) {
    if (typeof attribute !== 'object') throw new Error('This method intended only for object attributes');
    const keys = Object.getOwnPropertyNames(attribute);
    return keys[0];
};
const getAttributeValue = function (attribute) {
    if (typeof attribute !== 'object') throw new Error('This method intended only for object attributes');
    return attribute[getAttributeKey(attribute)];
};

module.exports = class _ extends HTMLElement {
    // Force super() call to get proper DOM instance
    constructor(_) { return (_ = super(_)).init(), _; } // eslint-disable-line constructor-super, no-sequences

    connectedCallback() {
        this.dispatchEvent(new CustomEvent('connected', {bubbles: true, cancelable: false}));
    }

    init() {
        console.error('EDSElement.prototype.init must be overridden!');
    }

    static get attributePropertyMap() {
        return this._attributePropertyMap || {};
    }

    // Accepts strings and objects to handle lowercase and camelcase scenarios
    // caches the first set unless `force` is true
    static normalizeObservedAttributes(attributes, force) {
        this._attributePropertyMap = _.attributePropertyMap || {};

        if (force || !this._observedAttributes) {
            this._observedAttributes = [];
            attributes.forEach(attribute => {
                // Observe both key and value for objects
                // (necssary to use camel case in some frameworks)
                if (typeof attribute === 'object') {
                    const key = getAttributeKey(attribute);
                    const value = getAttributeValue(attribute);
                    this._observedAttributes.push(key);
                    this._observedAttributes.push(value);
                    // Build internal property map
                    this._attributePropertyMap[key] = value;
                } else {
                    this._observedAttributes.push(attribute);
                }
            });
        }

        return this._observedAttributes;
    }

    // Convenience (Chrome's shortcut)
    $(selector) {
        return this.shadowRoot.querySelector(selector);
    }

    // Convenience (Chrome's shortcut)
    $$(selector) {
        return this.shadowRoot.querySelectorAll(selector);
    }

    initShadowDOM(tag, html, css) {
        if (css && !document.head.querySelector(`[data-tag="${tag}"]`)) {
            const style = document.createElement('style');
            style.dataset.tag = tag;
            style.textContent = css;
            document.head.appendChild(style);
        }

        const template = document.createElement('template');
        template.innerHTML = html;

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));

        // common style scope
        this.classList.add('eds');

        return shadowRoot;
    }

    defineProperties(names, createDescriptor) {
        return Object.defineProperties(this, names.map(createDescriptor).reduce((ds, d) => Object.assign({}, ds, d), {}));
    }

    defineDefaultProperties(names) {
        this.defineProperties(names, descriptor);

        function descriptor(name) {
            if (typeof attribute === 'object') name = getAttributeKey(name);
            name = _.attributePropertyMap[name] || name;
            return {
                [name]: {
                    get() {
                        return this.getAttribute(name);
                    },
                    set(value) {
                        this.setAttribute(name, value);
                    }
                }
            };
        }
    }

    defineFlagProperties(names) {
        this.defineProperties(names, descriptor);

        function descriptor(name) {
            if (typeof attribute === 'object') name = getAttributeKey(name);
            name = _.attributePropertyMap[name] || name;
            return {
                [name]: {
                    get() {
                        return this.hasAttribute(name);
                    },
                    set(value) {
                        this.setOrRemoveFlagAttribute(name, value);
                    }
                }
            };
        }
    }

    flagAttributeIsTruthy(value) {
        return (value || value === '');
    }

    setOrRemoveFlagAttribute(name, value) {
        this.flagAttributeIsTruthy(value) ? this.setAttribute(name, value) : this.removeAttribute(name);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        oldValue !== newValue && (this[name] = newValue);
    }

    // Used to surface events from the shadow DOM that are normally blocked (i.e. 'change')
    // Should not be used with events that aren't blocked, else they will double fire
    bubbleShadowEvents(els, events) {
        els = Array.isArray(els) ? els : [els];
        events.forEach(event => {
            els.forEach(el => {
                el.addEventListener(event, e => {
                    const newEvent = new e.constructor(e.type, e);
                    this.dispatchEvent(newEvent);
                });
            });
        });
    }
};
