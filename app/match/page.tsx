import { getJobs } from "@/lib/actions/jobs";
import { batchScore } from "@/lib/actions/match";
import { scoreBg } from "@/lib/utils";
import Link from "next/link";
import BatchScoreButton from "@/components/jobs/BatchScoreButton";

export default async function MatchPage() {
  const jobs = await getJobs();
  const sorted = [...jobs].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const tiers = {
    high: sorted.filter((j) => (j.score ?? 0) >= 80),
    mid: sorted.filter((j) => (j.score ?? 0) >= 60 && (j.score ?? 0) < 80),
    low: sorted.filter((j) => (j.score ?? 0) < 60),
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">匹配分析</h1>
        <BatchScoreButton />
      </div>

      {sorted.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-10">
          先去渠道页录入职位，再点「重新评分」
        </p>
      )}

      {[
        { label: "🎯 高匹配 ≥80", jobs: tiers.high, color: "text-green-700" },
        { label: "⚡ 中匹配 60-79", jobs: tiers.mid, color: "text-yellow-700" },
        { label: "📌 低匹配 <60", jobs: tiers.low, color: "text-gray-500" },
      ].map(
        ({ label, jobs, color }) =>
          jobs.length > 0 && (
            <section key={label}>
              <h2 className={`font-semibold text-sm mb-2 ${color}`}>
                {label}（{jobs.length}）
              </h2>
              <div className="space-y-2">
                {jobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm flex items-center gap-3">
                      <span
                        className={`text-sm font-bold w-10 text-center px-1 py-0.5 rounded-full ${scoreBg(job.score ?? 0)}`}
                      >
                        {job.score ?? "—"}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{job.title}</p>
                        <p className="text-xs text-gray-500 truncate">{job.company}</p>
                      </div>
                      {job.salary && (
                        <span className="ml-auto text-xs text-gray-400 shrink-0">
                          {job.salary}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
      )}
    </div>
  );
}
