import { selectBestProviders } from "./ProviderSelector";
import { notifyProvider } from "./ProviderNotifier";
import { tryReserveSlot } from "../availability/ProviderBookingLock";
import { logEvent, CRITICAL_EVENTS } from "@/lib/logEvent";

// This is "Uber for horses": find, reserve, ping.

export async function dispatchJob(job: {
  jobId: string;
  type: "haul" | "vet" | "farrier";
  city: string;
  state: string;
  neededAtISO: string;
  payoutUSD: number;
}) {
  // 1. pick best fits
  const candidates = await selectBestProviders(job);

  for (const candidate of candidates) {
    // 2. try to lock their slot
    const locked = await tryReserveSlot({
      providerId: candidate.providerId,
      jobId: job.jobId,
      startTime: job.neededAtISO
    });

    if (!locked.ok) continue; // someone else got them first, try next person

    // 3. notify them with offer
    await notifyProvider({
      providerId: candidate.providerId,
      jobId: job.jobId,
      offerUSD: job.payoutUSD,
      neededAtISO: job.neededAtISO
    });

    // 4. log for payout & audit trail
    await logEvent(CRITICAL_EVENTS.JOB_DISPATCHED, {
      jobId: job.jobId,
      providerId: candidate.providerId,
      offerUSD: job.payoutUSD
    });

    return { sentTo: candidate.providerId };
  }

  await logEvent(CRITICAL_EVENTS.JOB_UNFILLED, { jobId: job.jobId });
  return { sentTo: null };
}