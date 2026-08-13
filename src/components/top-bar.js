class TopBar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const pageTitles = {
            '/admin/index.html': 'Dashboard',
            '/admin/tickets.html': 'Tickets',
            '/admin/history.html': 'History',
            '/portal/index.html': 'Dashboard',
            '/portal/tickets.html': 'Tickets',
            '/portal/history.html': 'History'
        };

        const currentPath = window.location.pathname;
        const title = this.getAttribute('title') || pageTitles[currentPath] || '';

        const actionLabel = this.getAttribute('action-label') || '';
        const notificationCount = parseInt(this.getAttribute('notification-count')) || 0;
        const showBell = this.getAttribute('show-bell') !== 'false';

        const bellMarkup = showBell ? `
            <a href="/notifications.html" id="bell-link" class="relative text-gray-400 hover:text-gray-700 transition-colors">
                <i data-lucide="bell" class="w-5 h-5"></i>
                ${notificationCount > 0 ? `
                    <span class="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-orange-500 text-white text-[10px] font-semibold flex items-center justify-center ring-2 ring-white">
                        ${notificationCount}
                    </span>
                ` : ''}
            </a>
        ` : '';

        const actionMarkup = actionLabel ? `
            <app-button variant="ticket" label="${actionLabel}"></app-button>
        ` : '';

        this.innerHTML = `
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-2xl font-bold text-gray-900 tracking-tight">${title}</h1>
                <div class="flex items-center gap-4">
                    ${bellMarkup}
                    ${actionMarkup}
                </div>
            </div>
        `;

        lucide.createIcons();
    }
}

customElements.define('app-topbar', TopBar);