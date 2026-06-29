/**
 * 渠道 adapter 基类 — 每个招聘网站实现一个子类
 * 新增渠道只需：1) 新建 adapters/xxx.js  2) manifest 加 matches  3) 注册到 ADAPTERS
 */

const ADAPTERS = {};

function registerAdapter(channel, adapter) {
  ADAPTERS[channel] = adapter;
}

function getAdapter() {
  const host = location.hostname;
  for (const [channel, adapter] of Object.entries(ADAPTERS)) {
    if (adapter.match(host)) return { channel, ...adapter };
  }
  return null;
}
