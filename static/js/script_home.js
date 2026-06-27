// ===================== DATA =====================

const ROUTES = [
  { name:"Downtown → Airport", dist:"18.4 km", time:"32 min", delta:"+8 min vs normal", status:"moderate" },
  { name:"Central Station → Tech Park", dist:"7.2 km", time:"14 min", delta:"On time", status:"clear" },
  { name:"University → Shopping Mall", dist:"12.1 km", time:"51 min", delta:"+23 min vs normal", status:"heavy" },
  { name:"Harbor → City Center", dist:"5.6 km", time:"11 min", delta:"On time", status:"clear" },
];

const SEGMENTS = [
  { name:"Main Street", sub:"1st Ave → 7th Ave", speed:"22 km/h", status:"heavy" },
  { name:"Park Boulevard", sub:"Ring Rd → Harbor Rd", speed:"8 km/h", status:"critical" },
  { name:"Harbor Road", sub:"Central → East Gate", speed:"60 km/h", status:"clear" },
  { name:"Ring Road", sub:"North → South", speed:"42 km/h", status:"moderate" },
  { name:"North Expressway", sub:"Km 0 → Km 24", speed:"85 km/h", status:"moderate" },
];

let recentReports = [
  { type:"Accident", icon:"💥", time:"08:42", loc:"Park Blvd & 3rd Ave", votes:14 },
  { type:"Congestion", icon:"🚗", time:"08:51", loc:"Main St (5th to 7th)", votes:31 },
  { type:"Flooding", icon:"🌊", time:"07:30", loc:"Harbor Rd underpass", votes:8 },
  { type:"Signal Down", icon:"🚦", time:"09:05", loc:"Central Ave & Ring Rd", votes:5 },
];

const STATUS_LABEL = {
  clear:"Clear", moderate:"Moderate", heavy:"Heavy", critical:"Critical", incident:"Incident"
};

const AI_RESPONSES = {
  "default": "I'm pulling the latest data for that — based on current sensor feeds, conditions are shifting. Try asking about a specific street or route for more detail.",
  "route": "Based on real-time conditions, the fastest path to Central Station is via Harbor Road, avoiding Park Boulevard which is currently critical.",
  "accident": "Yes — there's 1 collision reported on Park Blvd & 3rd Ave (logged 08:42) and 1 road closure nearby. Recommend an alternate route via Ring Road.",
  "peak": "Today's next peak hour is estimated at 16:30, with around 1,050 vehicles/hour expected across the monitored network.",
  "park": "Park Boulevard is currently Critical — average speed is 8 km/h between Ring Rd and Harbor Rd. I'd suggest avoiding this segment for the next hour."
};

// ===================== CLOCK =====================

function pad(n){ return n.toString().padStart(2,"0"); }

function updateClock(){
  const now = new Date();
  let h = now.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12; if (h === 0) h = 12;
  const time = `${pad(h)}:${pad(now.getMinutes())} ${ampm}`;
  document.getElementById("clock").textContent = time;
  document.getElementById("heroTime").textContent = time;
  document.getElementById("ping").textContent = (8 + Math.floor(Math.random()*8)) + "ms";
}

// ===================== RENDER ROUTES & SEGMENTS =====================

function renderRoutes(){
  const wrap = document.getElementById("routeList");
  wrap.innerHTML = ROUTES.map(r => `
    <div class="route-row">
      <div class="route-left">
        <svg class="route-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        <div>
          <div class="route-name">${r.name}</div>
          <div class="route-dist">${r.dist}</div>
        </div>
      </div>
      <div class="route-right">
        <div class="route-time">${r.time}</div>
        <div class="route-delta ${r.status==='clear' ? 'ok':'bad'}">${r.delta}</div>
        <div class="pill ${r.status}"><span class="pdot ${r.status}"></span>${STATUS_LABEL[r.status]}</div>
      </div>
    </div>
  `).join("");
}

function renderSegments(){
  const wrap = document.getElementById("segmentList");
  wrap.innerHTML = SEGMENTS.map(s => `
    <div class="segment-row">
      <div>
        <div class="segment-name">${s.name}</div>
        <div class="segment-sub">${s.sub}</div>
      </div>
      <div style="display:flex; align-items:center;">
        <div class="segment-speed">${s.speed}</div>
        <div class="pill ${s.status}"><span class="pdot ${s.status}"></span>${STATUS_LABEL[s.status]}</div>
      </div>
    </div>
  `).join("");
}

// ===================== RECENT REPORTS =====================

function renderRecentReports(){
  const wrap = document.getElementById("recentList");
  document.getElementById("recentCount").textContent = `RECENT REPORTS (${recentReports.length})`;
  wrap.innerHTML = recentReports.slice(0,5).map(r => `
    <div class="recent-row">
      <div class="recent-left">
        <span class="recent-icon">${r.icon}</span>
        <div>
          <span class="recent-type ${r.type.replace(' ','')}">${r.type}</span>
          <span class="recent-time">${r.time}</span>
          <div class="recent-loc">${r.loc}</div>
        </div>
      </div>
      <div class="recent-votes">▲ ${r.votes}</div>
    </div>
  `).join("");
}

// ===================== REPORT FORM =====================

let selectedType = null;

function setupReportForm(){
  const buttons = document.querySelectorAll(".report-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedType = btn.dataset.type;
    });
  });

  document.getElementById("submitReport").addEventListener("click", () => {
    const loc = document.getElementById("locationInput").value.trim();
    if (!selectedType || !loc) {
      alert("Please select an incident type and describe the location.");
      return;
    }
    const icons = { "Congestion":"🚗","Accident":"💥","Roadblock":"🚧","Flooding":"🌊","Pothole":"🕳️","Signal Down":"🚦" };
    const now = new Date();
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    recentReports.unshift({ type:selectedType, icon:icons[selectedType] || "⚠️", time, loc, votes:1 });
    renderRecentReports();

    document.getElementById("locationInput").value = "";
    document.querySelectorAll(".report-btn").forEach(b => b.classList.remove("selected"));
    selectedType = null;
  });
}

// ===================== AI CHAT =====================

function appendMessage(text, isUser){
  const chatArea = document.getElementById("chatArea");
  const now = new Date();
  const time = `${pad(now.getHours() % 12 === 0 ? 12 : now.getHours()%12)}:${pad(now.getMinutes())} ${now.getHours()>=12?'PM':'AM'}`;

  const msg = document.createElement("div");
  msg.className = "chat-msg" + (isUser ? " user" : " bot");

  if (isUser){
    msg.innerHTML = `<div class="chat-bubble">${escapeHTML(text)}<div class="chat-time">${time}</div></div>`;
  } else {
    msg.innerHTML = `
      <div class="chat-avatar">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
      </div>
      <div class="chat-bubble">${escapeHTML(text)}<div class="chat-time">${time}</div></div>
    `;
  }
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function escapeHTML(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function getAIResponse(text){
  const t = text.toLowerCase();
  if (t.includes("route") || t.includes("fastest") || t.includes("central station")) return AI_RESPONSES.route;
  if (t.includes("accident") || t.includes("incident")) return AI_RESPONSES.accident;
  if (t.includes("peak")) return AI_RESPONSES.peak;
  if (t.includes("park blvd") || t.includes("park boulevard")) return AI_RESPONSES.park;
  return AI_RESPONSES.default;
}

function sendChat(text){
  if (!text || !text.trim()) return;
  appendMessage(text, true);
  document.getElementById("chatInput").value = "";
  setTimeout(() => appendMessage(getAIResponse(text), false), 500);
}

function setupChat(){
  document.getElementById("sendBtn").addEventListener("click", () => {
    sendChat(document.getElementById("chatInput").value);
  });
  document.getElementById("chatInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendChat(e.target.value);
  });
  document.querySelectorAll(".suggestion").forEach(s => {
    s.addEventListener("click", () => sendChat(s.textContent));
  });
}

// ===================== INIT =====================

document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 30000);

  renderRoutes();
  renderSegments();
  renderRecentReports();
  setupReportForm();
  setupChat();
});
