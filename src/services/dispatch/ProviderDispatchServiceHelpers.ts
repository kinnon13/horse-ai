import { providerNotifier } from "./ProviderNotifier";
import { logEvent, CRITICAL_EVENTS } from "@/lib/logEvent";

export function buildDispatchCriteria(job: {
  type: "haul" | "vet" | "farrier";
  city: string;
  state: string;
  payoutUSD: number;
}) {
  return {
    location: `${job.city}, ${job.state}`,
    serviceType: job.type,
    urgency: 'high' as const,
    budget: job.payoutUSD
  };
}

export async function sendProviderNotification(
  providerId: string,
  job: { type: string; city: string; state: string; payoutUSD: number }
) {
  await providerNotifier.sendNotification({
    providerId,
    type: 'service_request',
    title: `New ${job.type} job available`,
    message: `A ${job.type} job is available in ${job.city}, ${job.state} for $${job.payoutUSD}`,
    priority: 'high'
  });
}

export async function logDispatchEvent(
  jobId: string,
  providerId: string | null,
  payoutUSD: number
) {
  if (providerId) {
    await logEvent(CRITICAL_EVENTS.JOB_DISPATCHED, {
      jobId,
      providerId,
      offerUSD: payoutUSD
    });
  } else {
    await logEvent(CRITICAL_EVENTS.JOB_UNFILLED, { jobId });
  }
}

