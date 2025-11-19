import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TeamStudentList } from "@/components/team-student-list";
import { getCurrentTeam } from "@/lib/auth";
import {
  deletePortalStudent,
  getPortalStudents,
  upsertPortalStudent,
} from "@/lib/team-data";

function redirectWithMessage(message: string, type: "error" | "success" = "error") {
  const params = new URLSearchParams({ [type]: message });
  redirect(`/team/register-students?${params.toString()}`);
}

async function createStudentAction(formData: FormData) {
  "use server";
  const team = await getCurrentTeam();
  if (!team) redirect("/team/login");

  const name = String(formData.get("name") ?? "").trim();
  const chestNumber = String(formData.get("chestNumber") ?? "").trim().toUpperCase();
  if (!name || !chestNumber) {
    redirectWithMessage("Name and chest number are required.");
  }
  const students = await getPortalStudents();
  if (students.some((student) => student.chestNumber.toUpperCase() === chestNumber)) {
    redirectWithMessage("Chest number already registered.");
  }
  if (
    students.some(
      (student) =>
        student.teamId === team.id && student.name.toLowerCase() === name.toLowerCase(),
    )
  ) {
    redirectWithMessage("Student name already exists for this team.");
  }
  try {
    await upsertPortalStudent({
      name,
      chestNumber,
      teamId: team.id,
    });
  } catch (error) {
    redirectWithMessage((error as Error).message);
  }
  revalidatePath("/team/register-students");
  redirectWithMessage("Student added successfully.", "success");
}

async function updateStudentAction(formData: FormData) {
  "use server";
  const team = await getCurrentTeam();
  if (!team) redirect("/team/login");
  const studentId = String(formData.get("studentId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const chestNumber = String(formData.get("chestNumber") ?? "").trim().toUpperCase();
  if (!studentId) redirectWithMessage("Missing student ID.");

  const students = await getPortalStudents();
  const current = students.find((student) => student.id === studentId);
  if (!current || current.teamId !== team.id) {
    redirectWithMessage("You can only edit your own students.");
  }
  if (students.some((student) => student.id !== studentId && student.chestNumber === chestNumber)) {
    redirectWithMessage("Chest number already registered.");
  }
  try {
    await upsertPortalStudent({
      id: studentId,
      name,
      chestNumber,
      teamId: team.id,
    });
  } catch (error) {
    redirectWithMessage((error as Error).message);
  }
  revalidatePath("/team/register-students");
  redirectWithMessage("Student updated.", "success");
}

async function deleteStudentAction(formData: FormData) {
  "use server";
  const team = await getCurrentTeam();
  if (!team) redirect("/team/login");
  const studentId = String(formData.get("studentId") ?? "");
  const students = await getPortalStudents();
  const current = students.find((student) => student.id === studentId);
  if (!current || current.teamId !== team.id) {
    redirectWithMessage("Cannot delete student outside your team.");
  }
  await deletePortalStudent(studentId);
  revalidatePath("/team/register-students");
  redirectWithMessage("Student deleted.", "success");
}

export default async function RegisterStudentsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const team = await getCurrentTeam();
  if (!team) {
    redirect("/team/login");
  }
  const students = await getPortalStudents();
  const teamStudents = students.filter((student) => student.teamId === team.id);
  const error = typeof searchParams?.error === "string" ? searchParams?.error : undefined;
  const success = typeof searchParams?.success === "string" ? searchParams?.success : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Register Students</h1>
        <p className="text-sm text-white/70">Only your team members can be managed here.</p>
      </div>
      {(error || success) && (
        <p className={`text-sm ${error ? "text-red-400" : "text-emerald-400"}`}>
          {error ?? success}
        </p>
      )}

      <Card className="border-white/10 bg-white/5 p-6 text-white">
        <CardTitle>Add student</CardTitle>
        <CardDescription className="mt-2 text-white/70">
          Chest numbers must be unique across the festival.
        </CardDescription>
        <form action={createStudentAction} className="mt-4 grid gap-4 md:grid-cols-3">
          <Input name="name" placeholder="Student name" required />
          <Input name="chestNumber" placeholder="Chest number" required />
          <Button type="submit">Add student</Button>
        </form>
      </Card>

      <TeamStudentList
      students={teamStudents}
      updateAction={updateStudentAction}
      deleteAction={deleteStudentAction}
      />
    </div>
  );
}

