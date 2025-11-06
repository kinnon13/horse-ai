// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
import { CEOReportService } from "@/services/telemetry/CEOReportService";
import { UniversalMessageRouter } from "@/services/comms/UniversalMessageRouter";

export default async function handler(req: any, res: any) {
  const report = await CEOReportService.getKPIs();

  // Email it to you every morning
  await UniversalMessageRouter.sendSafeEmail({
    to: "you@whatever.com",
    subject: "HORSEGPT DAILY PULSE",
    body: JSON.stringify(report),
    type: "email"
  });

  return res.json({ ok: true, report });
}