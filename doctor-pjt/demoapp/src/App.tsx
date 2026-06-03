import { useState } from 'react';
import type { BriefingMode, TabId, Patient } from './types';
import { PATIENTS } from './data/patients';
import AppBar from './components/AppBar';
import GreetingSection from './components/GreetingSection';
import ActionItems from './components/ActionItems';
import PatientList from './components/PatientList';
import AskAIAgent from './components/AskAIAgent';
import PatientDetail from './components/PatientDetail';
import DashboardKPIs from './components/DashboardKPIs';

export default function App() {
  const [mode, setMode] = useState<BriefingMode>('daily');
  const [activeTab, setActiveTab] = useState<TabId>('patients');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [kpiFilter, setKpiFilter] = useState<string | null>(null);

  if (selectedPatient) {
    return <PatientDetail patient={selectedPatient} onBack={() => setSelectedPatient(null)} />;
  }

  const modePatients = PATIENTS.filter(p =>
    p.group === (mode === 'daily' ? 'today' : mode === 'weekly' ? 'week' : 'month')
  );

  const scheduleLabel = mode === 'daily' ? "Today's Patients"
    : mode === 'weekly' ? "This Week's"
    : "This Month's";

  const tabs: { id: TabId; label: string; icon: string; badge?: number }[] = [
    { id: 'patients', icon: '🗓️', label: scheduleLabel, badge: modePatients.length },
    { id: 'ai',       icon: '✦',  label: 'Ask AI' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>
      <AppBar />

      <div className="max-w-5xl mx-auto px-2 py-4 md:px-4 md:py-8">
        {/* Email-envelope card */}
        <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,45,85,0.10)] border border-[#e8edf2]">

          {/* Dark navy header */}
          <GreetingSection mode={mode} onModeChange={setMode} />

          {/* KPI bar */}
          <DashboardKPIs
            mode={mode}
            activeFilter={kpiFilter}
            onFilterChange={f => setKpiFilter(f === 'all' ? null : (kpiFilter === f ? null : f))}
          />

          {/* Tab nav */}
          <div className="flex items-center border-b border-[#e8edf2] px-4 md:px-10 bg-white gap-0">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-3 md:py-3.5 text-[11px] md:text-[12px] font-semibold cursor-pointer border-none bg-transparent border-b-[2px] -mb-px transition-colors whitespace-nowrap
                    ${isActive
                      ? 'text-[#0f2d55] border-[#0f2d55]'
                      : 'text-[#94a3b8] border-transparent hover:text-[#475569] hover:border-[#e8edf2]'
                    }`}
                >
                  <span className="text-[12px] md:text-[13px] leading-none">{tab.icon}</span>
                  <span className="uppercase tracking-[0.5px]">{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className={`rounded-full min-w-[18px] md:min-w-[20px] h-[18px] md:h-5 px-1 md:px-1.5 text-[9px] md:text-[10px] font-bold flex items-center justify-center ${
                      isActive ? 'bg-[#0f2d55] text-white' : 'bg-[#f0f4f8] text-[#94a3b8]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="bg-white">
            {activeTab === 'patients' && (
              <>
                <ActionItems mode={mode} onPatientClick={setSelectedPatient} filter={kpiFilter} />
                <div className="border-t border-[#e8edf2]" />
                <PatientList mode={mode} onPatientClick={setSelectedPatient} />
              </>
            )}
            {activeTab === 'ai' && <AskAIAgent />}
          </div>

          {/* Footer */}
          <div className="bg-[#f8fafc] border-t border-[#e8edf2] px-4 py-4 md:px-10 md:py-5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] md:text-[11px] text-[#94a3b8]">
                <strong className="text-[#64748b]">COZIDENTAL</strong> &nbsp;·&nbsp; Allen, Texas
                <span className="hidden sm:inline"> &nbsp;·&nbsp; General Dentistry</span>
                <span className="block mt-0.5 md:mt-1">Dashboard refreshes daily at 7:00 AM</span>
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
