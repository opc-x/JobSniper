const btnSnipe = document.getElementById("btnSnipe");
const btnSubmit = document.getElementById("btnSubmit");
const statusBar = document.getElementById("statusBar");
const statusText = document.getElementById("statusText");
const result = document.getElementById("result");
const resultContent = document.getElementById("resultContent");
const apiBaseInput = document.getElementById("apiBase");

let extractedJobs = [];

// ── 初始化 ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  // 加载 API 地址设置
  chrome.runtime.sendMessage({ action: "getApiBase" }, (res) => {
    if (res?.apiBase) apiBaseInput.value = res.apiBase;
  });

  // 检测当前页面
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    setStatus("unsupported", "无法访问当前标签页");
    return;
  }

  try {
    chrome.tabs.sendMessage(tab.id, { action: "ping" }, (res) => {
      if (chrome.runtime.lastError || !res?.ok) {
        setStatus("unsupported", "当前页面不是支持的招聘网站");
        return;
      }
      if (!res.channel) {
        setStatus("unsupported", "当前页面不是支持的招聘网站");
        return;
      }
      const pageType = res.isListPage ? "搜索列表页" : res.isDetailPage ? "职位详情页" : "未知页面";
      setStatus("ready", `${res.channelName} · ${pageType}`);
      btnSnipe.disabled = false;
    });
  } catch {
    setStatus("unsupported", "当前页面不是支持的招聘网站");
  }
});

// ── 狙击按钮 ──────────────────────────────────────────────────
btnSnipe.addEventListener("click", async () => {
  btnSnipe.disabled = true;
  btnSnipe.textContent = "⏳ 提取中...";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "extract" }, (res) => {
    if (!res?.ok || !res.jobs?.length) {
      showResult("error", "未提取到职位数据，请确认页面已加载完成");
      btnSnipe.disabled = false;
      btnSnipe.textContent = "🎯 狙击当前页面";
      return;
    }

    extractedJobs = res.jobs;
    showResult("success", `
      <div class="job-count">${res.jobs.length}</div>
      <div style="color:#999;margin-top:4px">条职位已提取</div>
      <div style="margin-top:8px;font-size:12px;color:#999">
        ${res.jobs.slice(0, 3).map((j) => `• ${j.title} @ ${j.company}`).join("<br>")}
        ${res.jobs.length > 3 ? `<br>...还有 ${res.jobs.length - 3} 条` : ""}
      </div>
    `);

    btnSnipe.textContent = "🎯 重新提取";
    btnSnipe.disabled = false;
    btnSubmit.style.display = "block";
    btnSubmit.disabled = false;
  });
});

// ── 提交按钮 ──────────────────────────────────────────────────
btnSubmit.addEventListener("click", () => {
  btnSubmit.disabled = true;
  btnSubmit.textContent = "📤 发送中...";

  chrome.runtime.sendMessage({ action: "submit", jobs: extractedJobs }, (res) => {
    if (res?.ok) {
      const count = res.inserted ?? res.results?.length ?? extractedJobs.length;
      showResult("success", `✅ 已发送 ${count} 条职位到 JobSniper`);
      btnSubmit.textContent = "📤 已发送";
    } else {
      showResult("error", `❌ 发送失败：${res?.error || "未知错误"}`);
      btnSubmit.disabled = false;
      btnSubmit.textContent = "📤 重试发送";
    }
  });
});

// ── 设置 ──────────────────────────────────────────────────
apiBaseInput.addEventListener("change", () => {
  const val = apiBaseInput.value.trim().replace(/\/$/, "");
  if (val) {
    chrome.runtime.sendMessage({ action: "setApiBase", apiBase: val });
  }
});

// ── 工具函数 ──────────────────────────────────────────────────
function setStatus(type, text) {
  statusBar.className = `status-bar ${type}`;
  statusText.textContent = text;
}

function showResult(type, html) {
  result.className = `result show ${type}`;
  resultContent.innerHTML = html;
}
