class PopupModal extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    disconnectedCallback() {
        this.cleanup();
    }
    static get observedAttributes() {
        return ['width', 'height'];
    }

    render() {
        // Wrapper principal do popup
        const wrapper = document.createElement('div');
        wrapper.className = 'popup-wrapper';
        wrapper.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            display: none;
        `;

        // Overlay (fundo escuro)
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            cursor: pointer;
        `;

        // Container do modal
        const modal = document.createElement('div');
        modal.className = 'popup-modal';
        modal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: ${this.getAttribute('max-width') || '500px' };
            max-height: ${this.getAttribute('max-height') || '80vh' };
            overflow-y: auto;
            min-width: 300px;
        `;

        // Botão fechar
        const closeButton = document.createElement('button');
        closeButton.className = 'popup-close';
        closeButton.innerHTML = '&times;';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            border: none;
            background: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            line-height: 1;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Container para o conteúdo original
        const contentContainer = document.createElement('div');
        contentContainer.className = 'popup-content';
        contentContainer.style.cssText = `
            margin-top: 10px;
        `;

        // Mover o conteúdo original para dentro do container
        while (this.firstChild) {
            contentContainer.appendChild(this.firstChild);
        }

        // Montar a estrutura
        modal.appendChild(closeButton);
        modal.appendChild(contentContainer);
        wrapper.appendChild(overlay);
        wrapper.appendChild(modal);
        
        this.appendChild(wrapper);

        // Armazenar referências
        this.wrapper = wrapper;
        this.overlay = overlay;
        this.modal = modal;
        this.closeButton = closeButton;
        this.contentContainer = contentContainer;
    }

    setupEventListeners() {
        // Fechar ao clicar no overlay
        this.overlay.addEventListener('click', () => this.close());
        
        // Fechar ao clicar no botão X
        this.closeButton.addEventListener('click', () => this.close());
        
        // Fechar com ESC
        this.escListener = (event) => {
            if (event.key === 'Escape' && this.isOpen) {
                this.close();
            }
        };
        document.addEventListener('keydown', this.escListener);

        // Prevenir fechamento ao clicar no modal
        this.modal.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    cleanup() {
        if (this.escListener) {
            document.removeEventListener('keydown', this.escListener);
        }
    }

    open() {
        this.isOpen = true;
        this.wrapper.style.display = 'block';
        this.setAttribute('open', '');
        document.body.style.overflow = 'hidden'; // Prevenir scroll do body
        
        // Adicionar animação de entrada
        this.wrapper.style.opacity = '0';
        requestAnimationFrame(() => {
            this.wrapper.style.transition = 'opacity 0.3s ease';
            this.wrapper.style.opacity = '1';
        });

        // Dispatch evento customizado
        this.dispatchEvent(new CustomEvent('popup-open', { 
            bubbles: true, 
            detail: { popup: this } 
        }));
    }

    close() {
        this.isOpen = false;
        
        // Animação de saída
        this.wrapper.style.transition = 'opacity 0.3s ease';
        this.wrapper.style.opacity = '0';
        
        setTimeout(() => {
            this.wrapper.style.display = 'none';
            this.removeAttribute('open');
            document.body.style.overflow = ''; // Restaurar scroll do body
        }, 300);

        // Dispatch evento customizado
        this.dispatchEvent(new CustomEvent('popup-close', { 
            bubbles: true, 
            detail: { popup: this } 
        }));
    }

    // Métodos públicos
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    static get observedAttributes() {
        return ['open'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'open') {
            if (newValue !== null && !this.isOpen) {
                this.open();
            } else if (newValue === null && this.isOpen) {
                this.close();
            }
        }
    }
}

customElements.define('popup-modal', PopupModal);