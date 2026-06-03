import { useState, useEffect } from 'react';

function WeatherClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hhmm = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const [time, period] = hhmm.split(' ');

  return (
    <div className="hidden md:flex items-center gap-4">
      <div className="flex flex-col items-center leading-none gap-0.5">
        <div className="flex items-baseline gap-1">
          <span className="text-[17px] font-bold text-[#1e293b] tracking-tight">{time}</span>
          <span className="text-[10px] font-semibold text-[#94a3b8]">{period}</span>
        </div>
        <div className="text-[10px] text-[#94a3b8] font-medium tracking-[0.4px]">
          {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      <div className="w-px h-5 bg-[#e8edf2]" />

      <div className="flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
          <circle cx="14" cy="13" r="7" fill="#f59e0b" opacity="0.95"/>
          <circle cx="20" cy="22" r="6" fill="#cbd5e1" opacity="0.9"/>
          <circle cx="25" cy="23" r="5" fill="#cbd5e1" opacity="0.9"/>
          <circle cx="16" cy="25" r="5" fill="#cbd5e1" opacity="0.85"/>
          <rect x="11" y="22" width="18" height="6" rx="3" fill="#cbd5e1" opacity="0.9"/>
        </svg>
        <div>
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="text-[14px] font-bold text-[#1e293b]">82°F</span>
            <span className="text-[10px] text-[#94a3b8]">Partly Cloudy</span>
          </div>
          <div className="text-[10px] text-[#94a3b8] mt-0.5 tracking-[0.3px]">
            📍 Allen, TX &nbsp;·&nbsp; 💧61% &nbsp;·&nbsp; 🌬 9 mph
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppBar() {
  return (
    <header className="bg-white border-b border-[#e8edf2] sticky top-0 z-50 shadow-[0_1px_3px_rgba(15,45,85,0.06)]">
      <div className="max-w-5xl mx-auto px-4 md:px-8 h-[52px] md:h-[56px] flex items-center justify-between gap-3 md:gap-6">

        {/* Brand */}
        <a href="/" className="flex items-center gap-2 md:gap-3 no-underline flex-shrink-0">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border-[2px] border-[#0f2d55] flex items-center justify-center flex-shrink-0">
            <span className="text-[14px] md:text-[16px] leading-none">🦷</span>
          </div>
          <div>
            <div className="text-[13px] md:text-[15px] font-extrabold tracking-tight leading-none">
              <span className="text-[#0f2d55]">COZI</span>
              <span className="text-[#1e293b]">DENTAL</span>
            </div>
            <div className="hidden sm:block text-[10px] text-[#94a3b8] tracking-[0.4px] mt-0.5">Allen, Texas</div>
          </div>
        </a>

        {/* Center: weather + clock — hidden on mobile */}
        <WeatherClock />

        {/* Right: System Docs + Doctor chip */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {/* System Docs — hidden on small mobile, icon-only on sm */}
          <a
            href="/docs/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-md border border-[#e8edf2] text-[11px] font-semibold text-[#475569] hover:border-[#0f2d55] hover:text-[#0f2d55] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span className="hidden md:inline">System Docs</span>
          </a>

          {/* Doctor chip */}
          <div className="flex items-center gap-2 border-l border-[#e8edf2] pl-2 md:pl-4">
            <div
              className="w-[30px] h-[30px] md:w-[32px] md:h-[32px] rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0f2d55, #1a4a80)' }}
            >
              SK
            </div>
            <div className="hidden md:block">
              <div className="text-[12px] font-semibold text-[#1e293b] leading-tight">Dr. Seungah Kang</div>
              <div className="text-[10px] text-[#94a3b8] leading-tight">General Dentistry · DMD</div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
