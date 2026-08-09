class CreateTicketModal extends HTMLElement {
    constructor() {
        super();
        this.selectedCategory = null;
        this.selectedFile = null;
    }

    connectedCallback() {
        // Replace this with your actual category list
        this.categories = [
            { key: 'hardware', label: 'Hardware', icon: 'monitor' },
            { key: 'network', label: 'Network', icon: 'wifi' },
            { key: 'software', label: 'Software', icon: 'app-window' },
            { key: 'account', label: 'Account', icon: 'user' },
            { key: 'other', label: 'Other', icon: 'circle-help' }
        ];

        this.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 hidden" id="overlay">
                <div class="w-full max-w-lg bg-white rounded-2xl border border-gray-100 shadow-xl p-6" id="panel">
                    <div class="flex items-center justify-between mb-5">
                        <h2 class="text-lg font-bold text-gray-900">Create Ticket</h2>
                        <button id="close-btn" class="text-gray-400 hover:text-gray-700 transition-colors">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <div class="space-y-5">
                        <div>
                            <label class="block text-sm font-semibold text-gray-900 mb-2">
                                Category <span class="text-orange-500">*</span>
                            </label>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2" id="category-grid">
                                ${this.categories.map(cat => `
                                    <button type="button" data-key="${cat.key}"
                                        class="category-btn flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors bg-white border-gray-200 text-gray-600 hover:border-gray-300">
                                        <i data-lucide="${cat.icon}" class="w-4 h-4"></i>
                                        ${cat.label}
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <div>
                            <label for="ticket-comment" class="block text-sm font-semibold text-gray-900 mb-2">
                                Describe the issue <span class="text-orange-500">*</span>
                            </label>
                            <textarea id="ticket-comment" rows="4" placeholder="Tell us what's going on..."
                                class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 resize-none"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-900 mb-2">
                                Attach a file <span class="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <div id="file-display">
                                <label for="ticket-file"
                                    class="flex items-center gap-2 w-fit px-3.5 py-2 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors">
                                    <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                                    Choose file
                                </label>
                            </div>
                            <input id="ticket-file" type="file" class="hidden">
                        </div>

                        <p id="error-msg" class="text-xs text-red-500 hidden"></p>

                        <div class="flex items-center justify-end gap-3 pt-1">
                            <button type="button" id="cancel-btn"
                                class="px-4 py-2.5 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button type="button" id="submit-btn" disabled
                                class="px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors">
                                Create Ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.wireEvents();
        lucide.createIcons();
    }

    wireEvents() {
        // Prevent overlay click from closing when clicking inside the panel
        this.querySelector('#panel').addEventListener('click', (e) => e.stopPropagation());

        this.querySelector('#overlay').addEventListener('click', () => this.resetAndClose());
        this.querySelector('#close-btn').addEventListener('click', () => this.resetAndClose());
        this.querySelector('#cancel-btn').addEventListener('click', () => this.resetAndClose());

        // Category selection
        this.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedCategory = btn.dataset.key;
                this.updateCategoryStyles();
                this.updateSubmitState();
            });
        });

        // Comment textarea
        this.querySelector('#ticket-comment').addEventListener('input', () => {
            this.updateSubmitState();
        });

        // File input
        this.querySelector('#ticket-file').addEventListener('change', (e) => {
            this.selectedFile = e.target.files?.[0] ?? null;
            this.updateFileDisplay();
            this.updateSubmitState();
        });

        // Submit
        this.querySelector('#submit-btn').addEventListener('click', () => {
            this.handleSubmit();
        });
    }

    updateCategoryStyles() {
        this.querySelectorAll('.category-btn').forEach(btn => {
            const selected = btn.dataset.key === this.selectedCategory;
            btn.classList.toggle('bg-orange-500', selected);
            btn.classList.toggle('border-orange-500', selected);
            btn.classList.toggle('text-white', selected);
            btn.classList.toggle('bg-white', !selected);
            btn.classList.toggle('border-gray-200', !selected);
            btn.classList.toggle('text-gray-600', !selected);
        });
    }

    updateFileDisplay() {
        const display = this.querySelector('#file-display');
        if (this.selectedFile) {
            display.innerHTML = `
                <div class="flex items-center gap-2 w-fit pl-3 pr-2 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-xs font-medium text-orange-700">
                    <i data-lucide="paperclip" class="w-3.5 h-3.5"></i>
                    <span class="max-w-[180px] truncate">${this.selectedFile.name}</span>
                    <button type="button" id="remove-file-btn" class="text-orange-400 hover:text-orange-700">
                        <i data-lucide="x" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            `;
            this.querySelector('#remove-file-btn').addEventListener('click', () => {
                this.selectedFile = null;
                this.querySelector('#ticket-file').value = '';
                this.updateFileDisplay();
                this.updateSubmitState();
            });
        } else {
            display.innerHTML = `
                <label for="ticket-file"
                    class="flex items-center gap-2 w-fit px-3.5 py-2 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors">
                    <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                    Choose file
                </label>
            `;
        }
        lucide.createIcons();
    }

    updateSubmitState() {
        const comment = this.querySelector('#ticket-comment').value.trim();
        const isValid = this.selectedCategory !== null && comment.length > 0;
        this.querySelector('#submit-btn').disabled = !isValid;
    }

    handleSubmit() {
        const comment = this.querySelector('#ticket-comment').value.trim();

        this.dispatchEvent(new CustomEvent('ticket-created', {
            detail: {
                category: this.selectedCategory,
                comment: comment,
                file: this.selectedFile
            },
            bubbles: true
        }));

        this.resetAndClose();
    }

    resetAndClose() {
        this.selectedCategory = null;
        this.selectedFile = null;
        this.querySelector('#ticket-comment').value = '';
        this.updateCategoryStyles();
        this.updateFileDisplay();
        this.querySelector('#error-msg').classList.add('hidden');
        this.close();
    }

    open() {
        this.querySelector('#overlay').classList.remove('hidden');
    }

    close() {
        this.querySelector('#overlay').classList.add('hidden');
    }
}

customElements.define('create-ticket-modal', CreateTicketModal);