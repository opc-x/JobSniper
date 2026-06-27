"use server";

import { db } from "@/lib/db";
import { myProfile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProfileSchema = z.object({
  targetTitle: z.string().optional(),
  targetSalaryMin: z.number().optional(),
  targetSalaryMax: z.number().optional(),
  targetLocations: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  yearsOfExp: z.number().optional(),
  resumeSummary: z.string().optional(),
});

/**
 * 保存/更新求职画像
 * anchor: POST /profile → upsertProfile
 */
export async function upsertProfile(input: z.infer<typeof ProfileSchema>) {
  const data = ProfileSchema.parse(input);

  await db
    .insert(myProfile)
    .values({ id: 1, ...data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: myProfile.id,
      set: { ...data, updatedAt: new Date() },
    });

  revalidatePath("/profile");
  return { ok: true };
}

/**
 * 读取求职画像
 * anchor: GET /profile → getProfile
 */
export async function getProfile() {
  const [profile] = await db
    .select()
    .from(myProfile)
    .where(eq(myProfile.id, 1))
    .limit(1);
  return profile ?? null;
}
