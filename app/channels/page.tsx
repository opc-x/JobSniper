import AddJobForm from "@/components/jobs/AddJobForm";

export default function ChannelsPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-2">渠道接入</h1>
      <p className="text-sm text-gray-500 mb-6">
        手动录入职位，或从各平台粘贴JD
      </p>
      <AddJobForm />
    </div>
  );
}
