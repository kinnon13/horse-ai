import { getKPIs } from "../../services/telemetry/CEOReportService";
import { sendSafeEmail } from "../../services/comms/UniversalMessageRouter";

export default async function handler(req: any, res: any) {
  const report = await getKPIs();

  // Email it to you every morning
  await sendSafeEmail(
    "you@whatever.com",
    "HORSEGPT DAILY PULSE",
    report.txt
  );

  return res.json({ ok: true, report });
}