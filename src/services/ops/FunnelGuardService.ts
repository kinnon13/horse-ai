import { logEvent, CRITICAL_EVENTS } from "@/lib/logEvent";

// analyzeFunnel: looks at onboarding performance
export async function analyzeFunnel() {
  // You'll actually query logEvent table:
  // count(ONBOARDING_STARTED past hour)
  // count(ONBOARDING_COMPLETED past hour)

  const started = 100;   // stub
  const finished = 12;   // stub
  const stuckRate = started === 0 ? 0 : 100 - Math.round((finished/started)*100);

  return { started, finished, stuckRate };
}

// applyPatchIfNeeded: if dropoff is ugly, sweeten offer automatically
export async function applyPatchIfNeeded(status: { stuckRate: number }) {
  if (status.stuckRate < 70) {
    return { patched: false };
  }

  const newOfferCopy = "Finish setup now and get 14 days Pro for free 🌟";

  // Here you would update some outbound template table, etc.
  await logEvent(CRITICAL_EVENTS.FUNNEL_PATCH_APPLIED, {
    reason: "high_drop",
    newOfferCopy
  });

  return {
    patched: true,
    newOfferCopy
  };
}