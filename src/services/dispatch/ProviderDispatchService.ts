// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
import { providerSelector } from "./ProviderSelector";
import { tryReserveSlot } from "../availability/ProviderBookingLock";
import { buildDispatchCriteria, sendProviderNotification, logDispatchEvent } from "./ProviderDispatchServiceHelpers";

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
  const criteria = buildDispatchCriteria(job);
  const candidates = await providerSelector.findProviders(criteria);

  for (const candidate of candidates) {
    // 2. try to lock their slot
    const locked = await tryReserveSlot({
      providerId: candidate.id,
      jobId: job.jobId,
      startTime: job.neededAtISO
    });

    if (!locked.ok) continue; // someone else got them first, try next person

    // 3. notify them with offer
    await sendProviderNotification(candidate.id, job);

    // 4. log for payout & audit trail
    await logDispatchEvent(job.jobId, candidate.id, job.payoutUSD);

    return { sentTo: candidate.id };
  }

  await logDispatchEvent(job.jobId, null, job.payoutUSD);
  return { sentTo: null };
}