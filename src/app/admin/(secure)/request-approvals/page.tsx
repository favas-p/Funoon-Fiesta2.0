import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getReplacementRequests,
  approveReplacementRequest,
  rejectReplacementRequest,
} from "@/lib/team-data";
import { RequestApprovalsClient } from "@/components/request-approvals-client";

async function approveRequestAction(formData: FormData) {
  "use server";
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
  const requestId = String(formData.get("requestId") ?? "");
  if (!requestId) {
    throw new Error("Request ID is required");
  }
  await approveReplacementRequest(requestId, "admin");
  revalidatePath("/admin/request-approvals");
}

async function rejectRequestAction(formData: FormData) {
  "use server";
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
  const requestId = String(formData.get("requestId") ?? "");
  if (!requestId) {
    throw new Error("Request ID is required");
  }
  await rejectReplacementRequest(requestId, "admin");
  revalidatePath("/admin/request-approvals");
}

export default async function RequestApprovalsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const requests = await getReplacementRequests();
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const processedRequests = requests.filter((r) => r.status !== "pending");

  return (
    <RequestApprovalsClient
      pendingRequests={pendingRequests}
      processedRequests={processedRequests}
      approveAction={approveRequestAction}
      rejectAction={rejectRequestAction}
    />
  );
}

