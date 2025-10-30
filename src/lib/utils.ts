import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export const formatCurrency = (() => { throw new Error("Stubbed value used: @/lib/utils.formatCurrency"); })();
export const calculatePoints = (() => { throw new Error("Stubbed value used: @/lib/utils.calculatePoints"); })();
