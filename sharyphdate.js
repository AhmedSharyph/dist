class CustomDatePicker {
    constructor(input) {
        this.input = input;
        this.today = new Date();
        this.today.setHours(0, 0, 0, 0);

        this.selectedDate = null;
        this.currentMonth = this.today.getMonth();
        this.currentYear = this.today.getFullYear();

        this.create();
        setTimeout(() => this.sync(), 0);

        this.input.addEventListener("click", () => this.show());
        this.input.addEventListener("focus", () => this.show());
    }

    create() {
        this.el = document.createElement("div");
        this.el.className = "date-picker-overlay";
        document.body.appendChild(this.el);

        // ✅ Dropdowns for month/year
        this.el.innerHTML = `
            <div class="date-picker-header">
                <select class="month-select"></select>
                <select class="year-select"></select>
            </div>
            <div class="date-picker-grid">
                <div class="date-picker-weekday">S</div>
                <div class="date-picker-weekday">M</div>
                <div class="date-picker-weekday">T</div>
                <div class="date-picker-weekday">W</div>
                <div class="date-picker-weekday">T</div>
                <div class="date-picker-weekday">F</div>
                <div class="date-picker-weekday">S</div>
            </div>
            <div class="date-picker-footer">
                <span class="clear">Clear</span>
                <span class="today">Today</span>
                <span class="close">Close</span>
            </div>
        `;

        this.monthSelect = this.el.querySelector(".month-select");
        this.yearSelect = this.el.querySelector(".year-select");
        this.grid = this.el.querySelector(".date-picker-grid");

        this.clearLink = this.el.querySelector(".clear");
        this.todayLink = this.el.querySelector(".today");
        this.closeLink = this.el.querySelector(".close");

        this.populateMonthYear();
        this.bindEvents();
    }

    populateMonthYear() {
        const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
        
        // Populate months
        this.monthSelect.innerHTML = "";
        monthNames.forEach((name, i) => {
            const opt = new Option(name, i);
            this.monthSelect.add(opt);
        });

        // Populate years (1950 → this year)
        this.yearSelect.innerHTML = "";
        for (let y = this.today.getFullYear(); y >= 1950; y--) {
            this.yearSelect.add(new Option(y, y));
        }

        // Set current
        this.monthSelect.value = this.currentMonth;
        this.yearSelect.value = this.currentYear;

        // Enforce no future on load
        this.enforceNoFutureInDropdowns();
    }

    bindEvents() {
        // On month/year change
        this.monthSelect.addEventListener("change", () => {
            this.currentMonth = Number(this.monthSelect.value);
            this.render();
        });

        this.yearSelect.addEventListener("change", () => {
            this.currentYear = Number(this.yearSelect.value);
            this.enforceNoFutureInDropdowns(); // Re-check after change
            this.render();
        });

        // Footer
        this.clearLink.addEventListener("click", () => {
            this.input.value = "";
            this.selectedDate = null;
            this.render();
            this.hide();
        });

        this.todayLink.addEventListener("click", () => {
            this.currentMonth = this.today.getMonth();
            this.currentYear = this.today.getFullYear();
            this.selectedDate = new Date(this.today);
            this.updateInput();
            this.syncDropdowns();
            this.render();
        });

        this.closeLink.addEventListener("click", () => this.hide());

        // Close on outside click
        document.addEventListener("click", e => {
            if (!this.el.contains(e.target) && e.target !== this.input) this.hide();
        });

        this.el.addEventListener("click", e => e.stopPropagation());
    }

    enforceNoFutureInDropdowns() {
        const maxYear = this.today.getFullYear();
        const maxMonth = this.today.getMonth();

        // Disable future years
        Array.from(this.yearSelect.options).forEach(opt => {
            opt.disabled = Number(opt.value) > maxYear;
        });

        // Disable future months if current year is max year
        if (this.currentYear === maxYear) {
            Array.from(this.monthSelect.options).forEach(opt => {
                opt.disabled = Number(opt.value) > maxMonth;
            });
        } else {
            Array.from(this.monthSelect.options).forEach(opt => {
                opt.disabled = false;
            });
        }

        // If current selection is invalid, reset to max allowed
        if (this.currentYear > maxYear || (this.currentYear === maxYear && this.currentMonth > maxMonth)) {
            this.currentYear = maxYear;
            this.currentMonth = maxMonth;
            this.syncDropdowns();
        }
    }

    syncDropdowns() {
        this.monthSelect.value = this.currentMonth;
        this.yearSelect.value = this.currentYear;
        this.enforceNoFutureInDropdowns();
    }

    render() {
        this.syncDropdowns();

        // Clear old days
        while (this.grid.children.length > 7) {
            this.grid.removeChild(this.grid.lastChild);
        }

        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

        // Empty cells
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement("div");
            empty.className = "date-picker-day disabled";
            this.grid.appendChild(empty);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentYear, this.currentMonth, day);
            date.setHours(0, 0, 0, 0);

            const cell = document.createElement("div");
            cell.className = "date-picker-day";
            cell.textContent = day;

            if (date > this.today) {
                cell.classList.add("disabled");
            } else {
                const dow = date.getDay();
                if (dow === 5 || dow === 6) cell.classList.add("weekend");
                if (date.getTime() === this.today.getTime()) cell.classList.add("today");
                if (this.selectedDate && date.getTime() === this.selectedDate.getTime()) cell.classList.add("selected");

                cell.addEventListener("click", () => {
                    this.selectedDate = date;
                    this.updateInput();
                    this.render();
                    setTimeout(() => this.hide(), 50); // Faster close
                });
            }

            this.grid.appendChild(cell);
        }
    }

    sync() {
        if (/^\d{4}-\d{2}-\d{2}$/.test(this.input.value)) {
            const [y, m, d] = this.input.value.split('-').map(Number);
            const date = new Date(y, m - 1, d);
            if (date <= this.today && !isNaN(date.getTime())) {
                this.selectedDate = date;
                this.currentMonth = date.getMonth();
                this.currentYear = date.getFullYear();
            }
        }
        this.render();
    }

    updateInput() {
        if (!this.selectedDate) {
            this.input.value = "";
            return;
        }
        const y = this.selectedDate.getFullYear();
        const m = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
        const d = String(this.selectedDate.getDate()).padStart(2, '0');
        this.input.value = `${y}-${m}-${d}`;
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    show() {
        const rect = this.input.getBoundingClientRect();
        this.el.style.top = `${rect.bottom + window.scrollY + 4}px`;
        this.el.style.left = `${rect.left + window.scrollX}px`;
        this.el.style.display = "block";
        this.render();
    }

    hide() {
        this.el.style.display = "none";
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".custom-date").forEach(el => {
        if (!el.picker) el.picker = new CustomDatePicker(el);
    });
});
