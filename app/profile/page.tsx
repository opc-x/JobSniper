import { getProfile } from "@/lib/actions/profile";
import ProfileForm from "@/components/jobs/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-6">我的求职画像</h1>
      <ProfileForm initialData={profile} />
    </div>
  );
}
