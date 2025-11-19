import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getCurrentTeam } from "@/lib/auth";
import { getPortalStudents, getProgramRegistrations } from "@/lib/team-data";

export default async function TeamDashboardPage() {
  const team = await getCurrentTeam();
  if (!team) {
    redirect("/team/login");
  }
  const [students, registrations] = await Promise.all([
    getPortalStudents(),
    getProgramRegistrations(),
  ]);
  const teamStudents = students.filter((student) => student.team === team.teamName);
  const teamRegistrations = registrations.filter((registration) => registration.team === team.teamName);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-white/50">Welcome back</p>
        <h1 className="text-3xl font-bold text-white">{team.teamName}</h1>
        <p className="text-sm text-white/70">Lead by {team.leaderName}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-white/10 bg-white/5 p-5 text-white">
          <CardTitle>Team Members</CardTitle>
          <CardDescription className="mt-2 text-white/70">
            Registered students under your team.
          </CardDescription>
          <p className="mt-4 text-4xl font-semibold">{teamStudents.length}</p>
          <Link href="/team/register-students" className="mt-4 inline-flex text-sm text-cyan-300">
            Manage students →
          </Link>
        </Card>
        <Card className="border-white/10 bg-white/5 p-5 text-white">
          <CardTitle>Program Registrations</CardTitle>
          <CardDescription className="mt-2 text-white/70">
            Entries submitted to events.
          </CardDescription>
          <p className="mt-4 text-4xl font-semibold">{teamRegistrations.length}</p>
          <Link href="/team/program-register" className="mt-4 inline-flex text-sm text-cyan-300">
            Register for programs →
          </Link>
        </Card>
      </div>
    </div>
  );
}

