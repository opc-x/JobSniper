import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { z } from "zod";

const JobPayload = z.object({
  channel: z.enum(["boss", "linkedin", "lagou", "zhaopin", "manual"]),
  externalId: z.string().min(1),
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional().default(""),
  salary: z.string().optional().default(""),
  description: z.string().optional().default(""),
  requirements: z.string().optional().default(""),
  url: z.string().optional(),
});

const BatchPayload = z.object({
  jobs: z.array(JobPayload).min(1).max(200),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobs: incoming } = BatchPayload.parse(body);

    const results = [];
    for (const item of incoming) {
      const id = `${item.channel}:${item.externalId}`;
      await db
        .insert(jobs)
        .values({
          id,
          channel: item.channel,
          externalId: item.externalId,
          title: item.title,
          company: item.company,
          location: item.location || null,
          salary: item.salary || null,
          description: item.description || null,
          requirements: item.requirements || null,
          rawData: item.url ? { url: item.url } : null,
        })
        .onConflictDoUpdate({
          target: jobs.id,
          set: {
            title: item.title,
            company: item.company,
            salary: item.salary || null,
            location: item.location || null,
            description: item.description || null,
            updatedAt: new Date(),
          },
        });
      results.push({ id, status: "ok" });
    }

    return NextResponse.json({ ok: true, inserted: results.length, results });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: e.errors }, { status: 400 });
    }
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
