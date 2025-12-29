/**
 * Child Development Milestones Library
 * Version: 1.0.0
 * Description: Clinical milestones for growth monitoring from 1 to 60 months.
 */

const MILESTONE_DATA = [
  {month:1,label:"Startled by loud noise"},
  {month:2,label:"Smile responsively"},
  {month:3,label:"Holds head up"},
  {month:3,label:"Make simple sounds e.g. aah/ooh"},
  {month:4,label:"Wiggles and kicks with arms and legs"},
  {month:4,label:"Communicate hunger, fear, discomfort"},
  {month:4,label:"Sits with some support"},
  {month:5,label:"Eyes track moving object 180 degrees"},
  {month:5,label:"Roll over"},
  {month:6,label:"Turns head to sounds"},
  {month:6,label:"Reach and grasp objects"},
  {month:7,label:"Sits well without support"},
  {month:8,label:"Passes objects from hand to hand"},
  {month:9,label:"Stands holding on"},
  {month:9,label:"Imitate simple speech sounds"},
  {month:10,label:"Pull to standing position without help"},
  {month:11,label:"Begins placing objects in and out of a container"},
  {month:11,label:"Plays simple game like peek-a-boo"},
  {month:11,label:"Copies simple gestures"},
  {month:11,label:"Crawls on hands and knees"},
  {month:14,label:"Stand without support"},
  {month:14,label:"Says Mamma/Bappa specifically"},
  {month:14,label:"Wave bye-bye"},
  {month:15,label:"Asks for things by pointing at or by using one word"},
  {month:16,label:"Walks alone"},
  {month:17,label:"Drink from cup"},
  {month:21,label:"Build a tower of 2 cubes"},
  {month:24,label:"Kicks ball forward"},
  {month:25,label:"Point to 2 pictures"},
  {month:27,label:"Combine 2 words/simple sentences e.g. play ball"},
  {month:29,label:"Name 1 picture"},
  {month:30,label:"Points to body parts"},
  {month:34,label:"Throw ball"},
  {month:36,label:"Carries on a conversation using 2–3 sentences"},
  {month:36,label:"Sorts objects by shape and colour"},
  {month:36,label:"Runs easily"},
  {month:36,label:"Pretend play"},
  {month:37,label:"Names 4 pictures"},
  {month:38,label:"Name friend/sibling"},
  {month:40,label:"Can say own age/sex/name"},
  {month:45,label:"Name 1 colour"},
  {month:48,label:"Walks up and down stairs one foot each step"},
  {month:48,label:"Catches a bouncing ball most of the time"},
  {month:48,label:"Scribble on paper"},
  {month:49,label:"Retells a familiar story"},
  {month:49,label:"Copies a circle"},
  {month:51,label:"Hops"},
  {month:52,label:"Speech fully understandable"},
  {month:53,label:"Counts 1–10 in correct sequence"},
  {month:54,label:"Dresses on their own or with little help"},
  {month:56,label:"Draw a person"},
  {month:60,label:"Brushes teeth without help"}
];

window.Milestones = (function() {
  return {
    // Returns all data
    getAll: () => MILESTONE_DATA,
    
    // Returns milestones for a specific month
    getByMonth: (m) => MILESTONE_DATA.filter(item => item.month === Number(m)),
    
    // Logic to render into your UI
    render: function(containerId, month, existingData = {}) {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = "";

      const targets = this.getByMonth(month);
      
      if (targets.length === 0) {
        container.innerHTML = `<div class="col-span-full p-4 bg-slate-50 text-slate-400 text-xs italic rounded-lg">No specific milestones for Month ${month}</div>`;
        return;
      }

      targets.forEach((item, index) => {
        const fieldName = `milestone_${month}_${index}`;
        const val = existingData[fieldName] || "";
        
        container.insertAdjacentHTML("beforeend", `
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-tight">${item.label}</label>
            <select id="${fieldName}" name="${fieldName}" class="w-full text-sm border-b border-slate-300 py-1 bg-transparent focus:border-blue-500 outline-none transition-colors">
              <option value="">Select Result</option>
              <option value="Yes" ${val === "Yes" ? 'selected' : ''}>Yes</option>
              <option value="No" ${val === "No" ? 'selected' : ''}>No</option>
              <option value="undef" ${val === "undef" ? 'selected' : ''}>Unable to Assess</option>
            </select>
          </div>`);
      });
    }
  };
})();
