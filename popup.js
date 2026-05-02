async function refresh(){
  const data = await chrome.storage.local.get({ visits: [] });
  document.getElementById("out").textContent = JSON.stringify(data.visits.slice(-10), null, 2);
}
document.getElementById("export").onclick = async () => {
  const data = await chrome.storage.local.get({ visits: [] });
  const blob = new Blob([JSON.stringify({ webbrainxTracker: true, visits: data.visits }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  chrome.downloads ? chrome.downloads.download({ url, filename: "webbrainx_visits.json" }) : window.open(url);
};
document.getElementById("clear").onclick = async () => { await chrome.storage.local.set({ visits: [] }); refresh(); };
refresh();
