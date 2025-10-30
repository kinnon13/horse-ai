// Pull KPIs from DB and shape them into a human-readable pulse.
// Right now it's stub numbers. Replace queries as you hook in.

export async function getKPIs() {
  const kpis = {
    capturedUsers: 500000,         // total emails / phone numbers captured
    activeUsers: 330000,           // touched AI in last 24h
    payingUsers: 49500,            // on paid tier
    mrrUSD: 8300000,               // 8.3M MRR (example)
    newCRMContacts: 2610000,       // net-new contacts yesterday
    videosUploaded: 7000,          // new run videos yesterday
    sharesTriggered: 350000,       // brag cards posted
    payoutOwedUSD: 42000,          // what we owe providers
    complianceFlags24h: 0          // red flags
  };

  const txt = [
    "HORSEGPT DAILY PULSE",
    "",
    `Captured Users: ${kpis.capturedUsers}`,
    `Active AI Users (24h): ${kpis.activeUsers}`,
    `Paying Subs: ${kpis.payingUsers}`,
    `MRR: $${(kpis.mrrUSD/1000000).toFixed(2)}M`,
    "",
    `New Contacts (24h): ${kpis.newCRMContacts}`,
    `Videos Uploaded: ${kpis.videosUploaded}`,
    `Shares Triggered: ${kpis.sharesTriggered}`,
    "",
    `Payout Owed (24h): $${kpis.payoutOwedUSD}`,
    `Compliance Flags (24h): ${kpis.complianceFlags24h}`
  ].join("\n");

  return { txt, ...kpis };
}