// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
import { holdSlot, confirmSlot } from "./ProviderAvailabilityStore";
import { logEvent, CRITICAL_EVENTS } from "@/lib/logEvent";

export async function tryReserveSlot({
  providerId,
  jobId,
  startTime
}: {
  providerId: string;
  jobId: string;
  startTime: string;
}) {
  const held = await holdSlot(providerId, startTime, jobId);

  if (!held) {
    await logEvent(CRITICAL_EVENTS.BOOKING_CONFLICT, { providerId, jobId, startTime });
    return { ok: false, reason: "slot_taken" };
  }

  await logEvent(CRITICAL_EVENTS.BOOKING_HELD, { providerId, jobId, startTime });
  return { ok: true };
}

export async function finalizeReservation(jobId: string) {
  await confirmSlot(jobId);
  await logEvent(CRITICAL_EVENTS.BOOKING_CONFIRMED, { jobId });
}

