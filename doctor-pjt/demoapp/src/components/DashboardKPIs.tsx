import type React from 'react';
import type { BriefingMode } from '../types';
import { PATIENTS } from '../data/patients';
import { ACTION_DATA } from '../data/actions';

interface DashboardKPIsProps {
  mode: BriefingMode;
  activeFilter: string | null;
  onFilterChange: (filter: string) => void;
}

function parseCost(cost: string): number {
  return parseInt(cost.replace(/[$,]/g, '')) || 0;
}

const ANIM = `@keyframes kpiSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`;

function ka(i: number): React.CSSProperties {
  return { opacity: 0, animation: 'kpiSlide 0.35s ease forwards', animationDelay: `${i * 0.08}s` };
}

export default function DashboardKPIs({ mode, activeFilter, onFilterChange }: DashboardKPIsProps) {
  const groupKey = mode === 'daily' ? 'today' : mode === 'weekly' ? 'week' : 'month';
  const patients = PATIENTS.filter(p => p.group === groupKey);
  const actions  = ACTION_DATA[mode] ?? [];

  const criticalCount  = actions.filter(a => a.severity === 'critical').length;
  const pendingPreAuth = patients.filter(p => p.preAuth === 'Pending').length;
  const totalRevenue   = patients.reduce((sum, p) => sum + parseCost(p.cost), 0);
  const activeNow      = patients.filter(p => p.status === 'In Chair' || p.status === 'Waiting').length;

  const modeLabel = { daily: 'Today', weekly: 'This Week', monthly: 'This Month' }[mode];

  const kpis = [
    {
      filterKey: 'all',
      val: String(patients.length),
      label: `Patients ${modeLabel}`,
      sub: activeNow > 0 ? `${activeNow} active now` : 'All scheduled',
      numColor: '#0f766e',
      subColor: '#94a3b8',
    },
    {
      filterKey: 'critical',
      val: String(criticalCount),
      label: 'Critical Alerts',
      sub: criticalCount > 0 ? 'Action required' : 'All clear',
      numColor: criticalCount > 0 ? '#dc2626' : '#0f766e',
      subColor: criticalCount > 0 ? '#dc2626' : '#94a3b8',
    },
    {
      filterKey: 'preauth',
      val: String(pendingPreAuth),
      label: 'Pre-Auth Pending',
      sub: pendingPreAuth > 0 ? 'Submit today' : 'All authorized',
      numColor: pendingPreAuth > 0 ? '#d97706' : '#0f766e',
      subColor: pendingPreAuth > 0 ? '#d97706' : '#94a3b8',
    },
    {
      filterKey: null,
      val: `$${totalRevenue.toLocaleString()}`,
      label: 'Scheduled Revenue',
      sub: `${patients.length} appointment${patients.length !== 1 ? 's' : ''}`,
      numColor: '#0f2d55',
      subColor: '#94a3b8',
    },
  ];

  return (
    <div className="bg-white border-b border-[#e8edf2]" key={mode}>
      <style>{ANIM}</style>
      {/* 2×2 on mobile, 4-col on md+ */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {kpis.map((k, i) => {
          const isSelected = (k.filterKey === 'all' && !activeFilter) || (k.filterKey !== null && activeFilter === k.filterKey);
          const isClickable = k.filterKey !== null;

          // Mobile 2×2 borders: right border on left col, bottom border on top row
          const mobileRightBorder = i % 2 === 0 ? 'border-r' : '';
          const mobileBottomBorder = i < 2 ? 'border-b md:border-b-0' : '';
          // Desktop: left border except first
          const desktopLeftBorder = i > 0 ? 'md:border-l' : '';
          // Desktop: remove mobile right border
          const desktopNoRight = i % 2 === 0 ? 'md:border-r-0' : '';

          return (
            <div
              key={i}
              style={ka(i)}
              onClick={() => k.filterKey && onFilterChange(k.filterKey)}
              className={`text-center px-3 py-4 md:px-6 md:py-5 transition-all relative border-[#e8edf2]
                ${mobileRightBorder} ${mobileBottomBorder} ${desktopLeftBorder} ${desktopNoRight}
                ${isClickable ? 'cursor-pointer hover:bg-[#f8fafc]' : ''}
                ${isSelected ? 'bg-[#f0f9ff]' : ''}
              `}
            >
              {isSelected && (
                <div className="absolute bottom-0 left-4 right-4 md:left-6 md:right-6 h-[2px] bg-[#0f2d55] rounded-full" />
              )}
              <div className="text-[22px] md:text-[26px] font-extrabold leading-none" style={{ color: k.numColor }}>
                {k.val}
              </div>
              <div className="text-[10px] md:text-[11px] text-[#64748b] font-medium mt-1 md:mt-1.5">{k.label}</div>
              <div className="text-[9px] md:text-[10px] mt-0.5" style={{ color: k.subColor }}>{k.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
