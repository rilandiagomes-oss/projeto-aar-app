class PopupButton extends HTMLButtonElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!this.hasAttribute('type')) {
            this.setAttribute('type', 'button');
        }
        this.addEventListener('click', this.handleClick.bind(this));
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.handleClick.bind(this));
    }

    handleClick(event) {
        event.preventDefault();
        
        const popupId = this.getAttribute('popup-target');
        if (popupId) {
            const popup = document.getElementById(popupId);
            if (popup && popup.tagName.toLowerCase() === 'popup-modal') {
                popup.open();
            } else {
                console.warn(`Popup com id "${popupId}" não encontrado ou não é um popup-modal`);
            }
        }
    }

    static get observedAttributes() {
        return ['popup-target'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'popup-target') {
        }
    }
}

customElements.define('popup-button', PopupButton, { extends: 'button' });