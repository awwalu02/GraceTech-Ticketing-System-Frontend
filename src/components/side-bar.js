class Sidebar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const role = this.getAttribute('role') || 'user';
        const userName = this.getAttribute('user-name') || 'Unknown';
        const userEmail = this.getAttribute('user-email') || '';
        const initial = userName.charAt(0).toUpperCase();

        const currentPath = window.location.pathname;
        const section = currentPath.startsWith('/admin') ? 'admin' : 'portal';

        const navItems = [
            { label: 'Dashboard', icon: 'layout-dashboard', href: `/${section}/index.html` },
            { label: 'Tickets', icon: 'ticket', href: `/${section}/tickets.html` },
            { label: 'History', icon: 'history', href: `/${section}/history.html` }
        ];

        this.innerHTML = `
            <aside class="w-64 shrink-0 h-screen bg-white border-r border-gray-100 flex flex-col justify-between">
                <div>
                    <div class="px-6 pt-7 pb-6 flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                            <i data-lucide="headphones" class="w-4 h-4 text-white"></i>
                        </div>
                        <span class="text-[15px] font-bold text-gray-900 tracking-tight">IT Support</span>
                    </div>

                    <div class="px-4">
                        <p class="px-3 mb-2 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">Overview</p>
                        <nav class="space-y-1">
                            ${navItems.map(item => {
                                const isActive = currentPath === item.href;
                                return `
                                    <a href="${item.href}"
                                        class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors
                                        ${isActive ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}">
                                        <i data-lucide="${item.icon}" class="w-[18px] h-[18px]"></i>
                                        <span>${item.label}</span>
                                    </a>
                                `;
                            }).join('')}
                        </nav>
                    </div>
                </div>

                <div class="px-4 pb-5">
                    <button id="settings-btn" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors mb-3">
                        <i data-lucide="settings" class="w-[18px] h-[18px]"></i>
                        <span>Settings</span>
                    </button>
                    <div class="border-t border-gray-100 pt-4 px-1 flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-sm font-semibold">
                            ${initial}
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-gray-900 leading-tight truncate">${userName}</p>
                            <p class="text-xs text-gray-400 leading-tight truncate">${userEmail}</p>
                        </div>
                        <button id="logout-btn" class="text-gray-400 hover:text-gray-700 transition-colors">
                            <i data-lucide="log-out" class="w-[17px] h-[17px]"></i>
                        </button>
                    </div>
                </div>
            </aside>
        `;

        this.querySelector('#logout-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('sidebar-logout', { bubbles: true }));
        });

        lucide.createIcons();
    }
}

customElements.define('app-sidebar', Sidebar);