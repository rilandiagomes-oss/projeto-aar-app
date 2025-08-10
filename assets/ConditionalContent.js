
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

    const paramCases = paramsAttribute.split('|');
    
    let showContent = false;

    paramCases.forEach(paramCase =>{
      const requiredParams = this.parseParams(paramCase);
    
      const checksPassed = requiredParams.every(({ key, value }) => {
        if (value !== null) {
          const urlValue = urlParams.get(key);
          const matches = urlValue === value;

          return matches;
        } else {
          const exists = urlParams.has(key);

          return exists;
        }
      });


      if (checksPassed) {
        showContent = true;
        return;
      }
    })

    showContent ? this.showContent() : this.hideContent();
    
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