"use server";

import { db } from "@/lib/db";
import { jobs, matches, myProfile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { nanoid } from "@/lib/utils";

// ─── Actions ──────────────────────────────────────────────────────────────────

/**
 * 对单条职位跑匹配评分
 * anchor: POST /match/:jobId → scoreJob
 */
export async function scoreJob(jobId: string) {
  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
  const [profile] = await db.select().from(myProfile).where(eq(myProfile.id, 1)).limit(1);

  if (!job || !profile) throw new Error("Job or profile not found");

  // ── 规则匹配（无需LLM，快） ───────────────────────────────────────────────
  const scoreBreakdown = {
    titleMatch: calcTitleMatch(job.title, profile.targetTitle ?? ""),
    salaryMatch: calcSalaryMatch(job.salary ?? "", profile.targetSalaryMin, profile.targetSalaryMax),
    locationMatch: calcLocationMatch(job.location ?? "", profile.targetLocations ?? []),
    skillMatch: calcSkillMatch(job.description ?? "", profile.skills ?? []),
  };

  const score = Math.round(
    scoreBreakdown.titleMatch * 0.3 +
    scoreBreakdown.salaryMatch * 0.25 +
    scoreBreakdown.locationMatch * 0.2 +
    scoreBreakdown.skillMatch * 0.25
  );

  await db
    .insert(matches)
    .values({
      id: nanoid(),
      jobId,
      score,
      scoreBreakdown,
      status: "new",
    })
    .onConflictDoUpdate({
      target: matches.jobId,
      set: { score, scoreBreakdown, updatedAt: new Date() },
    });

  revalidatePath("/jobs");
  return { score, scoreBreakdown };
}

/**
 * 批量对所有未评分职位跑匹配
 * anchor: POST /match/batch → batchScore
 */
export async function batchScore() {
  const allJobs = await db.select({ id: jobs.id }).from(jobs);
  const results = await Promise.allSettled(
    allJobs.map((j) => scoreJob(j.id))
  );
  return results;
}

// ─── 纯函数评分逻辑（后期可换LLM） ────────────────────────────────────────────

function calcTitleMatch(jobTitle: string, targetTitle: string): number {
  if (!targetTitle) return 50;
  const jt = jobTitle.toLowerCase();
  const tt = targetTitle.toLowerCase();
  if (jt.includes(tt) || tt.includes(jt)) return 100;
  const jtWords = jt.split(/\s+/);
  const ttWords = tt.split(/\s+/);
  const overlap = jtWords.filter((w) => ttWords.includes(w)).length;
  return Math.min(100, (overlap / ttWords.length) * 100);
}

function calcSalaryMatch(
  salary: string,
  min?: number | null,
  max?: number | null
): number {
  if (!min || !max || !salary) return 50;
  const nums = salary.match(/\d+/g);
  if (!nums || nums.length < 2) return 50;
  const [lo, hi] = nums.map(Number);
  const midJob = (lo + hi) / 2;
  const midTarget = (min + max) / 2;
  const diff = Math.abs(midJob - midTarget) / midTarget;
  return Math.max(0, Math.round((1 - diff) * 100));
}

function calcLocationMatch(location: string, targets: string[]): number {
  if (!targets.length) return 50;
  return targets.some((t) =>
    location.toLowerCase().includes(t.toLowerCase())
  )
    ? 100
    : 0;
}

function calcSkillMatch(description: string, skills: string[]): number {
  if (!skills.length) return 50;
  const desc = description.toLowerCase();
  const matched = skills.filter((s) => desc.includes(s.toLowerCase())).length;
  return Math.round((matched / skills.length) * 100);
}
