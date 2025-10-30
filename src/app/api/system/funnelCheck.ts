import { analyzeFunnel, applyPatchIfNeeded } from "../../services/ops/FunnelGuardService";

export default async function handler(req: any, res: any) {
  const status = await analyzeFunnel();
  const patch = await applyPatchIfNeeded(status);
  return res.json({ ok: true, status, patch });
}