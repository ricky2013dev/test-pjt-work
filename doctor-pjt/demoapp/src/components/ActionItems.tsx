import type { BriefingMode, ActionItem, Patient } from '../types';
import { ACTION_DATA } from '../data/actions';
import { PATIENTS } from '../data/patients';

interface ActionItemsProps {
  mode: BriefingMode;
  onPatientClick: (patient: Patient) => void;
  filter?: string | null;
}

const SEV_CONFIG = {
  critical: {
    label: 'Critical Action Items',
    barColor: '#dc2626',
    cardBg: '#fff8f8',
    cardBorder: '#fecaca',
    noteText: '#7f1d1d',
    badgeBg: '#dc2626',
    badgeText: '#fff',
    badgeLabel: 'CRITICAL',
  },
  warning: {
    label: 'Warnings',
    barColor: '#d97706',
    cardBg: '#fffbeb',
    cardBorder: '#fde68a',
    noteText: '#92400e',
    badgeBg: '#d97706',
    badgeText: '#fff',
    badgeLabel: 'WARNING',
  },
  info: {
    label: 'Informational',
    barColor: '#0891b2',
    cardBg: '#f0f9ff',
    cardBorder: '#bae6fd',
    noteText: '#0369a1',
    badgeBg: '#0891b2',
    badgeText: '#fff',
    badgeLabel: 'INFO',
  },
} as const;

const AVATAR_COLORS = [
  '#059669', '#7c3aed', '#9333ea', '#0369a1', '#b45309',
  '#0f766e', '#be185d', '#1d4ed8', '#dc2626', '#d97706',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 3) return (parts[0][0] + parts[2][0]).toUpperCase();
  if (parts.length === 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function anim(index: number) {
  return {
    style: {
      opacity: 0,
      animation: `aiSlideIn 0.35s ease forwards`,
      animationDelay: `${index * 0.07}s`,
    },
  };
}

function ActionCard({
  item,
  onPatientClick,
  animIndex,
  dimmed,
}: {
  item: ActionItem;
  onPatientClick: (patient: Patient) => void;
  animIndex: number;
  dimmed: boolean;
}) {
  const cfg = SEV_CONFIG[item.severity];
  const handleClick = () => {
    const patient = PATIENTS.find(p => p.name === item.patient);
    if (patient) onPatientClick(patient);
  };

  return (
    <div
      {...anim(animIndex)}
      onClick={handleClick}
      className={`rounded-[10px] border cursor-pointer transition-all hover:shadow-sm hover:brightness-[0.97] mb-2 last:mb-0 ${dimmed ? 'opacity-25' : ''}`}
      style={{ background: cfg.cardBg, borderColor: cfg.cardBorder }}
    >
      <div className="flex items-start gap-3 p-3 md:p-[14px_16px]">
        {/* Avatar */}
        <div
          className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-[11px] font-bold text-white flex-shrink-0 mt-0.5"
          style={{ background: getAvatarColor(item.patient) }}
        >
          {getInitials(item.patient)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title + badge row */}
          <div className="flex items-start justify-between gap-2 md:gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-[12px] md:text-[13px] font-bold text-[#1e293b] leading-snug">{item.title}</div>
              <div className="text-[10px] md:text-[11px] text-[#64748b] mt-1">
                {item.patient} &nbsp;·&nbsp; {item.time}
              </div>
              <div className="text-[10px] md:text-[11px] text-[#64748b]">{item.note}</div>
              {item.due && (
                <div className="text-[11px] md:text-[12px] mt-1.5 font-medium" style={{ color: cfg.noteText }}>
                  {item.due}
                </div>
              )}
            </div>
            {/* Badge */}
            <span
              className="flex-shrink-0 text-[9px] md:text-[10px] font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full whitespace-nowrap"
              style={{ background: cfg.badgeBg, color: cfg.badgeText }}
            >
              {cfg.badgeLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function isMatch(item: ActionItem, filter: string | null | undefined): boolean {
  if (!filter || filter === 'all') return true;
  if (filter === 'critical') return item.severity === 'critical';
  if (filter === 'preauth') return PATIENTS.find(p => p.name === item.patient)?.preAuth === 'Pending';
  return true;
}

export default function ActionItems({ mode, onPatientClick, filter }: ActionItemsProps) {
  const actions = ACTION_DATA[mode] ?? ACTION_DATA.daily;

  if (actions.length === 0) {
    return (
      <div className="px-4 md:px-10 py-6 text-[13px] text-[#166534] flex items-center gap-2">
        ✅ <strong>All clear — no pending action items.</strong>
      </div>
    );
  }

  const sevKeys = ['critical', 'warning', 'info'] as const;
  let animIdx = 0;
  const totalCount = actions.length;

  return (
    <div className="px-4 py-5 md:px-10 md:py-7" key={mode}>
      <style>{`
        @keyframes aiSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {sevKeys.map(sev => {
        const items = actions.filter((a: ActionItem) => a.severity === sev);
        if (!items.length) return null;
        const cfg = SEV_CONFIG[sev];
        const headerIdx = animIdx++;

        return (
          <div key={sev} className="mb-5 md:mb-6 last:mb-0">
            {/* Section header */}
            <div {...anim(headerIdx)} className="flex items-center gap-2.5 mb-3">
              <span
                className="inline-block rounded-sm flex-shrink-0"
                style={{ width: 4, height: 18, background: cfg.barColor }}
              />
              <span className="text-[11px] md:text-[12px] font-bold text-[#1e293b] uppercase tracking-[0.5px]">
                {cfg.label}
              </span>
              <span className="text-[10px] md:text-[11px] text-[#94a3b8] font-medium">({items.length})</span>
            </div>

            {items.map((item: ActionItem) => {
              const matched = isMatch(item, filter);
              return (
                <ActionCard
                  key={item.patient}
                  item={item}
                  onPatientClick={onPatientClick}
                  animIndex={animIdx++}
                  dimmed={!!filter && !matched}
                />
              );
            })}
          </div>
        );
      })}

      <div className="text-right mt-2">
        <span className="text-[11px] md:text-[12px] font-semibold text-[#1a4a80] cursor-pointer hover:underline">
          View all {totalCount} action items →
        </span>
      </div>
    </div>
  );
}
