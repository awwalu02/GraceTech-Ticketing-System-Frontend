class Button extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const variant = this.getAttribute('variant');
        const label = this.innerHTML;

        this.innerHTML = `
        <div>
        <button class="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors">
            ${label}
        </button>
        </div>
        `;

        this.querySelector('button').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('app-button-click', {
                detail: { variant },
                bubbles: true
            }));
        });
    }
}

customElements.define('app-button', Button);