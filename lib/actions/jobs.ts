"use server";

import { db } from "@/lib/db";
import { jobs, matches } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const AddJobSchema = z.object({
  channel: z.enum(["boss", "linkedin", "lagou", "zhaopin", "manual"]),
  externalId: z.string().min(1),
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  salary: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
});

// ─── Actions ──────────────────────────────────────────────────────────────────

/**
 * 新增或更新一条职位
 * anchor: POST /jobs → addJob
 */
export async function addJob(input: z.infer<typeof AddJobSchema>) {
  const data = AddJobSchema.parse(input);
  const id = `${data.channel}:${data.externalId}`;

  await db
    .insert(jobs)
    .values({ ...data, id })
    .onConflictDoUpdate({
      target: jobs.id,
      set: {
        title: data.title,
        company: data.company,
        salary: data.salary,
        description: data.description,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/jobs");
  return { ok: true, id };
}

/**
 * 获取职位列表（含匹配分数）
 * anchor: GET /jobs → getJobs
 */
export async function getJobs() {
  return db
    .select({
      id: jobs.id,
      title: jobs.title,
      company: jobs.company,
      location: jobs.location,
      salary: jobs.salary,
      channel: jobs.channel,
      score: matches.score,
      status: matches.status,
      createdAt: jobs.createdAt,
    })
    .from(jobs)
    .leftJoin(matches, eq(jobs.id, matches.jobId))
    .orderBy(desc(matches.score), desc(jobs.createdAt));
}

/**
 * 获取单条职位详情
 * anchor: GET /jobs/:id → getJobById
 */
export async function getJobById(id: string) {
  const [job] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  const [match] = await db
    .select()
    .from(matches)
    .where(eq(matches.jobId, id))
    .limit(1);
  return { job, match };
}

/**
 * 更新职位状态（投递/面试/Offer等）
 * anchor: PATCH /jobs/:id/status → updateJobStatus
 */
export async function updateJobStatus(
  jobId: string,
  status: "new" | "viewed" | "applied" | "interview" | "offer" | "rejected" | "ignored",
  notes?: string
) {
  await db
    .update(matches)
    .set({ status, notes, updatedAt: new Date() })
    .where(eq(matches.jobId, jobId));

  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
  return { ok: true };
}
