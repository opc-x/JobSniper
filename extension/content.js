/**
 * Content script — 注入招聘网站页面，响应 popup 的消息
 */
(() => {
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === "ping") {
      const adapter = getAdapter();
      sendResponse({
        ok: true,
        channel: adapter?.channel || null,
        channelName: adapter?.name || null,
        isListPage: adapter?.isListPage() || false,
        isDetailPage: adapter?.isDetailPage() || false,
      });
      return;
    }

    if (msg.action === "extract") {
      const adapter = getAdapter();
      if (!adapter) {
        sendResponse({ ok: false, error: "当前页面不支持" });
        return;
      }

      let jobs = [];
      if (adapter.isListPage()) {
        jobs = adapter.extractList();
      } else if (adapter.isDetailPage()) {
        const job = adapter.extractDetail();
        if (job) jobs = [job];
      }

      sendResponse({ ok: true, jobs, channel: adapter.channel });
      return;
    }
  });
})();
