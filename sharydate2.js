/*!
 * SharyDate v1.2.0
 * Lightweight Vanilla JS Date Picker
 * Auto-initializes on all inputs with [data-sharydate] or .sharydate
 * Supports dynamically added inputs via MutationObserver
 */
(function (w, d) {
  class SharyDate {
    constructor(input) {
      this.input = typeof input === "string" ? d.querySelector(input) : input;

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
      this.el = d.createElement("div");
      this.el.className = "date-picker-overlay";
      d.body.appendChild(this.el);

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
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      this.monthSelect.innerHTML = "";
      months.forEach((m, i) => {
        this.monthSelect.add(new Option(m, i));
      });

      this.yearSelect.innerHTML = "";
      for (let y = this.today.getFullYear(); y >= 1950; y--) {
        this.yearSelect.add(new Option(y, y));
      }

      this.monthSelect.value = this.currentMonth;
      this.yearSelect.value = this.currentYear;

      this.enforceNoFutureInDropdowns();
    }

    bindEvents() {
      this.monthSelect.addEventListener("change", () => {
        this.currentMonth = Number(this.monthSelect.value);
        this.render();
      });

      this.yearSelect.addEventListener("change", () => {
        this.currentYear = Number(this.yearSelect.value);
        this.enforceNoFutureInDropdowns();
        this.render();
      });

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

      d.addEventListener("click", (e) => {
        if (!this.el.contains(e.target) && e.target !== this.input) {
          this.hide();
        }
      });

      this.el.addEventListener("click", (e) => e.stopPropagation());
    }

    enforceNoFutureInDropdowns() {
      const currentY = this.today.getFullYear();
      const currentM = this.today.getMonth();

      Array.from(this.yearSelect.options).forEach((o) => {
        o.disabled = Number(o.value) > currentY;
      });

      if (this.currentYear === currentY) {
        Array.from(this.monthSelect.options).forEach((o) => {
          o.disabled = Number(o.value) > currentM;
        });
      } else {
        Array.from(this.monthSelect.options).forEach((o) => {
          o.disabled = false;
        });
      }

      if (
        this.currentYear > currentY ||
        (this.currentYear === currentY && this.currentMonth > currentM)
      ) {
        this.currentYear = currentY;
        this.currentMonth = currentM;
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

      // Clear old days but keep weekday headers
      while (this.grid.children.length > 7) {
        this.grid.removeChild(this.grid.lastChild);
      }

      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

      // Fill empty slots before first day
      for (let i = 0; i < firstDay; i++) {
        const blank = d.createElement("div");
        this.grid.appendChild(blank);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(this.currentYear, this.currentMonth, day);
        const cell = d.createElement("div");
        cell.className = "date-picker-day";
        cell.textContent = day;

        if (date.getDay() === 5 || date.getDay() === 6) {
          cell.classList.add("weekend");
        }

        if (date.getTime() === this.today.getTime()) {
          cell.classList.add("today");
        }

        if (
          this.selectedDate &&
          date.getTime() === this.selectedDate.getTime()
        ) {
          cell.classList.add("selected");
        }

        // Disable future dates
        if (date.getTime() > this.today.getTime()) {
          cell.classList.add("disabled");
        } else {
          cell.addEventListener("click", () => {
            this.selectedDate = date;
            this.updateInput();
            this.render();
            this.hide();
          });
        }

        this.grid.appendChild(cell);
      }
    }

    updateInput() {
      if (!this.selectedDate) return;
      const y = this.selectedDate.getFullYear();
      const m = String(this.selectedDate.getMonth() + 1).padStart(2, "0");
      const dnum = String(this.selectedDate.getDate()).padStart(2, "0");
      this.input.value = `${y}-${m}-${dnum}`;
    }

    sync() {
      if (this.input.value) {
        const parsed = new Date(this.input.value);
        if (!isNaN(parsed.getTime())) {
          this.selectedDate = parsed;
          this.currentMonth = parsed.getMonth();
          this.currentYear = parsed.getFullYear();
        }
      }
      this.render();
    }

    show() {
      const rect = this.input.getBoundingClientRect();
      this.el.style.top = rect.bottom + window.scrollY + "px";
      this.el.style.left = rect.left + window.scrollX + "px";
      this.el.style.display = "block";
      this.render();
    }

    hide() {
      this.el.style.display = "none";
    }
  }

  // Auto-init existing inputs
  function initAll() {
    d.querySelectorAll("input.sharydate,[data-sharydate]").forEach((input) => {
      if (!input.dataset.sharydateAttached) {
        new SharyDate(input);
        input.dataset.sharydateAttached = "true";
      }
    });
  }

  initAll();

  // Watch DOM for new inputs
  const observer = new MutationObserver(() => initAll());
  observer.observe(d.body, { childList: true, subtree: true });

})(window, document);
