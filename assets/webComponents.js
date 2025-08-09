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

class ConditionalContent extends HTMLElement {
  constructor() {
    super();
    this.contentWrapper = null;
    this.originalContent = [];
  }

  static get observedAttributes() {
    return ['params'];
  }

  connectedCallback() {
    this.originalContent = Array.from(this.childNodes);
    
    this.contentWrapper = document.createElement('span');
    this.contentWrapper.className = 'content-wrapper';
    
    this.originalContent.forEach(node => {
      this.contentWrapper.appendChild(node);
    });
    
    this.innerHTML = '';
    this.appendChild(this.contentWrapper);
    
    this.checkURLParams();
    
    this.boundCheckURLParams = () => this.checkURLParams();
    window.addEventListener('popstate', this.boundCheckURLParams);
  }

  disconnectedCallback() {
    if (this.boundCheckURLParams) {
      window.removeEventListener('popstate', this.boundCheckURLParams);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'params' && oldValue !== newValue) {
      this.checkURLParams();
    }
  }

  checkURLParams() {
    const paramsAttribute = this.getAttribute('params');
    
    if (!paramsAttribute) {
      this.showContent();
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const requiredParams = this.parseParams(paramsAttribute);
    
    
    const allChecksPassed = requiredParams.every(({ key, value }) => {
      if (value !== null) {
        const urlValue = urlParams.get(key);
        const matches = urlValue === value;

        return matches;
      } else {
        const exists = urlParams.has(key);

        return exists;
      }
    });


    if (allChecksPassed) {
      this.showContent();
    } else {
      this.hideContent();
    }
  }

  parseParams(paramsString) {
    return paramsString.split(',').map(param => {
      const trimmedParam = param.trim();
      const equalIndex = trimmedParam.indexOf('=');
      
      if (equalIndex === -1) {
        return { key: trimmedParam, value: null };
      } else {
        const key = trimmedParam.substring(0, equalIndex);
        const value = trimmedParam.substring(equalIndex + 1);
        return { key, value };
      }
    });
  }

  showContent() {
    
    this.classList.add('is-visible');
    if (this.contentWrapper) {
      this.contentWrapper.style.display = '';
    }
  }

  hideContent() {
    
    this.classList.remove('is-visible');
    if (this.contentWrapper) {
      this.contentWrapper.style.display = 'none';
    }
  }
}

customElements.define('conditional-content', ConditionalContent);