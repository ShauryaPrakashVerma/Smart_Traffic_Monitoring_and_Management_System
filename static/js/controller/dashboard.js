// const data = [
//   "🚨 Multi-vehicle collision - ACTIVE",
//   "🚑 Emergency vehicle en route",
//   "🚦 Severe congestion detected",
//   "⚡ Signal controller fault",
//   "🚧 Lane closure",
//   "✅ Congestion cleared",
// ];
// const ul = document.getElementById("alerts");
// data.forEach((a) => {
//   let li = document.createElement("li");
//   li.textContent = a;
//   ul.appendChild(li);
// });


// Initialize map

const map = L.map("map").setView([26.8467,80.9462],13);

// OpenStreetMap Tiles

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
    attribution:'© OpenStreetMap contributors'
    }).addTo(map);

setView([26.8467,80.9462],13);