// sharydate.js
class SharyDate {
  constructor(input) {
    this.input = input;
    this.mode = 'all';
    if(input.classList.contains('sharydate-past')) this.mode='past';
    if(input.classList.contains('sharydate-future')) this.mode='future';
    if(input.classList.contains('sharydate-cont')) this.mode='cont';

    this.today = new Date(new Date().getTime() + 5*60*60*1000); // GMT+5

    this.dropdown = document.createElement("div");
    Object.assign(this.dropdown.style, {
      position: "absolute",
      background: "#fff",
      border: "1px solid #ccc",
      borderRadius: "6px",
      padding: "8px",
      display: "none",
      boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
      zIndex: 9999,
      fontFamily: "Arial, sans-serif",
      fontSize: "14px"
    });

    this.dropdown.innerHTML = `
      <div style="margin-bottom:6px; display:flex; gap:5px;">
        <select class="year" style="flex:1; padding:4px; border-radius:4px; border:1px solid #ccc;"></select>
        <select class="month" style="flex:1; padding:4px; border-radius:4px; border:1px solid #ccc;"></select>
        <select class="day" style="flex:1; padding:4px; border-radius:4px; border:1px solid #ccc;"></select>
      </div>
      <div style="display:flex; justify-content:space-between; margin-top:6px;">
        <button type="button" class="clearBtn" style="padding:4px 8px; border-radius:4px; border:1px solid #ccc; background:#f8f9fa;">Clear</button>
        <button type="button" class="todayBtn" style="flex:1; margin:0 5px; padding:4px 8px; border-radius:4px; border:1px solid #007bff; background:#007bff; color:#fff;">Today</button>
        <button type="button" class="closeBtn" style="padding:4px 8px; border-radius:4px; border:1px solid #ccc; background:#f8f9fa;">Close</button>
      </div>
    `;
    document.body.appendChild(this.dropdown);

    this.year = this.dropdown.querySelector(".year");
    this.month = this.dropdown.querySelector(".month");
    this.day = this.dropdown.querySelector(".day");
    this.clearBtn = this.dropdown.querySelector(".clearBtn");
    this.todayBtn = this.dropdown.querySelector(".todayBtn");
    this.closeBtn = this.dropdown.querySelector(".closeBtn");

    this.monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    this.populateYears();
    this.populateMonths();
    this.populateDays();

    if(!this.input.value) this.prefillDate();

    this.year.addEventListener("change", ()=>this.populateMonths());
    this.month.addEventListener("change", ()=>this.populateDays());

    this.input.addEventListener("click", () => {
      const rect = this.input.getBoundingClientRect();
      this.dropdown.style.top = rect.bottom + window.scrollY + "px";
      this.dropdown.style.left = rect.left + window.scrollX + "px";
      this.dropdown.style.display = "block";
    });

    this.clearBtn.addEventListener("click", ()=> { this.input.value=""; this.dropdown.style.display="none"; });
    this.closeBtn.addEventListener("click", ()=> this.dropdown.style.display="none");
    this.todayBtn.addEventListener("click", ()=> { 
      this.input.value = `${this.today.getFullYear()}-${String(this.today.getMonth()+1).padStart(2,"0")}-${String(this.today.getDate()).padStart(2,"0")}`;
      this.dropdown.style.display="none";
    });

    document.addEventListener("click", e => {
      if (!this.dropdown.contains(e.target) && e.target!==this.input) this.dropdown.style.display="none";
    });
  }

  prefillDate(){
    const d = this.today;
    this.year.value = d.getFullYear();
    this.month.value = d.getMonth()+1;
    this.populateDays();
    this.day.value = d.getDate();
    this.updateInput();
  }

  populateYears(){
    const current = this.today.getFullYear();
    let start = 1900, end = 2100;
    if(this.mode==='past') end = current;
    if(this.mode==='future' || this.mode==='cont') start = current;
    this.year.innerHTML="";
    for(let y=end; y>=start; y--){
      const opt = document.createElement("option");
      opt.value=y; opt.textContent=y;
      this.year.appendChild(opt);
    }
  }

  populateMonths(){
    const selectedYear = parseInt(this.year.value);
    let start=1,end=12;
    if(this.mode==='past' && selectedYear===this.today.getFullYear()) end = this.today.getMonth()+1;
    if((this.mode==='future' || this.mode==='cont') && selectedYear===this.today.getFullYear()) start = this.today.getMonth()+1;
    this.month.innerHTML="";
    this.monthNames.forEach((name,index)=>{
      if(index+1<start || index+1>end) return;
      const opt = document.createElement("option");
      opt.value=index+1; opt.textContent=name;
      this.month.appendChild(opt);
    });
    if(!this.month.querySelector(`option[value='${this.month.value}']`)) this.month.value=this.month.querySelector('option')?.value;
    this.populateDays();
  }

  populateDays(){
    const y = parseInt(this.year.value);
    const m = parseInt(this.month.value);
    const daysInMonth = new Date(y,m,0).getDate();
    this.day.innerHTML="";
    for(let d=1; d<=daysInMonth; d++){
      const opt = document.createElement("option");
      opt.value=d; opt.textContent=d;
      this.day.appendChild(opt);
    }
    this.updateInput();
  }

  updateInput(){
    const y = this.year.value;
    const m = String(this.month.value).padStart(2,"0");
    const d = String(this.day.value).padStart(2,"0");
    this.input.value = `${y}-${m}-${d}`;
  }
}

// Auto-init all inputs
(function(){
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded", ()=>document.querySelectorAll(".sharydate").forEach(input=>new SharyDate(input)));
  } else {
    document.querySelectorAll(".sharydate").forEach(input=>new SharyDate(input));
  }
})();
