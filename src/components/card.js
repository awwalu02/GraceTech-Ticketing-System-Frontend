class Card extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const content = this.innerHTML;
        const extraClasses = this.getAttribute('class') || '';

        this.innerHTML = `
            <div class="bg-white rounded-2xl border border-gray-100 p-5 ${extraClasses}">
                ${content}
            </div>
        `;
    }
}

customElements.define('app-card', Card);