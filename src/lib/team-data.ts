import { randomUUID } from "node:crypto";
import {
  PortalStudent,
  PortalTeam,
  Program,
  ProgramRegistration,
  RegistrationSchedule,
} from "@/lib/types";
import {
  ProgramModel,
  ProgramRegistrationModel,
  RegistrationScheduleModel,
  StudentModel,
  TeamModel,
} from "./models";

function sanitizeColor(color?: string) {
  if (!color) return "#0ea5e9";
  return /^#([0-9A-F]{3}){1,2}$/i.test(color) ? color : "#0ea5e9";
}

export async function getPortalTeams(): Promise<PortalTeam[]> {
  const teams = await TeamModel.find().lean();
  return teams.map((team) => ({
    id: team.id,
    teamName: team.name,
    password: team.portal_password ?? "",
    leaderName: team.leader,
    themeColor: sanitizeColor(team.color),
  }));
}

export async function savePortalTeam(team: PortalTeam) {
  await TeamModel.updateOne(
    { id: team.id },
    {
      $set: {
        name: team.teamName,
        leader: team.leaderName,
        color: sanitizeColor(team.themeColor),
        portal_password: team.password,
      },
      $setOnInsert: {
        leader_photo: team.leaderName,
        description: `${team.teamName} squad`,
        contact: `${team.teamName.toLowerCase().replace(/\s+/g, "")}@fest.edu`,
        total_points: 0,
      },
    },
    { upsert: true },
  );
}

export async function deletePortalTeam(teamId: string) {
  await TeamModel.deleteOne({ id: teamId });
  await StudentModel.deleteMany({ team_id: teamId });
  await ProgramRegistrationModel.deleteMany({ teamId });
}

export async function getPortalStudents(): Promise<PortalStudent[]> {
  const [students, teams] = await Promise.all([
    StudentModel.find().lean(),
    TeamModel.find().lean(),
  ]);
  const teamMap = new Map(teams.map((team) => [team.id, team.name]));
  return students.map((student) => ({
    id: student.id,
    name: student.name,
    chestNumber: student.chest_no,
    teamId: student.team_id,
    teamName: teamMap.get(student.team_id) ?? "Unknown",
    score: student.total_points ?? 0,
  }));
}

export async function upsertPortalStudent(input: {
  id?: string;
  name: string;
  chestNumber: string;
  teamId: string;
}) {
  const chestNumber = input.chestNumber.trim().toUpperCase();
  const duplicate = await StudentModel.findOne({
    chest_no: chestNumber,
    ...(input.id ? { id: { $ne: input.id } } : {}),
  })
    .lean()
    .exec();
  if (duplicate) {
    throw new Error("Chest number already registered.");
  }

  const studentId = input.id ?? randomUUID();
  await StudentModel.updateOne(
    { id: studentId },
    {
      $set: {
        name: input.name,
        chest_no: chestNumber,
        team_id: input.teamId,
      },
      $setOnInsert: { total_points: 0 },
    },
    { upsert: true },
  );
}

export async function deletePortalStudent(studentId: string) {
  await StudentModel.deleteOne({ id: studentId });
  await ProgramRegistrationModel.deleteMany({ studentId });
}

export async function getProgramsWithLimits(): Promise<Program[]> {
  const programs = await ProgramModel.find().lean();
  return programs.map((program) => ({
    ...program,
    candidateLimit: program.candidateLimit ?? 1,
  }));
}

export async function getProgramRegistrations(): Promise<ProgramRegistration[]> {
  const registrations = await ProgramRegistrationModel.find().lean();
  return registrations.map((registration) => ({
    id: registration.id,
    programId: registration.programId,
    programName: registration.programName,
    studentId: registration.studentId,
    studentName: registration.studentName,
    studentChest: registration.studentChest,
    teamId: registration.teamId,
    teamName: registration.teamName,
    timestamp: registration.timestamp,
  }));
}

export async function registerCandidate(entry: {
  programId: string;
  programName: string;
  studentId: string;
  studentName: string;
  studentChest: string;
  teamId: string;
  teamName: string;
}) {
  const record: ProgramRegistration = {
    id: randomUUID(),
    ...entry,
    timestamp: new Date().toISOString(),
  };
  await ProgramRegistrationModel.create(record);
  return record;
}

export async function removeProgramRegistration(registrationId: string) {
  await ProgramRegistrationModel.deleteOne({ id: registrationId });
}

export async function removeRegistrationsByProgram(programId: string) {
  await ProgramRegistrationModel.deleteMany({ programId });
}

export async function getRegistrationSchedule(): Promise<RegistrationSchedule> {
  const doc = await RegistrationScheduleModel.findOne().lean();
  if (doc) {
    return { startDateTime: doc.startDateTime, endDateTime: doc.endDateTime };
  }
  const schedule = {
    startDateTime: new Date().toISOString(),
    endDateTime: new Date(Date.now() + 3600_000).toISOString(),
  };
  await RegistrationScheduleModel.create({ key: "global", ...schedule });
  return schedule;
}

export async function updateRegistrationSchedule(schedule: RegistrationSchedule) {
  await RegistrationScheduleModel.updateOne(
    { key: "global" },
    { $set: schedule, $setOnInsert: { key: "global" } },
    { upsert: true },
  );
}

export async function isRegistrationOpen(now: Date = new Date()): Promise<boolean> {
  const schedule = await getRegistrationSchedule();
  return now >= new Date(schedule.startDateTime) && now <= new Date(schedule.endDateTime);
}

