import { sanitizeForLiability } from "./LiabilitySanitizerRules";
import { logEvent, CRITICAL_EVENTS } from "@/lib/logEvent";

// Stub actual transport layers -- you fill in Twilio, SendGrid, IG Graph, etc
async function sendSMSActual(toPhone: string, body: string) {
  // twilio.send({ to: toPhone, body })
  console.log('SMS:', toPhone, body)
}

async function sendEmailActual(toEmail: string, subject: string, body: string) {
  // sendgrid.send({ to: toEmail, subject, text: body })
  console.log('Email:', toEmail, subject, body)
}

async function sendDMActual(
  platform: "instagram" | "tiktok",
  handle: string,
  body: string
) {
  // igApi.dm(handle, body)
  console.log('DM:', platform, handle, body)
}

// Public safe wrappers

export async function sendSafeSMS(toPhone: string, body: string) {
  const safe = sanitizeForLiability(body);
  await sendSMSActual(toPhone, safe);
  await logEvent(CRITICAL_EVENTS.OUTBOUND_SMS_SENT, { toPhone, safe });
  return safe;
}

export async function sendSafeEmail(
  toEmail: string,
  subject: string,
  body: string
) {
  const safe = sanitizeForLiability(body);
  await sendEmailActual(toEmail, subject, safe);
  await logEvent(CRITICAL_EVENTS.OUTBOUND_EMAIL_SENT, { toEmail, subject, safe });
  return safe;
}

export async function sendSafeDM(
  platform: "instagram" | "tiktok",
  handle: string,
  body: string
) {
  const safe = sanitizeForLiability(body);
  await sendDMActual(platform, handle, safe);
  await logEvent(CRITICAL_EVENTS.OUTBOUND_DM_SENT, { platform, handle, safe });
  return safe;
}