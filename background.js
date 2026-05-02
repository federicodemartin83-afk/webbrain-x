let activeTabId = null;
let activeUrl = null;
let activeTitle = null;
let startTime = Date.now();

async function saveVisit() {
  if (!activeUrl || activeUrl.startsWith("chrome://")) return;
  const now = Date.now();
  const durationSeconds = Math.max(1, Math.round((now - startTime) / 1000));
  const data = await chrome.storage.local.get({ visits: [] });
  data.visits.push({
    url: activeUrl,
    title: activeTitle || activeUrl,
    durationSeconds,
    visitedAt: new Date().toISOString()
  });
  await chrome.storage.local.set({ visits: data.visits.slice(-1000) });
}

chrome.tabs.onActivated.addListener(async activeInfo => {
  await saveVisit();
  activeTabId = activeInfo.tabId;
  const tab = await chrome.tabs.get(activeTabId);
  activeUrl = tab.url;
  activeTitle = tab.title;
  startTime = Date.now();
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.status === "complete") {
    await saveVisit();
    activeUrl = tab.url;
    activeTitle = tab.title;
    startTime = Date.now();
  }
});

chrome.windows.onFocusChanged.addListener(async windowId => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await saveVisit();
    activeUrl = null;
    activeTitle = null;
  }
});
