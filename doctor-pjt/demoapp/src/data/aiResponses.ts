export interface AIResponse {
  match: string[];
  reply: string;
}

export const AI_RESPONSES: AIResponse[] = [
  {
    match: ['pre-auth', 'pre auth', 'authorization'],
    reply: `<p>Here are patients with <strong>pending pre-authorization</strong> this week:</p><ul><li><strong>Kevin O. Park</strong> — Root Canal (Molar #19), Delta Dental · <em>Due Now</em></li><li><strong>Angela R. Moore</strong> — Crown Consultation, Aetna HMO · <em>Due Today</em></li><li><strong>Victor L. Nelson</strong> — Root Canal Premolar, Cigna PPO · <em>By Jun 7</em></li></ul><p>Recommend submitting Delta Dental request immediately — appointment is in 2h 30m.</p>`,
  },
  {
    match: ['unpaid', 'balance', 'outstanding', 'billing'],
    reply: `<p>One patient has an <strong>outstanding balance</strong>:</p><ul><li><strong>Dennis R. Cook</strong> — $380 unpaid. Humana claim CLM-230508 was denied due to missing NPI code. No-show on May 15.</li></ul><p>Recommended action: Resubmit corrected claim or initiate patient billing contact within 7 days.</p>`,
  },
  {
    match: ['today', 'schedule', 'appointment', 'rounds'],
    reply: `<p>You have <strong>8 appointments</strong> today (May 31):</p><ul><li>9:00 AM — James T. Morrison · Dental Exam + Cleaning</li><li>10:00 AM — Emily R. Santos · Crown Placement ⚠️ Consent missing</li><li>11:30 AM — Kevin O. Park · Root Canal #19 🚨 Pre-auth pending</li><li>1:00 PM — Linda M. Jacobs · Composite Filling x2</li><li>2:30 PM — David H. Nguyen · Tooth Extraction</li><li>3:30 PM — Rachel T. Kim · Invisalign Consult</li><li>4:00 PM — Marcus A. Lewis · Teeth Whitening</li><li>5:00 PM — Susan B. Turner · X-Ray + Consult</li></ul><p>2 patients require attention before chair.</p>`,
  },
  {
    match: ['high risk', 'risk', 'critical', 'urgent'],
    reply: `<p><strong>2 high-risk patients</strong> require action before their appointments today:</p><ul><li><strong>Emily R. Santos (10:00 AM)</strong> — Consent form not signed for Crown Placement. Must be resolved before seating.</li><li><strong>Kevin O. Park (11:30 AM)</strong> — Pre-auth for Root Canal not submitted. Delta Dental requires this before treatment.</li></ul><p>Recommend flagging both patients at check-in.</p>`,
  },
  {
    match: ['recall', 'overdue', 'cleaning', 'prophylaxis'],
    reply: `<p>Patients with <strong>overdue recalls</strong>:</p><ul><li><strong>Marcus A. Lewis</strong> — 13 months since last cleaning (Apr 2025). In chair today at 4:00 PM for whitening — good time to schedule.</li><li><strong>Brian C. Walsh</strong> — 6-month recall overdue. Next visit Jun 1.</li></ul><p>Consider sending automated recall reminders to patients approaching 6-month intervals.</p>`,
  },
  {
    match: ['insurance', 'eligibility', 'coverage', 'verify'],
    reply: `<p>Insurance issues requiring attention this month:</p><ul><li><strong>Peter N. Adams</strong> — BlueCross PPO eligibility not verified for Jun 9 visit.</li><li><strong>Samuel W. Wright</strong> — Humana Dental plan expires Jun 30. Confirm renewal before Jun 25 visit.</li><li><strong>Dennis R. Cook</strong> — Claim denied (missing NPI). Resubmit corrected to Humana.</li></ul><p>3 items require staff follow-up before appointments proceed.</p>`,
  },
  {
    match: ['medication', 'drug', 'prescription', 'allergy'],
    reply: `<p>Medication-related notes for today's patients:</p><ul><li><strong>James T. Morrison</strong> — On blood thinners (Warfarin). Verify INR levels before any invasive procedure.</li><li><strong>Emily R. Santos</strong> — Documented penicillin allergy. Use alternative antibiotic if prescribing post-crown.</li><li><strong>David H. Nguyen</strong> — Diabetic patient. Monitor healing time post-extraction and coordinate with PCP if needed.</li></ul><p>Always confirm current medications at check-in for surgical patients.</p>`,
  },
];

export const AI_FALLBACK = `<p>I don't have specific data on that query, but I can help with:</p><ul><li>Patient schedules and appointment status</li><li>Pre-authorization requirements and deadlines</li><li>Insurance eligibility and unpaid balances</li><li>Overdue recalls and treatment plans</li><li>Action items by severity</li></ul><p>Try rephrasing your question or select one of the suggested prompts.</p>`;
