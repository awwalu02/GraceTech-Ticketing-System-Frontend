class Button extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const variant = this.getAttribute('variant');
        const extraClasses = this.getAttribute('class') || '';

        const labels = {
            ticket: 'Create Ticket',
            login: 'Login',
            signup: 'Signup'
        };

        const label = labels[variant] || 'Button';

        const icon = variant === 'ticket'
            ? `<i data-lucide="plus" class="w-4 h-4"></i>`
            : '';

        this.innerHTML = `
        <div>
        <button class="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors flex items-center gap-2 ${extraClasses}">
            ${icon}
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

        lucide.createIcons();
    }
}

customElements.define('app-button', Button);