const REPLACERS: { [key: string]: string } = {
  "guaranteed": "historically performs well",
  "no risk": "use at your own discretion",
  "insured by us": "please confirm insurance directly with the hauler",
  "we certify": "based on data we have",
  "we are responsible": "final responsibility is between you and the provider"
};

export function sanitizeForLiability(raw: string) {
  let safe = raw;
  for (const badPhrase in REPLACERS) {
    const pattern = new RegExp(badPhrase, "gi");
    safe = safe.replace(pattern, REPLACERS[badPhrase]);
  }
  return safe;
}