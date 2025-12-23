class AutoOpenPopupModal extends PopupModal {
    connectedCallback() {
        super.connectedCallback();

        queueMicrotask(() => {
            if (this.shouldOpen()) {
                this.open();
            }
        });
    }

    static get observedAttributes() {
        return [
            ...(super.observedAttributes || []),
            'section-key',
            'section-key-life'
        ];
    }

    close() {
        this.persistSectionKey();
        super.close();
    }


    shouldOpen() {
        const key = this.getAttribute('section-key');
        if (!key) return true;

        const life = Number(this.getAttribute('section-key-life')) || 0;

        if (!life) return true;

        const stored = localStorage.getItem(this.storageKey(key));

        if (!stored) return true;

        const expiresAt = Number(stored);

        return Date.now() > expiresAt;
    }

    persistSectionKey() {
        const key = this.getAttribute('section-key');
        if (!key) return;

        const life = (Number(this.getAttribute('section-key-life')) || 0) * 1000;
        
        if (!life) return;

        const expiresAt = Date.now() + life;

        localStorage.setItem(
            this.storageKey(key),
            String(expiresAt)
        );
    }

    storageKey(key) {
        return `popup-section:${key}`;
    }
}

customElements.define('auto-open-popup-modal', AutoOpenPopupModal);
