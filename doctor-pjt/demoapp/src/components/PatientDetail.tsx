import { useState, useRef, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import type { Patient } from '../types';
import AppBar from './AppBar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

type DetailTab = 'cost' | 'records' | 'agent';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
}

// ─── Pill badge ───────────────────────────────────────────────────────────────
function Pill({ label, variant }: { label: string; variant: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple' }) {
  const styles: Record<string, string> = {
    green:  'bg-[#d1fae5] text-[#065f46]',
    yellow: 'bg-[#fef3c7] text-[#92400e]',
    red:    'bg-[#fee2e2] text-[#991b1b]',
    blue:   'bg-[#dbeafe] text-[#1e40af]',
    gray:   'bg-[#f1f5f9] text-[#475569]',
    purple: 'bg-[#ede9fe] text-[#5b21b6]',
  };
  return (
    <span className={`inline-block px-2 md:px-2.5 py-0.5 rounded-full text-[10px] font-bold ${styles[variant]}`}>
      {label}
    </span>
  );
}

// ─── Section header with left color bar ──────────────────────────────────────
function SectionHeader({ label, color = '#0f2d55' }: { label: string; color?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3 md:mb-4">
      <span className="inline-block rounded-sm flex-shrink-0" style={{ width: 4, height: 18, background: color }} />
      <span className="text-[11px] md:text-[12px] font-bold text-[#1e293b] uppercase tracking-[0.5px]">{label}</span>
    </div>
  );
}

// ─── Email-style bordered table with horizontal scroll ────────────────────────
function ETable({ headers, rows, className = '' }: {
  headers: string[];
  rows: React.ReactNode[][];
  className?: string;
}) {
  return (
    <div className={`rounded-[10px] border border-[#e8edf2] overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] md:text-[12px] min-w-[320px]">
          {headers.length > 0 && (
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e8edf2]">
                {headers.map(h => (
                  <th key={h} className="text-left px-3 md:px-4 py-2 md:py-2.5 text-[9px] md:text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.5px] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fafc] transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 md:px-4 py-2 md:py-2.5 text-[#475569]">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const CHART_LEGEND = { position: 'bottom' as const, labels: { boxWidth: 8, font: { size: 9 } } };

// ─── Tab 1: AI Goal Validation ────────────────────────────────────────────────
function Tab1Content() {
  return (
    <div className="px-4 py-5 md:px-8 md:py-7 border-t border-[#e8edf2]">
      <SectionHeader label="AI Goal Validation Summary" color="#0891b2" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {[
          { icon: '✅', name: 'Treatment Validation', badge: <Pill label="Passed"    variant="green"  />, bg: 'bg-[#f0fdf4] border-[#d1fae5]' },
          { icon: '💡', name: 'Treatment Suggestion',  badge: <Pill label="Optimized" variant="green"  />, bg: 'bg-[#f0fdf4] border-[#d1fae5]' },
          { icon: '🛡️', name: 'Loss Prevention',       badge: <Pill label="Review"    variant="yellow" />, bg: 'bg-[#fffbeb] border-[#fde68a]' },
          { icon: '📑', name: 'Benefit Coverage',      badge: <Pill label="Verified"  variant="green"  />, bg: 'bg-[#f0fdf4] border-[#d1fae5]' },
          { icon: '⚡', name: 'Optimize Plan',         badge: <Pill label="Applied"   variant="green"  />, bg: 'bg-[#f0fdf4] border-[#d1fae5]' },
        ].map((g, i) => (
          <div key={i} className={`border rounded-[10px] p-3 text-center text-[11px] ${g.bg}`}>
            <span className="text-[18px] md:text-[20px] block mb-1">{g.icon}</span>
            <span className="font-semibold text-[#475569] block mb-1 text-[10px] md:text-[11px]">{g.name}</span>
            {g.badge}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab 2: Cost & Insurance ──────────────────────────────────────────────────
function Tab2Content({ patient }: { patient: Patient }) {
  return (
    <div className="px-4 py-5 md:px-8 md:py-7">

      {/* AI Report header — navy gradient */}
      <div
        className="flex items-start sm:items-center justify-between gap-3 rounded-[10px] px-4 py-4 md:px-6 md:py-5 mb-5 md:mb-6"
        style={{ background: 'linear-gradient(135deg, #0f2d55 0%, #1a4a80 100%)' }}
      >
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
              <circle cx="7.5" cy="14.5" r="1.5" fill="white" stroke="none"/>
              <circle cx="16.5" cy="14.5" r="1.5" fill="white" stroke="none"/>
            </svg>
          </div>
          <div>
            <div className="text-[13px] md:text-[14px] font-bold text-white">AI-Generated Report &amp; Recommendations</div>
            <div className="text-[10px] md:text-[11px] text-[#93c5fd] mt-0.5">
              Generated {new Date().toISOString().slice(0, 10)} &nbsp;·&nbsp; HealthAI v3.2
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-right">
            <div className="text-[20px] md:text-[24px] font-extrabold text-[#7dd3fc] leading-none">94%</div>
            <div className="text-[9px] md:text-[10px] text-[#93c5fd] mt-0.5 uppercase tracking-[0.5px]">Confidence</div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="mb-5 md:mb-6">
        <SectionHeader label="Risk Assessment" color="#dc2626" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:gap-3">
          {[
            { icon: '🚨', title: 'Deductible Exhaustion Risk',  desc: 'Upcoming procedures will approach the remaining deductible ($920). Patient may face unexpected out-of-pocket costs.', badge: 'HIGH',    level: 'high'   as const },
            { icon: '📋', title: 'Pre-Auth Gap Risk',            desc: `Pre-authorization status: ${patient.preAuth}. Ensure all required authorizations are in place before the appointment.`,   badge: 'MEDIUM', level: 'medium' as const },
            { icon: '📈', title: 'Claim Frequency Trend',        desc: 'Preventive care bundling can reduce future claim volume by an estimated 15–20% over 12 months.',                          badge: 'MONITOR',level: 'low'    as const },
          ].map((r, i) => {
            const border = { high: 'border-[#fecaca]', medium: 'border-[#fde68a]', low: 'border-[#e8edf2]' }[r.level];
            const bg     = { high: 'bg-[#fff8f8]',     medium: 'bg-[#fffbeb]',     low: 'bg-white' }[r.level];
            const badge  = { high: 'bg-[#dc2626] text-white', medium: 'bg-[#d97706] text-white', low: 'bg-[#0891b2] text-white' }[r.level];
            return (
              <div key={i} className={`rounded-[10px] p-3.5 flex flex-col gap-1.5 border ${border} ${bg}`}>
                <span className="text-[16px] md:text-[18px]">{r.icon}</span>
                <span className="text-[12px] md:text-[13px] font-semibold text-[#1e293b]">{r.title}</span>
                <span className="text-[11px] md:text-[12px] text-[#475569] leading-[1.5]">{r.desc}</span>
                <span className={`text-[9px] md:text-[10px] font-bold px-2.5 py-0.5 rounded-full self-start ${badge}`}>{r.badge}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-5 md:mb-6">
        <div className="bg-[#f8fafc] border border-[#e8edf2] rounded-[10px] p-3 md:p-4">
          <div className="text-[10px] md:text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.4px] mb-2 md:mb-3">3-Month Cost Forecast ($)</div>
          <div style={{ height: 180 }}>
            <Line data={{ labels: ['May', 'Jun (est.)', 'Jul (est.)', 'Aug (est.)'], datasets: [
              { label: 'Patient Cost',   data: [0, 225, 65, 125],  borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,.08)',  tension: 0.4, fill: true, pointRadius: 3 },
              { label: 'Insurance Cost', data: [0, 470, 120, 240], borderColor: '#1d4ed8', backgroundColor: 'rgba(29,78,216,.08)',  tension: 0.4, fill: true, pointRadius: 3 },
            ]}} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: CHART_LEGEND }, scales: { y: { beginAtZero: true } } }} />
          </div>
        </div>
        <div className="bg-[#f8fafc] border border-[#e8edf2] rounded-[10px] p-3 md:p-4">
          <div className="text-[10px] md:text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.4px] mb-2 md:mb-3">Benefit Utilization by Category</div>
          <div style={{ height: 180 }}>
            <Bar data={{ labels: ['Diagnostic', 'Medication', 'Preventive', 'Counseling', 'Mental Health', 'Rehab'], datasets: [
              { label: 'Used',      data: [275, 360, 340, 0, 0, 0],        backgroundColor: '#1d4ed8' },
              { label: 'Available', data: [725, 640, 0, 1200, 3600, 4500], backgroundColor: '#e2e8f0' },
            ]}} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: CHART_LEGEND }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }} />
          </div>
        </div>
      </div>

      {/* Insurance Alerts */}
      <div className="mb-5 md:mb-6">
        <SectionHeader label="Insurance Alerts" color="#d97706" />
        <div className="flex flex-col gap-2.5">
          <div className="bg-[#fffbeb] border border-[#fde68a] border-l-[3px] border-l-[#d97706] rounded-[10px] p-3 md:p-3.5 flex gap-2.5 text-[12px] md:text-[13px] text-[#78350f]">
            <span className="text-base flex-shrink-0 mt-0.5">⚠️</span>
            <div><strong>Deductible Nearly Exhausted</strong> — $920 of $1,500 annual deductible remains. Review upcoming procedure costs and inform patient of potential out-of-pocket balance before visit.</div>
          </div>
          {patient.alerts.length > 0 && (
            <div className="bg-[#fff8f8] border border-[#fecaca] border-l-[3px] border-l-[#dc2626] rounded-[10px] p-3 md:p-3.5 flex gap-2.5 text-[12px] md:text-[13px] text-[#7f1d1d]">
              <span className="text-base flex-shrink-0 mt-0.5">🚨</span>
              <div><strong>Active Alert</strong> — {patient.alerts.join(' · ')}</div>
            </div>
          )}
        </div>
      </div>

      {/* Action Items */}
      <div>
        <SectionHeader label="Action Items for Patient" color="#dc2626" />
        <div className="flex flex-col gap-2">
          {[
            { icon: '🚨', title: 'Verify pre-authorization status before appointment',    sub: `Current status: ${patient.preAuth}. Confirm all required authorizations are submitted.`,                        due: 'URGENT',  dueDate: 'Before visit', cardBg: '#fff8f8', cardBorder: '#fecaca', barColor: '#dc2626', dueColor: '#dc2626' },
            { icon: '💬', title: 'Notify patient of projected out-of-pocket balance',     sub: 'Deductible ($920) may be exhausted by upcoming procedures. Financial counseling recommended.',                   due: 'Soon',    dueDate: 'Before visit', cardBg: '#fffbeb', cardBorder: '#fde68a', barColor: '#d97706', dueColor: '#d97706' },
            { icon: '🔁', title: 'Schedule preventive wellness visit before Dec 31',      sub: '1 wellness visit remaining in 2026 — fully covered ($0 copay). Skipping forfeits the benefit.',                 due: 'Routine', dueDate: 'By Dec 31',    cardBg: '#f0f9ff',  cardBorder: '#bae6fd', barColor: '#0891b2', dueColor: '#94a3b8' },
            { icon: '📂', title: 'Review insurance benefit optimization opportunities',   sub: 'Ensure all available covered benefits are being utilized before year-end reset.',                                due: 'Info',    dueDate: 'Ongoing',      cardBg: '#f0f9ff',  cardBorder: '#bae6fd', barColor: '#0891b2', dueColor: '#94a3b8' },
          ].map((item, i) => (
            <div key={i}
              style={{ opacity: 0, animation: 'pdSlide 0.38s ease forwards', animationDelay: `${i * 0.07}s`, background: item.cardBg, borderColor: item.cardBorder, borderLeftColor: item.barColor }}
              className="flex items-start gap-2.5 md:gap-3 rounded-[10px] p-3 md:p-3.5 border border-l-[3px] shadow-sm"
            >
              <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] md:text-[13px] font-semibold text-[#1e293b]">{item.title}</div>
                <div className="text-[11px] md:text-[12px] text-[#475569] mt-0.5 leading-[1.5]">{item.sub}</div>
              </div>
              <div className="text-[10px] md:text-[11px] font-bold ml-auto text-right flex-shrink-0 whitespace-nowrap" style={{ color: item.dueColor }}>
                {item.due}<br /><span className="font-normal text-[#94a3b8]">{item.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: Treatment & Claims ────────────────────────────────────────────────
function RecordsCharts() {
  const MONTHS6 = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
  return (
    <div className="mb-5 md:mb-6">
      <SectionHeader label="Cost & Insurance Overview" color="#1d4ed8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
        <div className="bg-[#f8fafc] border border-[#e8edf2] rounded-[10px] p-3 md:p-4">
          <div className="text-[10px] md:text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.4px] mb-2 md:mb-3">Monthly Spend Trend ($)</div>
          <div style={{ height: 150 }}>
            <Line data={{ labels: MONTHS6, datasets: [
              { label: 'Patient Paid',   data: [0, 95, 150, 340, 0, 0],  borderColor: '#dc2626', tension: 0.4, pointRadius: 2, fill: false },
              { label: 'Insurance Paid', data: [0, 180, 300, 620, 0, 0], borderColor: '#1d4ed8', tension: 0.4, pointRadius: 2, fill: false },
            ]}} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: CHART_LEGEND }, scales: { y: { beginAtZero: true } } }} />
          </div>
        </div>
        <div className="bg-[#f8fafc] border border-[#e8edf2] rounded-[10px] p-3 md:p-4">
          <div className="text-[10px] md:text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.4px] mb-2 md:mb-3">Treatment Cost Breakdown</div>
          <div style={{ height: 150 }}>
            <Doughnut data={{ labels: ['Exam', 'Treatment', 'Medication', 'Follow-up'], datasets: [{ data: [180, 420, 360, 95], backgroundColor: ['#1d4ed8', '#0f766e', '#d97706', '#dc2626'], borderWidth: 2, borderColor: '#fff' }] }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: CHART_LEGEND }, cutout: '60%' } as any} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-[#f8fafc] border border-[#e8edf2] rounded-[10px] p-3 md:p-4">
          <div className="text-[10px] md:text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.4px] mb-2 md:mb-3">Claim History — Paid vs. Patient Cost ($)</div>
          <div style={{ height: 150 }}>
            <Bar data={{ labels: ['CLM-230814', 'CLM-231105', 'CLM-240122', 'CLM-240310'], datasets: [
              { label: 'Insurance Paid', data: [0, 180, 300, 620], backgroundColor: '#1d4ed8' },
              { label: 'Patient Paid',   data: [0, 95, 150, 340],  backgroundColor: '#0f766e' },
            ]}} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: CHART_LEGEND }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }} />
          </div>
        </div>
        <div className="bg-[#f8fafc] border border-[#e8edf2] rounded-[10px] p-3 md:p-4">
          <div className="text-[10px] md:text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.4px] mb-2 md:mb-3">Insurance Benefit Usage</div>
          <div style={{ height: 150 }}>
            <Bar data={{ labels: ['Deductible Used', 'Benefits Used', 'Benefit Limit'], datasets: [
              { label: 'Used',      data: [580, 1250, 0],      backgroundColor: '#1d4ed8' },
              { label: 'Remaining', data: [920, 48750, 50000], backgroundColor: '#e2e8f0' },
            ]}} options={{ indexAxis: 'y' as const, responsive: true, maintainAspectRatio: false, plugins: { legend: CHART_LEGEND }, scales: { x: { stacked: true }, y: { stacked: true } } }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Tab3Content({ patient }: { patient: Patient }) {
  const apptDate = new Date(patient.time.replace(' ', 'T'));
  const statusVariant = patient.status === 'In Chair' ? 'green' : patient.status === 'Waiting' ? 'yellow' : patient.status === 'Completed' ? 'gray' : 'blue';
  const preAuthVariant = patient.preAuth === 'Approved' ? 'green' : patient.preAuth === 'Pending' ? 'yellow' : (patient.preAuth === 'Not Req.' || patient.preAuth === 'N/A') ? 'green' : 'blue';

  return (
    <div className="px-4 py-5 md:px-8 md:py-7">
      <RecordsCharts />

      {/* Appointment + Insurance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-5 md:mb-6">
        <div>
          <SectionHeader label="Upcoming Appointment" color="#0f766e" />
          <ETable headers={[]} rows={[
            [<span className="text-[9px] md:text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.4px]">Date</span>,      <strong className="text-[#1e293b]">{apptDate.toISOString().slice(0, 10)}</strong>],
            [<span className="text-[9px] md:text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.4px]">Provider</span>,  'Dr. Seungah Kang'],
            [<span className="text-[9px] md:text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.4px]">Procedure</span>, patient.procedure],
            [<span className="text-[9px] md:text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.4px]">Facility</span>,  'Main Campus, Room 204'],
            [<span className="text-[9px] md:text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.4px]">Status</span>,    <Pill label={patient.status} variant={statusVariant} />],
          ]} />
        </div>
        <div>
          <SectionHeader label="Insurance Detail" color="#0f766e" />
          <ETable headers={[]} rows={[
            [<span className="text-[9px] md:text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.4px]">Insurance</span>,         patient.insurance],
            [<span className="text-[9px] md:text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.4px]">Deductible</span>,        <span>$1,500 <span className="ml-1"><Pill label="$920 left" variant="yellow" /></span></span>],
            [<span className="text-[9px] md:text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.4px]">Copay</span>,             '$35'],
            [<span className="text-[9px] md:text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.4px]">Benefit Limit</span>,    '$50,000 / year'],
            [<span className="text-[9px] md:text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.4px]">Pre-Auth</span>,         <Pill label={patient.preAuth} variant={preAuthVariant} />],
          ]} />
        </div>
      </div>

      {/* Treatment Plan */}
      <div className="mb-5 md:mb-6">
        <SectionHeader label="Treatment Plan" color="#0f766e" />
        <ETable
          headers={['#', 'Procedure', 'Phase', 'Priority', 'Est. Cost', 'Provider', 'Status']}
          rows={[
            [1, patient.procedure, patient.category, <Pill label="High" variant="red" />, patient.cost, 'Dr. Seungah Kang', <Pill label="Planned" variant="blue" />],
            [2, 'Follow-up Consultation', 'Follow-up', <Pill label="Medium" variant="yellow" />, '$95', 'Dr. Seungah Kang', <Pill label="Scheduled" variant="blue" />],
          ]}
        />
      </div>

      {/* Treatment + Claim history */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-5 md:mb-6">
        <div>
          <SectionHeader label="Treatment History" color="#0f766e" />
          <ETable
            headers={['Date', 'Procedure', 'Outcome']}
            rows={[
              ['2026-03-10', 'Annual Physical',    <Pill label="Normal"    variant="green"  />],
              ['2026-01-22', 'BP Check + Consult', <Pill label="Follow-up" variant="yellow" />],
              ['2025-11-05', 'Dental Cleaning',    <Pill label="Completed" variant="green"  />],
              ['2025-08-14', 'X-Ray Review',       <Pill label="Normal"    variant="green"  />],
            ]}
          />
        </div>
        <div>
          <SectionHeader label="Claim History" color="#0f766e" />
          <ETable
            headers={['Claim ID', 'Amount', 'Status']}
            rows={[
              ['CLM-240310', '$340', <Pill label="Paid"    variant="green" />],
              ['CLM-240122', '$150', <Pill label="Paid"    variant="green" />],
              ['CLM-231105', '$95',  <Pill label="Paid"    variant="green" />],
              ['CLM-230814', '$0',   <Pill label="Covered" variant="gray"  />],
            ]}
          />
        </div>
      </div>

      {/* Physician's Notes */}
      <div>
        <SectionHeader label="Physician's Notes" color="#475569" />
        <div className="bg-[#f8fafc] border border-[#e8edf2] rounded-[10px] p-3 md:p-4 text-[12px] md:text-[13px] text-[#475569] whitespace-pre-line leading-[1.7] min-h-[80px]">
          {`Patient presents for scheduled ${patient.procedure}. Insurance: ${patient.insurance}. Pre-authorization: ${patient.preAuth}.\n\nRecommend standard treatment protocol. Review deductible status and confirm patient awareness of any out-of-pocket costs before proceeding.\n\n${patient.alerts.length > 0 ? 'AI flagged alert: ' + patient.alerts.join(', ') + '.' : 'No active alerts flagged by AI.'}`}
        </div>
      </div>
    </div>
  );
}

// ─── Patient AI Agent chat ────────────────────────────────────────────────────
function PatientAIAgent({ patient }: { patient: Patient }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; content: string; isTyping?: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const firstName = patient.name.split(' ')[0];

  const PAI_RESPONSES = [
    { match: ['deductible', 'out-of-pocket', 'oop', 'balance'],
      reply: `<p><strong>Deductible Status — ${patient.name}</strong></p><ul><li>Annual deductible: <strong>$1,500</strong></li><li>Amount used: <strong>$580</strong></li><li>Remaining: <strong>$920</strong></li></ul><p>⚠️ Upcoming procedure cost (${patient.cost}) may approach the remaining balance.</p>` },
    { match: ['pre-auth', 'pre auth', 'authorization', 'auth'],
      reply: `<p><strong>Pre-Authorization — ${patient.name}</strong></p><ul><li>Current status: <strong>${patient.preAuth}</strong></li><li>Insurance: ${patient.insurance}</li></ul><p>Verify all required authorizations are submitted before the scheduled appointment.</p>` },
    { match: ['procedure', 'scheduled', 'upcoming', 'appointment'],
      reply: `<p><strong>Upcoming Appointment — ${patient.name}</strong></p><ul><li>📅 <strong>${patient.procedure}</strong></li><li>Category: ${patient.category}</li><li>Estimated cost: ${patient.cost}</li><li>Status: ${patient.status}</li></ul>` },
    { match: ['risk', 'flag', 'alert', 'concern'],
      reply: `<p><strong>Risk Flags — ${patient.name}</strong></p><ul>${patient.alerts.length > 0 ? patient.alerts.map(a => `<li>⚠️ ${a}</li>`).join('') : '<li>No critical risk flags at this time.</li>'}</ul>` },
    { match: ['benefit', 'optimize', 'saving', 'coverage'],
      reply: `<p><strong>Benefit Optimization — ${patient.name}</strong></p><ul><li>Insurance: ${patient.insurance}</li><li>Ensure all covered benefits are utilized before year-end</li><li>Consider bundling procedures to minimize copay triggers</li></ul>` },
    { match: ['history', 'past', 'previous', 'prior'],
      reply: `<p><strong>Treatment History — ${patient.name}</strong></p><ul><li>2026-03-10 — Annual Physical → Normal</li><li>2026-01-22 — Follow-up Consult → Follow-up required</li><li>2025-11-05 — Dental Cleaning → Completed</li><li>2025-08-14 — X-Ray Review → Normal</li></ul>` },
  ];

  const PAI_FALLBACK = `<p>I can help with information about <strong>${patient.name}</strong>. Try asking about:</p><ul><li>Deductible status and out-of-pocket costs</li><li>Pre-authorization requirements</li><li>Upcoming procedures</li><li>Risk flags and alerts</li></ul>`;

  const sendMessage = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || isTyping) return;
    if (!started) setStarted(true);
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setInput('');
    setIsTyping(true);
    setMessages(prev => [...prev, { role: 'agent', content: '', isTyping: true }]);
    setTimeout(() => {
      const lower = q.toLowerCase();
      const match = PAI_RESPONSES.find(r => r.match.some(k => lower.includes(k)));
      const reply = match ? match.reply : PAI_FALLBACK;
      setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: 'agent', content: reply }; return u; });
      setIsTyping(false);
      setTimeout(() => chatInputRef.current?.focus(), 50);
    }, 1000);
  };

  const SUGGESTIONS = [
    `${firstName}'s deductible?`,
    'Pre-auth needed?',
    'Upcoming procedures',
    'Risk flags',
    'Optimize benefits',
    'Treatment history',
  ];

  const inputBox = (ref?: React.RefObject<HTMLTextAreaElement | null>) => (
    <textarea
      ref={ref}
      className="flex-1 border border-[#e8edf2] rounded-[10px] px-3 py-2.5 text-[12px] md:text-[13px] text-[#1e293b] bg-[#f8fafc] outline-none resize-none min-h-[42px] max-h-[100px] font-[inherit] leading-[1.5] transition-all focus:border-[#0f2d55] focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,45,85,0.1)]"
      rows={1}
      placeholder={`Ask about ${firstName}...`}
      value={input}
      onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
    />
  );

  const sendBtn = (
    <button
      className="w-9 h-9 md:w-10 md:h-10 rounded-[10px] border-none text-white cursor-pointer flex-shrink-0 flex items-center justify-center text-sm transition-opacity hover:opacity-85 disabled:opacity-35 disabled:cursor-default"
      style={{ background: 'linear-gradient(135deg, #0f2d55, #1a4a80)' }}
      onClick={() => sendMessage()}
      disabled={isTyping || !input.trim()}
    >
      ➤
    </button>
  );

  if (!started) {
    return (
      <div className="flex flex-col" style={{ minHeight: 400 }}>
        <div className="flex-1 flex flex-col items-center justify-start px-4 md:px-8 py-7">
          <div className="text-2xl md:text-3xl text-[#0f766e] mb-2">✦</div>
          <div className="text-[15px] md:text-[17px] font-semibold text-[#1e293b] mb-1.5">Ask about {patient.name}</div>
          <div className="text-[12px] md:text-[13px] text-[#94a3b8] max-w-[440px] text-center leading-[1.6] mb-4">
            Get instant answers about this patient's insurance, treatment plan, deductible status, and risk flags.
          </div>
          <div className="flex gap-2 items-end w-full max-w-[600px] mb-4">{inputBox()}{sendBtn}</div>
          <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center max-w-[600px]">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                className="bg-white border border-[#e8edf2] rounded-full px-3 md:px-4 py-1 md:py-1.5 text-[10px] md:text-[11px] font-medium text-[#475569] cursor-pointer whitespace-nowrap transition-all hover:bg-[#f0f9ff] hover:border-[#0f2d55] hover:text-[#0f2d55]"
                onClick={() => sendMessage(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: 480 }}>
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 flex flex-col gap-3 md:gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 items-start max-w-full md:max-w-[800px] ${msg.role === 'user' ? 'flex-row-reverse self-end' : ''}`}>
            <div
              className="w-[26px] h-[26px] md:w-[28px] md:h-[28px] rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-[10px] md:text-[11px]"
              style={{ background: msg.role === 'agent' ? 'linear-gradient(135deg, #0f766e, #0f2d55)' : 'linear-gradient(135deg, #0f2d55, #1a4a80)' }}
            >
              {msg.role === 'agent' ? '✦' : 'SK'}
            </div>
            <div
              className={`px-3 md:px-[15px] py-2.5 md:py-[11px] rounded-xl text-[12px] md:text-[13px] leading-[1.65] max-w-[85%] md:max-w-[660px] ${msg.role === 'agent' ? 'bg-[#f8fafc] border border-[#e8edf2] text-[#1e293b] rounded-tl-[4px]' : 'text-white rounded-tr-[4px]'}`}
              style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #0f2d55, #1a4a80)' } : undefined}
            >
              {msg.isTyping ? (
                <div className="flex items-center gap-1.5 py-1">
                  {[0, 1, 2].map(j => <span key={j} className="w-[6px] h-[6px] md:w-[7px] md:h-[7px] rounded-full bg-[#94a3b8] inline-block" style={{ animation: 'bounce 1.2s infinite ease-in-out', animationDelay: `${j * 0.2}s` }} />)}
                  <style>{`@keyframes bounce{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}`}</style>
                </div>
              ) : msg.role === 'agent' ? (
                <div className="[&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:mt-1.5 [&_ul]:ml-4 [&_li]:mb-1 [&_strong]:font-semibold" dangerouslySetInnerHTML={{ __html: msg.content }} />
              ) : msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-[#e8edf2] px-4 md:px-8 py-3 flex gap-2 items-end bg-white">
        {inputBox(chatInputRef)}{sendBtn}
      </div>
    </div>
  );
}

// ─── Animations + print ───────────────────────────────────────────────────────
const ANIM_STYLE = `
  @keyframes pdSlide { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
`;
const PRINT_STYLE = `
  @media print {
    @page { size: A4; margin: 12mm 14mm; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { background: #fff !important; }
    .pd-no-print { display: none !important; }
    .pd-print-section { page-break-before: always; padding-top: 12px; }
    .pd-print-section:first-child { page-break-before: avoid; }
  }
`;

// ─── Main export ──────────────────────────────────────────────────────────────
export default function PatientDetail({ patient, onBack }: PatientDetailProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('cost');
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.print();
      setIsPrinting(false);
    }));
  };

  const tabs = [
    { id: 'cost'    as const, icon: '📊', label: 'Cost & Insurance' },
    { id: 'records' as const, icon: '📋', label: 'Treatment & Claims' },
    { id: 'agent'   as const, icon: '✦',  label: 'Ask AI' },
  ];

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const kpiMini = [
    { val: '$920',       label: 'Deductible Left',  sub: 'of $1,500 annual',      color: '#d97706' },
    { val: '$585',       label: 'YTD Paid',         sub: 'Jan – May 2026',         color: '#0f766e' },
    { val: patient.cost, label: 'Next Procedure',   sub: patient.procedure,        color: '#dc2626' },
    { val: '2.5%',       label: 'Benefit Used',     sub: '$1,250 of $50,000',      color: '#0f766e' },
  ];

  return (
    <div className="min-h-screen pb-8 md:pb-12" style={{ background: '#f0f4f8' }}>
      <div className="pd-no-print"><AppBar /></div>
      <style>{ANIM_STYLE + PRINT_STYLE}</style>

      {/* Breadcrumb sub-header */}
      <div className="pd-no-print bg-white border-b border-[#e8edf2] sticky top-[52px] md:top-[56px] z-40">
        <div className="max-w-5xl mx-auto px-4 h-11 md:h-12 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[12px] md:text-[13px]">
            <button onClick={onBack} className="text-[#0f2d55] font-semibold hover:underline cursor-pointer bg-transparent border-none p-0">
              Dashboard
            </button>
            <span className="text-[#94a3b8] text-[11px]">›</span>
            <span className="text-[#1e293b] font-semibold hidden sm:inline">Patient Report</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-[11px] text-[#94a3b8]">Report: {today} · {patient.id}</span>
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 text-[11px] md:text-[12px] font-semibold text-[#475569] px-2.5 md:px-3.5 py-1.5 rounded-lg border border-[#e8edf2] bg-white cursor-pointer hover:border-[#0f2d55] hover:text-[#0f2d55] transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              <span className="hidden md:inline">Print / PDF</span>
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-[11px] md:text-[12px] font-semibold text-white px-2.5 md:px-3.5 py-1.5 rounded-lg cursor-pointer hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #0f2d55, #1a4a80)' }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-2 md:px-4 mt-4 md:mt-6 flex flex-col gap-3 md:gap-4">

        {/* Patient info card — email envelope style */}
        <div
          key={patient.id}
          className="rounded-xl md:rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,45,85,0.10)] border border-[#e8edf2]"
          style={{ opacity: 0, animation: 'pdSlide 0.38s ease forwards' }}
        >
          {/* Navy gradient header */}
          <div className="px-5 py-5 md:px-8 md:py-7" style={{ background: 'linear-gradient(135deg, #0f2d55 0%, #1a4a80 100%)' }}>
            <div className="inline-flex items-center bg-white/10 rounded-lg px-2.5 py-1 md:px-3 md:py-1.5 mb-3 md:mb-4">
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[1px] text-[#7dd3fc]">Patient Medical Report</span>
            </div>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="text-[20px] md:text-[24px] font-light text-white tracking-[-0.5px] leading-tight truncate">{patient.name}</div>
                <div className="text-[11px] md:text-[12px] text-[#93c5fd] mt-1">
                  {patient.id} &nbsp;·&nbsp; DOB: 1982-08-14
                  <span className="hidden sm:inline"> &nbsp;·&nbsp; {patient.insurance}</span>
                </div>
                <div className="hidden md:block text-[11px] text-[#7dd3fc]/70 mt-0.5">
                  COZIDENTAL · 123 W Exchange Pkwy · Allen, TX 75013
                </div>
              </div>
              <div className="w-[44px] h-[44px] md:w-[52px] md:h-[52px] rounded-full bg-white/15 flex items-center justify-center text-[16px] md:text-[20px] font-bold text-white flex-shrink-0 ml-3">
                {patient.initials}
              </div>
            </div>
          </div>

          {/* KPI strip — 2×2 on mobile, 4-col on md+ */}
          <div className="bg-white grid grid-cols-2 md:grid-cols-4">
            {kpiMini.map((k, i) => (
              <div
                key={i}
                className={`text-center px-3 py-3 md:px-6 md:py-4 border-[#e8edf2]
                  ${i % 2 === 0 ? 'border-r md:border-r-0' : ''}
                  ${i < 2 ? 'border-b md:border-b-0' : ''}
                  ${i > 0 ? 'md:border-l' : ''}
                `}
              >
                <div className="text-[17px] md:text-[20px] font-extrabold leading-none" style={{ color: k.color }}>{k.val}</div>
                <div className="text-[10px] md:text-[11px] text-[#64748b] font-medium mt-1">{k.label}</div>
                <div className="text-[9px] md:text-[10px] text-[#94a3b8] mt-0.5 truncate" title={k.sub}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Patient info grid — 2-col mobile, 4-col desktop */}
          <div className="bg-[#f8fafc] border-t border-[#e8edf2] px-4 py-4 md:px-8 md:py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 md:gap-x-6">
              {[
                ['Full Name',        patient.name],
                ['Date of Birth',    '1982-08-14 (43 yrs)'],
                ['Patient ID',       patient.id],
                ['Gender',           'Male'],
                ['Contact',          '(469) 555-0190'],
                ['Insurance ID',     'BCS-9847'],
                ['Payer',            patient.insurance],
                ['Primary Physician','Dr. Seungah Kang'],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="text-[9px] md:text-[10px] text-[#94a3b8] uppercase tracking-[0.4px] font-semibold">{label}</div>
                  <div className="text-[11px] md:text-[13px] font-semibold text-[#1e293b] mt-0.5 truncate" title={value}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab content card */}
        <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,45,85,0.10)] border border-[#e8edf2] bg-white">

          {/* Tab nav — scrollable on mobile */}
          <div className="pd-no-print flex border-b border-[#e8edf2] bg-white px-4 md:px-8 gap-0 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-3 md:py-3.5 text-[11px] md:text-[12px] font-semibold cursor-pointer border-none bg-transparent border-b-[2px] -mb-px transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'text-[#0f2d55] border-[#0f2d55]'
                    : 'text-[#94a3b8] border-transparent hover:text-[#475569] hover:border-[#e8edf2]'
                  }`}
              >
                <span className="text-[12px] md:text-[13px] leading-none">{tab.icon}</span>
                <span className="uppercase tracking-[0.5px]">{tab.label}</span>
              </button>
            ))}
          </div>

          {isPrinting ? (
            <>
              <div className="pd-print-section"><Tab2Content patient={patient} /><Tab1Content /></div>
              <div className="pd-print-section"><Tab3Content patient={patient} /></div>
            </>
          ) : (
            <div key={activeTab}>
              {activeTab === 'cost'    && <><Tab2Content patient={patient} /><Tab1Content /></>}
              {activeTab === 'records' && <Tab3Content patient={patient} />}
              {activeTab === 'agent'   && <PatientAIAgent patient={patient} />}
            </div>
          )}

          {/* Footer */}
          <div className="bg-[#f8fafc] border-t border-[#e8edf2] px-4 py-3.5 md:px-8 md:py-4">
            <div className="flex items-center justify-between">
              <div className="text-[10px] md:text-[11px] text-[#94a3b8]">
                <strong className="text-[#64748b]">COZIDENTAL</strong> &nbsp;·&nbsp; Allen, Texas
                <span className="hidden md:inline"> &nbsp;·&nbsp; General Dentistry · DMD</span>
              </div>
              <div className="text-[10px] md:text-[11px] text-[#cbd5e1] flex items-center gap-1.5">
                <span>🦷</span>
                <span className="hidden sm:inline">COZIDENTAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
