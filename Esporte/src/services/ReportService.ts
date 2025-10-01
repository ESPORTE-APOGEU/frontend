// src/services/ReportService.ts
import { api } from "./Api";

export type CreateReportPayload = {
  type: string;
  description?: string;
  reportedUserId?: string; // alvo do report (usuário)
  eventId?: string | number; // se futuramente reportar evento
};

export async function createReport(payload: CreateReportPayload) {
  // o Authorization: Bearer <jwt> é injetado pelo interceptor do api
  // (vide src/services/Api.ts com attachAuth)
  const res = await api.post("/reports", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data ?? res;
}
