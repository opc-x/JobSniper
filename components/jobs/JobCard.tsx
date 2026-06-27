import Link from "next/link";
import { scoreBg } from "@/lib/utils";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  salary: string | null;
  channel: string;
  score: number | null;
  status: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  new: "新",
  viewed: "已看",
  applied: "已投",
  interview: "面试",
  offer: "Offer",
  rejected: "拒绝",
  ignored: "忽略",
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
            <p className="text-sm text-gray-600 truncate">{job.company}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {job.score != null && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${scoreBg(job.score)}`}>
                {job.score}分
              </span>
            )}
            {job.status && job.status !== "new" && (
              <span className="text-xs text-gray-400">
                {STATUS_LABELS[job.status] ?? job.status}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-2 text-xs text-gray-500">
          {job.location && <span>📍 {job.location}</span>}
          {job.salary && <span>💰 {job.salary}</span>}
          <span className="capitalize">📡 {job.channel}</span>
        </div>
      </div>
    </Link>
  );
}
