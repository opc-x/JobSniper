import { getJobById } from "@/lib/actions/jobs";
import { scoreBg } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import StatusUpdater from "@/components/jobs/StatusUpdater";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { job, match } = await getJobById(id);

  if (!job) notFound();

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <Link href="/jobs" className="text-sm text-blue-600">
        ← 返回
      </Link>

      {/* 基本信息 */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-lg font-bold text-gray-900">{job.title}</h1>
          {match && (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold shrink-0 ${scoreBg(match.score)}`}>
              {match.score}分
            </span>
          )}
        </div>
        <p className="text-gray-700 font-medium">{job.company}</p>
        <div className="flex gap-3 text-sm text-gray-500">
          {job.location && <span>📍 {job.location}</span>}
          {job.salary && <span>💰 {job.salary}</span>}
          <span className="capitalize">📡 {job.channel}</span>
        </div>
      </div>

      {/* 匹配详情 */}
      {match?.scoreBreakdown && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold mb-3">匹配分析</h2>
          <div className="space-y-2">
            {[
              { label: "职位匹配", value: match.scoreBreakdown.titleMatch, weight: "30%" },
              { label: "薪资匹配", value: match.scoreBreakdown.salaryMatch, weight: "25%" },
              { label: "地点匹配", value: match.scoreBreakdown.locationMatch, weight: "20%" },
              { label: "技能匹配", value: match.scoreBreakdown.skillMatch, weight: "25%" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-20">{item.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8 text-right">{item.value}</span>
                <span className="text-xs text-gray-400 w-8">{item.weight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 状态更新 */}
      <StatusUpdater jobId={job.id} currentStatus={match?.status ?? "new"} />

      {/* 职位描述 */}
      {job.description && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold mb-3">职位描述</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {job.description}
          </p>
        </div>
      )}
    </div>
  );
}
