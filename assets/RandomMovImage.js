class RandomMovImage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.intervalId = null;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    z-index: -1;
                    transition: top var(--move-duration, 5s) ease-in-out, 
                                left var(--move-duration, 5s) ease-in-out;
                }
                img {
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }
            </style>
            <img>
        `;

        this.imageElement = this.shadowRoot.querySelector('img');
    }

    static get observedAttributes() {
        return ['src', 'width', 'height', 'move-interval'];
    }

    connectedCallback() {
        this.startMovement();
    }

    disconnectedCallback() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src' && this.imageElement) {
            this.imageElement.src = newValue;
        } else if (name === 'width' || name === 'height') {
            this.style[name] = `${newValue}px`;
        } else if (name === 'move-interval' && oldValue !== newValue) {
            this.startMovement();
        }
    }

    startMovement() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        const moveInterval = parseInt(this.getAttribute('move-interval')) || 5000;
        this.style.setProperty('--move-duration', `${moveInterval / 1000}s`);

        this.moveRandomly();
        this.intervalId = setInterval(() => this.moveRandomly(), moveInterval);
    }

    moveRandomly() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const componentWidth = this.offsetWidth;
        const componentHeight = this.offsetHeight;

        const newLeft = Math.floor(Math.random() * (viewportWidth - componentWidth));
        const newTop = Math.floor(Math.random() * (viewportHeight - componentHeight));

        this.style.left = `${newLeft}px`;
        this.style.top = `${newTop}px`;
    }
}

customElements.define('random-mov-image', RandomMovImage);
