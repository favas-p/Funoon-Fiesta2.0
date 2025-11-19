import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { TeamProgramRegister } from "@/components/team-program-register";
import { getCurrentTeam } from "@/lib/auth";
import {
  getPortalStudents,
  getProgramRegistrations,
  getProgramsWithLimits,
  isRegistrationOpen,
  registerCandidate,
  removeProgramRegistration,
} from "@/lib/team-data";

function redirectWithMessage(message: string, type: "error" | "success" = "error") {
  const params = new URLSearchParams({ [type]: message });
  redirect(`/team/program-register?${params.toString()}`);
}

async function registerProgramAction(formData: FormData) {
  "use server";
  const [team, open] = await Promise.all([getCurrentTeam(), isRegistrationOpen()]);
  if (!team) redirect("/team/login");
  if (!open) redirectWithMessage("Registration window is closed.");

  const programId = String(formData.get("programId") ?? "");
  const studentId = String(formData.get("studentId") ?? "");
  if (!programId || !studentId) redirectWithMessage("Program and student are required.");

  const [programs, students, registrations] = await Promise.all([
    getProgramsWithLimits(),
    getPortalStudents(),
    getProgramRegistrations(),
  ]);
  const program = programs.find((item) => item.id === programId);
  if (!program) redirectWithMessage("Program not found.");
  const student = students.find((item) => item.id === studentId);
  if (!student || student.teamId !== team.id) {
    redirectWithMessage("You can only register your team members.");
  }
  const teamEntries = registrations.filter(
    (registration) => registration.programId === programId && registration.teamId === team.id,
  );
  if (teamEntries.length >= program.candidateLimit) {
    redirectWithMessage("Candidate limit reached for this program.");
  }
  if (
    registrations.some(
      (registration) =>
        registration.programId === programId && registration.studentId === studentId,
    )
  ) {
    redirectWithMessage("Student already registered for this program.");
  }

  await registerCandidate({
    programId: program.id,
    programName: program.name,
    studentId: student.id,
    studentName: student.name,
    studentChest: student.chestNumber,
    teamId: team.id,
    teamName: team.teamName,
  });
  revalidatePath("/team/program-register");
  redirectWithMessage("Registration submitted.", "success");
}

async function removeRegistrationAction(formData: FormData) {
  "use server";
  const team = await getCurrentTeam();
  if (!team) redirect("/team/login");
  const registrationId = String(formData.get("registrationId") ?? "");
  const registrations = await getProgramRegistrations();
  const record = registrations.find((registration) => registration.id === registrationId);
  if (!record || record.teamId !== team.id) {
    redirectWithMessage("Cannot remove registrations from other teams.");
  }
  await removeProgramRegistration(registrationId);
  revalidatePath("/team/program-register");
  redirectWithMessage("Registration removed.", "success");
}

export default async function ProgramRegisterPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const team = await getCurrentTeam();
  if (!team) redirect("/team/login");
  const [programs, registrations, students, open] = await Promise.all([
    getProgramsWithLimits(),
    getProgramRegistrations(),
    getPortalStudents(),
    isRegistrationOpen(),
  ]);
  const teamRegistrations = registrations.filter(
    (registration) => registration.teamId === team.id,
  );
  const teamStudents = students.filter((student) => student.teamId === team.id);
  const error = typeof searchParams?.error === "string" ? searchParams.error : undefined;
  const success = typeof searchParams?.success === "string" ? searchParams.success : undefined;

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-3xl font-bold">Program Registration</h1>
        <p className="text-sm text-white/70">
          Registration window is currently{" "}
          <span className={open ? "text-emerald-400" : "text-red-400"}>
            {open ? "OPEN" : "CLOSED"}
          </span>
          .
        </p>
      </div>
      {(error || success) && (
        <Card
          className={`border ${
            error ? "border-red-500/40 bg-red-500/10" : "border-emerald-500/40 bg-emerald-500/10"
          } p-4`}
        >
          <p className="text-sm">{error ?? success}</p>
        </Card>
      )}

      <TeamProgramRegister
        programs={programs}
        teamRegistrations={teamRegistrations}
        teamStudents={teamStudents}
        isOpen={open}
        registerAction={registerProgramAction}
        removeAction={removeRegistrationAction}
      />
    </div>
  );
}

