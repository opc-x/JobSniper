/**
 * Service Worker — 负责转发数据到 JobSniper 后端
 */

const DEFAULT_API_BASE = "http://localhost:3000";

async function getApiBase() {
  const { apiBase } = await chrome.storage.sync.get("apiBase");
  return apiBase || DEFAULT_API_BASE;
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === "submit") {
    handleSubmit(msg.jobs)
      .then(sendResponse)
      .catch((e) => sendResponse({ ok: false, error: e.message }));
    return true; // async
  }

  if (msg.action === "setApiBase") {
    chrome.storage.sync.set({ apiBase: msg.apiBase });
    sendResponse({ ok: true });
    return;
  }

  if (msg.action === "getApiBase") {
    getApiBase().then((base) => sendResponse({ ok: true, apiBase: base }));
    return true;
  }
});

async function handleSubmit(jobs) {
  const apiBase = await getApiBase();
  const url = `${apiBase}/api/jobs`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobs }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json();
}
