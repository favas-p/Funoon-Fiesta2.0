import { ResultManager } from "@/components/result-manager";
import {
  getJuries,
  getPendingResults,
  getPrograms,
  getStudents,
  getTeams,
} from "@/lib/data";
import { approveResult, rejectResult } from "@/lib/result-service";
import { revalidatePath } from "next/cache";

async function approveResultAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  await approveResult(id);
  revalidatePath("/admin/pending-results");
}

async function rejectResultAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  await rejectResult(id);
  revalidatePath("/admin/pending-results");
}

export default async function PendingResultsPage() {
  const [pending, programs, juries, students, teams] = await Promise.all([
    getPendingResults(),
    getPrograms(),
    getJuries(),
    getStudents(),
    getTeams(),
  ]);

  return (
    <div className="space-y-8">
      <ResultManager
        results={pending}
        programs={programs}
        juries={juries}
        students={students}
        teams={teams}
        deleteAction={rejectResultAction}
        approveAction={approveResultAction}
        rejectAction={rejectResultAction}
        isPending={true}
      />
    </div>
  );
}

