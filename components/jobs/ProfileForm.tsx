"use client";

import { useState, useTransition } from "react";
import { upsertProfile } from "@/lib/actions/profile";

type Profile = {
  targetTitle?: string | null;
  targetSalaryMin?: number | null;
  targetSalaryMax?: number | null;
  targetLocations?: string[] | null;
  skills?: string[] | null;
  yearsOfExp?: number | null;
  resumeSummary?: string | null;
};

export default function ProfileForm({ initialData }: { initialData: Profile | null }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const data = {
      targetTitle: fd.get("targetTitle") as string,
      targetSalaryMin: Number(fd.get("targetSalaryMin")) || undefined,
      targetSalaryMax: Number(fd.get("targetSalaryMax")) || undefined,
      targetLocations: (fd.get("targetLocations") as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      skills: (fd.get("skills") as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      yearsOfExp: Number(fd.get("yearsOfExp")) || undefined,
      resumeSummary: fd.get("resumeSummary") as string,
    };

    startTransition(async () => {
      await upsertProfile(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">目标职位</label>
        <input
          name="targetTitle"
          defaultValue={initialData?.targetTitle ?? ""}
          placeholder="后端架构师"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">薪资下限（K）</label>
          <input
            name="targetSalaryMin"
            type="number"
            defaultValue={initialData?.targetSalaryMin ?? ""}
            placeholder="30"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">薪资上限（K）</label>
          <input
            name="targetSalaryMax"
            type="number"
            defaultValue={initialData?.targetSalaryMax ?? ""}
            placeholder="50"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">目标城市（逗号分隔）</label>
        <input
          name="targetLocations"
          defaultValue={(initialData?.targetLocations ?? []).join(", ")}
          placeholder="北京, 上海, 深圳"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">核心技能（逗号分隔）</label>
        <input
          name="skills"
          defaultValue={(initialData?.skills ?? []).join(", ")}
          placeholder="Go, Kubernetes, PostgreSQL, Redis"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">工作年限</label>
        <input
          name="yearsOfExp"
          type="number"
          defaultValue={initialData?.yearsOfExp ?? ""}
          placeholder="5"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">简历摘要（用于AI匹配）</label>
        <textarea
          name="resumeSummary"
          defaultValue={initialData?.resumeSummary ?? ""}
          rows={4}
          placeholder="一句话介绍你自己..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {saved ? "已保存 ✓" : isPending ? "保存中..." : "保存画像"}
      </button>
    </form>
  );
}
