import { PATIENTS } from '../data/patients';
import type { Patient, BriefingMode } from '../types';

interface PatientListProps {
  mode: BriefingMode;
  onPatientClick: (patient: Patient) => void;
}

function formatTime(timeStr: string) {
  const dt = new Date(timeStr.replace(' ', 'T'));
  return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getDayKey(timeStr: string) {
  return timeStr.split(' ')[0];
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ label, color, count }: { label: string; color: string; count?: number }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="inline-block rounded-sm flex-shrink-0" style={{ width: 4, height: 18, background: color }} />
      <span className="text-[11px] md:text-[12px] font-bold text-[#1e293b] uppercase tracking-[0.5px]">{label}</span>
      {count !== undefined && (
        <span className="text-[10px] md:text-[11px] text-[#94a3b8] font-medium">({count} appointments)</span>
      )}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'In Chair':  'bg-[#d1fae5] text-[#065f46]',
    'Waiting':   'bg-[#fef3c7] text-[#92400e]',
    'Scheduled': 'bg-[#dbeafe] text-[#1e40af]',
    'Complete':  'bg-[#e0e7ff] text-[#3730a3]',
  };
  return (
    <span className={`text-[9px] md:text-[10px] font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full whitespace-nowrap ${styles[status] ?? 'bg-[#f1f5f9] text-[#475569]'}`}>
      {status}
    </span>
  );
}

// ─── Day schedule — email-style table with horizontal scroll on mobile ────────
function DaySchedule({ patients, onPatientClick }: { patients: Patient[]; onPatientClick: (p: Patient) => void }) {
  const sorted = [...patients].sort((a, b) => a.time.localeCompare(b.time));

  function rowBg(p: Patient) {
    if (p.alert === 'critical') return 'bg-[#fff8f8]';
    if (p.alert === 'warning')  return 'bg-[#fffbeb]';
    return 'bg-white';
  }

  return (
    <div className="rounded-[10px] border border-[#e8edf2] overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[540px]">
          {/* Header row */}
          <div className="grid grid-cols-[100px_1fr_1fr_100px] md:grid-cols-[120px_1fr_1fr_120px] bg-[#f8fafc] border-b border-[#e8edf2]">
            {['Time', 'Patient', 'Procedure', 'Status'].map(col => (
              <div key={col} className="px-3 md:px-4 py-2.5 text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.5px]">
                {col}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {sorted.map((p) => (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => onPatientClick(p)}
              onKeyDown={e => e.key === 'Enter' && onPatientClick(p)}
              className={`grid grid-cols-[100px_1fr_1fr_100px] md:grid-cols-[120px_1fr_1fr_120px] border-b border-[#f1f5f9] last:border-b-0 cursor-pointer hover:brightness-[0.97] transition-all ${rowBg(p)}`}
            >
              <div className="px-3 md:px-4 py-2.5 md:py-3 text-[11px] md:text-[12px] text-[#475569] whitespace-nowrap flex items-center">
                {formatTime(p.time)}
              </div>
              <div className="px-3 md:px-4 py-2.5 md:py-3 flex items-center gap-2">
                <div
                  className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: p.color }}
                >
                  {p.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] md:text-[12px] font-semibold text-[#1e293b] flex items-center gap-1 truncate">
                    {p.name}
                    {p.alert === 'critical' && <span className="text-[#dc2626] flex-shrink-0">🚨</span>}
                    {p.alert === 'warning'  && <span className="flex-shrink-0">⚠️</span>}
                  </div>
                  {p.insurance && (
                    <div className="text-[9px] md:text-[10px] text-[#94a3b8] truncate">{p.insurance}</div>
                  )}
                </div>
              </div>
              <div className="px-3 md:px-4 py-2.5 md:py-3 flex items-center">
                <span className="text-[10px] md:text-[12px] text-[#475569] truncate">{p.procedure}</span>
              </div>
              <div className="px-3 md:px-4 py-2.5 md:py-3 flex items-center">
                <StatusBadge status={p.status} />
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="bg-[#f8fafc] px-4 py-2.5 md:py-3 text-center border-t border-[#e8edf2]">
            <span className="text-[11px] md:text-[12px] font-semibold text-[#1a4a80] cursor-pointer hover:underline">
              View full schedule →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Week calendar view ───────────────────────────────────────────────────────
const WEEK_DAYS = [
  { date: '2026-06-01', label: 'Mon', dayLabel: 'Jun 1' },
  { date: '2026-06-02', label: 'Tue', dayLabel: 'Jun 2' },
  { date: '2026-06-03', label: 'Wed', dayLabel: 'Jun 3' },
  { date: '2026-06-04', label: 'Thu', dayLabel: 'Jun 4' },
  { date: '2026-06-05', label: 'Fri', dayLabel: 'Jun 5' },
  { date: '2026-06-06', label: 'Sat', dayLabel: 'Jun 6' },
];

function WeekCalendar({ patients, onPatientClick }: { patients: Patient[]; onPatientClick: (p: Patient) => void }) {
  const byDay: Record<string, Patient[]> = {};
  patients.forEach(p => {
    const key = getDayKey(p.time);
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(p);
  });

  return (
    <div className="overflow-x-auto rounded-[10px] border border-[#e8edf2]">
      <div className="grid grid-cols-6 divide-x divide-[#e8edf2] min-w-[560px]">
        {WEEK_DAYS.map(day => {
          const dayPatients = (byDay[day.date] ?? []).sort((a, b) => a.time.localeCompare(b.time));
          return (
            <div key={day.date} className="flex flex-col">
              <div className="bg-[#f8fafc] border-b border-[#e8edf2] px-2 py-2 text-center">
                <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.8px] text-[#94a3b8]">{day.label}</div>
                <div className="text-[13px] md:text-[14px] font-semibold text-[#1e293b]">{day.dayLabel}</div>
                {dayPatients.length > 0 && (
                  <div className="mt-0.5 text-[9px] md:text-[10px] text-[#94a3b8]">{dayPatients.length} pt{dayPatients.length > 1 ? 's' : ''}</div>
                )}
              </div>
              <div className="flex flex-col gap-1.5 p-2 min-h-[160px] md:min-h-[220px]">
                {dayPatients.length === 0 ? (
                  <div className="text-[10px] text-[#94a3b8] text-center mt-4">No appts</div>
                ) : (
                  dayPatients.map(p => (
                    <div
                      key={p.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onPatientClick(p)}
                      onKeyDown={e => e.key === 'Enter' && onPatientClick(p)}
                      className={`block rounded-lg border p-2 cursor-pointer transition-all hover:shadow-sm ${
                        p.alert === 'critical'
                          ? 'border-[#fecaca] bg-[#fff8f8]'
                          : p.alert === 'warning'
                          ? 'border-[#fde68a] bg-[#fffbeb]'
                          : 'border-[#e8edf2] bg-white hover:border-[#0f766e]'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <div
                          className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                          style={{ background: p.color }}
                        >
                          {p.initials}
                        </div>
                        <span className="text-[10px] font-semibold text-[#1e293b] leading-tight truncate">{p.name.split(' ')[0]}</span>
                      </div>
                      <div className="text-[9px] text-[#0f766e] font-semibold">{formatTime(p.time)}</div>
                      <div className="text-[9px] text-[#94a3b8] truncate">{p.procedure}</div>
                      {p.alert && (
                        <div className={`mt-1 text-[8px] font-bold uppercase tracking-[0.5px] ${
                          p.alert === 'critical' ? 'text-[#dc2626]' : p.alert === 'warning' ? 'text-[#d97706]' : 'text-[#0f766e]'
                        }`}>
                          ⚠ {p.alerts[0]}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Month calendar view ──────────────────────────────────────────────────────
const MONTH_DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_IN_JUNE = 30;

function MonthCalendar({ patients, onPatientClick }: { patients: Patient[]; onPatientClick: (p: Patient) => void }) {
  const byDay: Record<number, Patient[]> = {};
  patients.forEach(p => {
    const d = new Date(p.time.replace(' ', 'T')).getDate();
    if (!byDay[d]) byDay[d] = [];
    byDay[d].push(p);
  });

  const cells: (number | null)[] = [];
  for (let d = 1; d <= DAYS_IN_JUNE; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="text-[13px] md:text-[15px] font-semibold text-[#1e293b]">June 2026</div>
        <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[11px] text-[#94a3b8]">
          <span className="flex items-center gap-1"><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#dc2626]" /> Critical</span>
          <span className="flex items-center gap-1"><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d97706]" /> Warning</span>
          <span className="flex items-center gap-1"><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0f766e]" /> Scheduled</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 md:gap-1.5">
        {MONTH_DAY_HEADERS.map(d => (
          <div key={d} className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.5px] text-[#94a3b8] text-center pb-1">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const dayPatients = byDay[day] ?? [];
          const hasCritical = dayPatients.some(p => p.alert === 'critical');
          const hasWarning  = !hasCritical && dayPatients.some(p => p.alert === 'warning');

          return (
            <div
              key={day}
              className={`min-h-[52px] md:min-h-[78px] rounded-lg md:rounded-xl border p-1 md:p-2 transition-colors ${
                dayPatients.length > 0
                  ? hasCritical ? 'border-[#fecaca] bg-[#fff8f8] hover:border-[#dc2626]'
                  : hasWarning  ? 'border-[#fde68a] bg-[#fffbeb] hover:border-[#d97706]'
                                : 'border-[#e8edf2] bg-white hover:border-[#0f766e]'
                  : 'border-[#e8edf2]/40 bg-[#f8fafc]/50'
              }`}
            >
              <div className={`text-[10px] md:text-[12px] font-semibold mb-1 ${dayPatients.length > 0 ? 'text-[#1e293b]' : 'text-[#94a3b8]'}`}>
                {day}
              </div>
              {dayPatients.slice(0, 2).map(p => (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={e => { e.stopPropagation(); onPatientClick(p); }}
                  onKeyDown={e => e.key === 'Enter' && onPatientClick(p)}
                  className="flex items-center gap-1 mb-0.5 cursor-pointer group"
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                  <span className="text-[9px] md:text-[10px] text-[#475569] truncate group-hover:text-[#0f766e] transition-colors leading-tight">
                    {p.name.split(' ')[0]} {(p.name.split(' ')[2] ?? p.name.split(' ')[1])?.[0]}.
                  </span>
                </div>
              ))}
              {dayPatients.length > 2 && (
                <div className="text-[8px] md:text-[9px] text-[#94a3b8] mt-0.5">+{dayPatients.length - 2}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function PatientList({ mode, onPatientClick }: PatientListProps) {
  const daily   = PATIENTS.filter(p => p.group === 'today');
  const weekly  = PATIENTS.filter(p => p.group === 'week');
  const monthly = PATIENTS.filter(p => p.group === 'month');

  if (mode === 'daily') {
    return (
      <div className="px-4 py-5 md:px-10 md:py-7">
        <SectionHeader label="Today's Schedule" color="#0f766e" count={daily.length} />
        <DaySchedule patients={daily} onPatientClick={onPatientClick} />
      </div>
    );
  }

  if (mode === 'weekly') {
    return (
      <div className="px-4 py-5 md:px-10 md:py-7">
        <SectionHeader label="Week of Jun 1–6, 2026" color="#0f766e" count={weekly.length} />
        <WeekCalendar patients={weekly} onPatientClick={onPatientClick} />
      </div>
    );
  }

  return (
    <div className="px-4 py-5 md:px-10 md:py-7">
      <SectionHeader label="June 2026" color="#0f766e" count={monthly.length} />
      <MonthCalendar patients={monthly} onPatientClick={onPatientClick} />
    </div>
  );
}
