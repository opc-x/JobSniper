import { getJobs } from "@/lib/actions/jobs";
import { getProfile } from "@/lib/actions/profile";
import JobCard from "@/components/jobs/JobCard";
import Link from "next/link";

export default async function HomePage() {
  const [jobs, profile] = await Promise.all([getJobs(), getProfile()]);

  const topJobs = jobs.filter((j) => (j.score ?? 0) >= 80).slice(0, 5);
  const recentJobs = jobs.slice(0, 10);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">JobSniper</h1>
          <p className="text-sm text-gray-500">
            {profile?.targetTitle ? `目标：${profile.targetTitle}` : "设置你的求职目标"}
          </p>
        </div>
        <Link
          href="/profile"
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          我的画像
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "总职位", value: jobs.length },
          { label: "高匹配", value: topJobs.length },
          { label: "已投递", value: jobs.filter((j) => j.status === "applied").length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 高匹配 */}
      {topJobs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">🎯 高匹配职位</h2>
            <Link href="/jobs?filter=top" className="text-xs text-blue-600">
              查看全部
            </Link>
          </div>
          <div className="space-y-2">
            {topJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}

      {/* 最新 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">最新职位</h2>
          <Link href="/jobs" className="text-xs text-blue-600">
            查看全部
          </Link>
        </div>
        {recentJobs.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            还没有职位，去渠道页面添加
          </div>
        ) : (
          <div className="space-y-2">
            {recentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
