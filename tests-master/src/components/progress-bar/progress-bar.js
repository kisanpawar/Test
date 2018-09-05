const tag = 'progress-bar';
const html = require('./progress-bar.html');
const css = require('./progress-bar.scss');

customElements.define(tag, class extends EDSElement {
    static get observedAttributes() {
        return ['load', 'buffer', 'motif'];
    }

    init() {
        this.initShadowDOM(tag, html, css);
        this.defineDefaultProperties(['motif']);
        this._refs = {
            load: this.$('.load-bar'),
            buffer: this.$('.buffer-bar')
        };
    }

    initShadowDOM(tag, html, css) {
        super.initShadowDOM(tag, html, css);
    }

    get load() {
        return this.getAttribute('load');
    }

    set load(value) {
        this.setAttribute('load', value);
        this._refs.load.style.width = value + '%';
    }

    get buffer() {
        return this.getAttribute('buffer');
    }

    set buffer(value) {
        this.setAttribute('buffer', value);
        this._refs.buffer.style.width = value + '%';
    }

    connectedCallback() {
    }
});
