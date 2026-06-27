"use client";

import { useTransition } from "react";
import { batchScore } from "@/lib/actions/match";
import { useRouter } from "next/navigation";

export default function BatchScoreButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await batchScore();
          router.refresh();
        })
      }
      disabled={isPending}
      className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium disabled:opacity-50"
    >
      {isPending ? "评分中..." : "重新评分"}
    </button>
  );
}
