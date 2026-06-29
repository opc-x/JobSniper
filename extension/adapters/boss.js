/**
 * Boss 直聘 adapter
 * 搜索结果页: https://www.zhipin.com/web/geek/job?query=xxx
 * 职位详情页: https://www.zhipin.com/job_detail/xxx.html
 */
registerAdapter("boss", {
  name: "Boss直聘",

  match(host) {
    return host.includes("zhipin.com");
  },

  isListPage() {
    return location.pathname.includes("/web/geek/job");
  },

  isDetailPage() {
    return location.pathname.includes("/job_detail/");
  },

  extractList() {
    const cards = document.querySelectorAll(".job-card-wrapper, .job-card-body, .search-job-result .job-card-left");
    if (!cards.length) {
      const fallback = document.querySelectorAll("[class*='job-card'], [class*='search-result'] li");
      if (fallback.length) return this._extractFromNodes(fallback);
      return [];
    }
    return this._extractFromNodes(cards);
  },

  _extractFromNodes(nodes) {
    const jobs = [];
    nodes.forEach((card) => {
      try {
        const titleEl = card.querySelector(".job-name, [class*='job-name'], [class*='title'] a");
        const companyEl = card.querySelector(".company-name, [class*='company-name'] a, [class*='company'] .name");
        const salaryEl = card.querySelector(".salary, [class*='salary']");
        const locationEl = card.querySelector(".job-area, [class*='job-area']");
        const link = card.querySelector("a[href*='job_detail']");

        if (!titleEl || !companyEl) return;

        const href = link?.href || "";
        const externalId = href.match(/job_detail\/([^.]+)/)?.[1] || `boss_${Date.now()}_${jobs.length}`;

        jobs.push({
          channel: "boss",
          externalId,
          title: titleEl.textContent.trim(),
          company: companyEl.textContent.trim(),
          salary: salaryEl?.textContent.trim() || "",
          location: locationEl?.textContent.trim() || "",
          description: "",
          url: href,
        });
      } catch (e) {
        console.warn("[JobSniper] 解析卡片失败:", e);
      }
    });
    return jobs;
  },

  extractDetail() {
    const title = document.querySelector(".name h1, .job-banner .name, [class*='job-name']")?.textContent?.trim();
    const company = document.querySelector(".company-info a, [class*='company-name']")?.textContent?.trim();
    const salary = document.querySelector(".salary, [class*='salary']")?.textContent?.trim();
    const jobLocation = document.querySelector(".location-address, [class*='job-location'], [class*='job-area']")?.textContent?.trim();
    const descEl = document.querySelector(".job-sec-text, .job-detail-section .text, [class*='job-detail'] .text, [class*='describe'] .text");
    const description = descEl?.textContent?.trim() || "";

    const href = window.location.href || "";
    const externalId = href.match(/job_detail\/([^.]+)/)?.[1] || `boss_detail_${Date.now()}`;

    if (!title || !company) return null;

    return {
      channel: "boss",
      externalId,
      title,
      company,
      salary: salary || "",
      location: jobLocation || "",
      description,
      url: href,
    };
  },
});
