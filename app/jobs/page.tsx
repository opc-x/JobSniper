import { getJobs } from "@/lib/actions/jobs";
import JobCard from "@/components/jobs/JobCard";

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4">职位列表</h1>
      <div className="space-y-2">
        {jobs.length === 0 ? (
          <p className="text-center text-gray-400 py-10">暂无职位</p>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
}
