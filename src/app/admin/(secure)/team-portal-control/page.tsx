import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPortalStudents, getPortalTeams, getProgramRegistrations, getRegistrationSchedule, savePortalTeam, deletePortalTeam, updateRegistrationSchedule } from "@/lib/team-data";

function sanitizeColor(value: string) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(value) ? value : "#0ea5e9";
}

async function upsertTeamAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? `team-${randomUUID().slice(0, 6)}`);
  const teamName = String(formData.get("teamName") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const leaderName = String(formData.get("leaderName") ?? "").trim();
  const themeColor = sanitizeColor(String(formData.get("themeColor") ?? "#0ea5e9"));
  if (!teamName || !password || !leaderName) {
    throw new Error("Team name, password, and leader name are required.");
  }
  await savePortalTeam({
    id,
    teamName,
    password,
    leaderName,
    themeColor,
  });
  revalidatePath("/admin/team-portal-control");
}

async function deleteTeamAction(formData: FormData) {
  "use server";
  const teamId = String(formData.get("teamId") ?? "");
  if (!teamId) {
    throw new Error("Team ID missing");
  }
  await deletePortalTeam(teamId);
  revalidatePath("/admin/team-portal-control");
}

async function updateScheduleAction(formData: FormData) {
  "use server";
  const start = String(formData.get("startDateTime") ?? "");
  const end = String(formData.get("endDateTime") ?? "");
  if (!start || !end) {
    throw new Error("Start and end date/time are required.");
  }
  await updateRegistrationSchedule({
    startDateTime: new Date(start).toISOString(),
    endDateTime: new Date(end).toISOString(),
  });
  revalidatePath("/admin/team-portal-control");
}

export default async function TeamPortalControlPage() {
  const [teams, students, registrations, schedule] = await Promise.all([
    getPortalTeams(),
    getPortalStudents(),
    getProgramRegistrations(),
    getRegistrationSchedule(),
  ]);

  const stats = teams.map((team) => ({
    team,
    studentCount: students.filter((student) => student.teamId === team.id).length,
    registrationCount: registrations.filter((registration) => registration.teamId === team.id).length,
  }));

  return (
    <div className="space-y-10 text-white">
      <div>
        <h1 className="text-3xl font-bold">Team Portal Control</h1>
        <p className="text-sm text-white/70">
          Manage team credentials, registration schedule, and monitor per-team activity.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/5 p-6">
          <CardTitle>Create Team</CardTitle>
          <CardDescription className="mt-2 text-white/70">
            Provision a team account with portal access.
          </CardDescription>
          <form action={upsertTeamAction} className="mt-4 space-y-3">
            <Input name="teamName" placeholder="Team name" required />
            <Input name="leaderName" placeholder="Leader name" required />
            <Input name="password" type="text" placeholder="Password" required />
            <Input name="themeColor" type="text" placeholder="#0ea5e9" />
            <Button type="submit" className="w-full">
              Create team
            </Button>
          </form>
        </Card>

        <Card className="border-white/10 bg-white/5 p-6">
          <CardTitle>Registration Schedule</CardTitle>
          <CardDescription className="mt-2 text-white/70">
            Only allow program registration between these timestamps.
          </CardDescription>
          <form action={updateScheduleAction} className="mt-4 grid gap-3">
            <label className="text-sm text-white/60">
              Start date &amp; time
              <Input
                type="datetime-local"
                name="startDateTime"
                className="mt-1"
                defaultValue={schedule.startDateTime.slice(0, 16)}
                required
              />
            </label>
            <label className="text-sm text-white/60">
              End date &amp; time
              <Input
                type="datetime-local"
                name="endDateTime"
                className="mt-1"
                defaultValue={schedule.endDateTime.slice(0, 16)}
                required
              />
            </label>
            <Button type="submit" className="mt-2">
              Update schedule
            </Button>
          </form>
        </Card>
      </section>

      <section className="space-y-4">
        <CardTitle>Existing Teams</CardTitle>
        {teams.length === 0 ? (
          <p className="text-sm text-white/60">No teams yet.</p>
        ) : (
          <div className="space-y-4">
            {stats.map(({ team, studentCount, registrationCount }) => (
              <Card key={team.id} className="border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/50">ID: {team.id}</p>
                    <CardTitle>{team.teamName}</CardTitle>
                    <CardDescription className="text-white/70">
                      Leader: {team.leaderName}
                    </CardDescription>
                  </div>
                  <div className="text-right text-sm text-white/70">
                    <p>Students: {studentCount}</p>
                    <p>Registrations: {registrationCount}</p>
                  </div>
                </div>
                <form action={upsertTeamAction} className="mt-4 grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={team.id} />
                  <Input name="teamName" defaultValue={team.teamName} placeholder="Team name" />
                  <Input name="leaderName" defaultValue={team.leaderName} placeholder="Leader" />
                  <Input name="password" defaultValue={team.password} placeholder="Password" />
                  <Input name="themeColor" defaultValue={team.themeColor} placeholder="#0ea5e9" />
                  <div className="md:col-span-2">
                    <Button type="submit" className="w-full">
                      Save changes
                    </Button>
                  </div>
                </form>
                <form action={deleteTeamAction} className="mt-3 text-right">
                  <input type="hidden" name="teamId" value={team.id} />
                  <Button type="submit" variant="danger">
                    Delete team
                  </Button>
                </form>

                {studentCount > 0 && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                    <p className="mb-2 font-semibold text-white">Students</p>
                    <ul className="space-y-1">
                      {students
                        .filter((student) => student.teamId === team.id)
                        .map((student) => (
                          <li key={student.id}>
                            {student.name} · {student.chestNumber}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {registrationCount > 0 && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                    <p className="mb-2 font-semibold text-white">Program registrations</p>
                    <ul className="space-y-1">
                      {registrations
                        .filter((registration) => registration.teamId === team.id)
                        .map((registration) => (
                          <li key={registration.id}>
                            {registration.programName} · {registration.studentName} ({registration.studentChest})
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

