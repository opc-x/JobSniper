"use client";

import { useState, useTransition } from "react";
import { updateJobStatus } from "@/lib/actions/jobs";
import { cn } from "@/lib/utils";

const STATUSES = [
  { value: "new", label: "新" },
  { value: "viewed", label: "已看" },
  { value: "applied", label: "已投" },
  { value: "interview", label: "面试" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "拒绝" },
  { value: "ignored", label: "忽略" },
] as const;

type Status = (typeof STATUSES)[number]["value"];

export default function StatusUpdater({
  jobId,
  currentStatus,
}: {
  jobId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState<Status>(currentStatus as Status);
  const [isPending, startTransition] = useTransition();

  function handleChange(newStatus: Status) {
    setStatus(newStatus);
    startTransition(async () => {
      await updateJobStatus(jobId, newStatus);
    });
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h2 className="text-sm font-semibold mb-3 text-gray-700">求职进度</h2>
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => handleChange(s.value)}
            disabled={isPending}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              status === s.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
