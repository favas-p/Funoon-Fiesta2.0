"use client";

import { useMemo, useState } from "react";
import type { Program, ProgramRegistration, PortalStudent } from "@/lib/types";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface ProgramWithLimit extends Program {
  candidateLimit: number;
}

interface Props {
  programs: ProgramWithLimit[];
  teamRegistrations: ProgramRegistration[];
  teamStudents: PortalStudent[];
  isOpen: boolean;
  registerAction: (formData: FormData) => Promise<void>;
  removeAction: (formData: FormData) => Promise<void>;
}

export function TeamProgramRegister({
  programs,
  isOpen,
  registerAction,
  removeAction,
  teamRegistrations,
  teamStudents,
}: Props) {
  const [query, setQuery] = useState("");

  const filteredPrograms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return programs;
    return programs.filter((program) => program.name.toLowerCase().includes(q));
  }, [programs, query]);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-white">
        <p className="text-sm text-white/70">
          Registration window: {isOpen ? "Open" : "Closed"} (controls {isOpen ? "enabled" : "disabled"})
        </p>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search programs..."
          className="mt-3 bg-slate-900/40 text-white placeholder:text-white/50"
        />
      </div>

      {filteredPrograms.map((program) => {
        const registrations = teamRegistrations.filter(
          (registration) => registration.programId === program.id,
        );
        const availableStudents = teamStudents.filter(
          (student) => !registrations.some((registration) => registration.studentId === student.id),
        );
        const limitReached = registrations.length >= program.candidateLimit;

        return (
          <Card key={program.id} className="border-white/10 bg-white/5 p-5 text-white">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>{program.name}</CardTitle>
                <CardDescription className="mt-1 text-white/70">
                  Section: {program.section} · Category: {program.category}
                </CardDescription>
              </div>
              <Badge tone={limitReached ? "pink" : "emerald"}>
                Registered {registrations.length} / {program.candidateLimit}
              </Badge>
            </div>

            <div className="mt-4 space-y-2">
              {registrations.length === 0 ? (
                <p className="text-sm text-white/60">No entries yet.</p>
              ) : (
                registrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-white">{registration.studentName}</p>
                      <p className="text-white/60 text-xs">
                        Chest #{registration.studentChest} · {registration.teamName}
                      </p>
                    </div>
                    <form action={removeAction}>
                      <input type="hidden" name="registrationId" value={registration.id} />
                      <Button type="submit" variant="ghost" className="text-red-300 hover:text-red-100">
                        Remove
                      </Button>
                    </form>
                  </div>
                ))
              )}
            </div>

            {isOpen && !limitReached && (
              <form action={registerAction} className="mt-4 grid gap-3 md:grid-cols-[2fr_1fr]">
                <input type="hidden" name="programId" value={program.id} />
                <Select name="studentId" required defaultValue="">
                  <option value="" disabled>
                    Select a student
                  </option>
                  {availableStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} · {student.chestNumber} · {student.teamName}
                    </option>
                  ))}
                </Select>
                <Button type="submit" disabled={availableStudents.length === 0}>
                  Register
                </Button>
              </form>
            )}

            {!isOpen && (
              <p className="mt-4 text-sm text-amber-300">Registration window closed.</p>
            )}

            {isOpen && limitReached && (
              <p className="mt-4 text-sm text-amber-300">Candidate limit reached for this program.</p>
            )}
          </Card>
        );
      })}
    </div>
  );
}

