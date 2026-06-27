"use client";

import { useState, useTransition } from "react";
import { addJob } from "@/lib/actions/jobs";
import { scoreJob } from "@/lib/actions/match";
import { useRouter } from "next/navigation";

const CHANNELS = ["boss", "linkedin", "lagou", "zhaopin", "manual"] as const;

export default function AddJobForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const input = {
      channel: fd.get("channel") as typeof CHANNELS[number],
      externalId: fd.get("externalId") as string || Date.now().toString(),
      title: fd.get("title") as string,
      company: fd.get("company") as string,
      location: fd.get("location") as string,
      salary: fd.get("salary") as string,
      description: fd.get("description") as string,
    };

    startTransition(async () => {
      const { id } = await addJob(input);
      await scoreJob(id);
      setMsg("职位已添加并完成匹配评分 ✓");
      setTimeout(() => router.push(`/jobs/${id}`), 800);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">渠道</label>
          <select name="channel" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
            {CHANNELS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">外部ID（可选）</label>
          <input name="externalId" placeholder="自动生成" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">职位名称 *</label>
        <input name="title" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">公司 *</label>
        <input name="company" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">地点</label>
          <input name="location" placeholder="北京" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">薪资</label>
          <input name="salary" placeholder="20-30k" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">JD / 职位描述</label>
        <textarea name="description" rows={6} placeholder="粘贴职位描述..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" />
      </div>

      {msg && <p className="text-green-600 text-sm">{msg}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? "添加并评分中..." : "添加职位 + 自动评分"}
      </button>
    </form>
  );
}
