class TicketRow extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const icon = this.getAttribute('icon') || 'circle';
        const category = this.getAttribute('category') || '';
        const comment = this.getAttribute('comment') || '';
        const status = this.getAttribute('status') || 'open';
        const time = this.getAttribute('time') || '';
        const role = this.getAttribute('role') || 'user';

        const statusMap = {
            open: { dot: 'bg-green-500', text: 'text-green-600', label: 'Open' },
            'in-progress': { dot: 'bg-yellow-500', text: 'text-yellow-600', label: 'In Progress' },
            closed: { dot: 'bg-gray-400', text: 'text-gray-500', label: 'Closed' }
        };

        const s = statusMap[status] || statusMap.open;

        const assign = role === 'admin'
            ? `<button class="hidden md:flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3.5 py-2 rounded-full hover:border-gray-300 transition-colors shrink-0">
                    Assign
                    <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
               </button>`
            : '';

        this.innerHTML = `
            <div class="flex items-center gap-4 px-5 py-4 rounded-2xl bg-orange-50/40 hover:bg-orange-50/70 transition-colors">
                <div class="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                    <i data-lucide="${icon}" class="w-5 h-5 text-orange-600"></i>
                </div>

                <div class="min-w-0 flex-1">
                    <p class="text-sm font-semibold text-orange-600 truncate">${category}</p>
                    <p class="text-xs text-gray-400 truncate">${comment}</p>
                </div>

                <div class="hidden sm:flex items-center gap-1.5 shrink-0 w-24">
                    <span class="w-2 h-2 rounded-full ${s.dot}"></span>
                    <span class="text-xs font-medium ${s.text}">${s.label}</span>
                </div>

                ${assign}

                <div class="shrink-0 w-28 text-right">
                    <span class="text-xs text-gray-400 whitespace-nowrap">${time}</span>
                </div>
            </div>
        `;

        lucide.createIcons();
    }
}

customElements.define('ticket-row', TicketRow);