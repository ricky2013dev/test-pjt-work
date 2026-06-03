import { useState, useEffect } from 'react';
import type { BriefingMode } from '../types';

interface GreetingSectionProps {
  mode: BriefingMode;
  onModeChange: (mode: BriefingMode) => void;
}

const MODES = {
  daily: {
    badge: 'Daily Briefing',
    prefix:  'Good morning, ',
    subText: 'You have 8 appointments today. Below are your action items to review before rounds.',
    subHtml: 'You have <strong style="color:#fff">8</strong> appointments today. Below are your action items to review before rounds.',
  },
  weekly: {
    badge: 'Weekly Briefing',
    prefix:  'Weekly summary, ',
    subText: 'You have 34 appointments this week across 5 working days.',
    subHtml: 'You have <strong style="color:#fff">34</strong> appointments this week across 5 working days.',
  },
  monthly: {
    badge: 'Monthly Briefing',
    prefix:  'Monthly summary, ',
    subText: 'You have 127 appointments scheduled this month.',
    subHtml: 'You have <strong style="color:#fff">127</strong> appointments scheduled this month.',
  },
};

const BOLD = 'Dr. Kang';
const DATE_STR = new Date('2026-05-31').toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

const Cursor = () => (
  <span
    className="inline-block w-[2px] h-[1em] bg-white align-middle ml-0.5"
    style={{ animation: 'blink .7s step-end infinite' }}
  />
);

export default function GreetingSection({ mode, onModeChange }: GreetingSectionProps) {
  const m = MODES[mode];
  const fullHeadline = m.prefix + BOLD;

  const [headIndex, setHeadIndex] = useState(fullHeadline.length);
  const [headDone, setHeadDone] = useState(true);

  useEffect(() => {
    setHeadIndex(0);
    setHeadDone(false);
    setSubIndex(0);
    setSubDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setHeadIndex(i);
      if (i >= fullHeadline.length) { clearInterval(id); setHeadDone(true); }
    }, 42);
    return () => clearInterval(id);
  }, [mode]);

  const [subIndex, setSubIndex] = useState(0);
  const [subDone, setSubDone]   = useState(false);

  useEffect(() => {
    if (!headDone) return;
    setSubIndex(0);
    setSubDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setSubIndex(i);
      if (i >= m.subText.length) { clearInterval(id); setSubDone(true); }
    }, 18);
    return () => clearInterval(id);
  }, [headDone, mode]);

  const displayedPrefix = fullHeadline.slice(0, Math.min(headIndex, m.prefix.length));
  const displayedBold   = headIndex > m.prefix.length ? fullHeadline.slice(m.prefix.length, headIndex) : '';

  return (
    <div
      className="px-5 py-6 md:px-10 md:py-8"
      style={{ background: 'linear-gradient(135deg, #0f2d55 0%, #1a4a80 100%)' }}
    >
      {/* Top row: badge + mode switcher */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="inline-flex items-center bg-white/10 rounded-lg px-2.5 py-1 md:px-3 md:py-1.5">
          <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[1px] text-[#7dd3fc]">
            {m.badge}
          </span>
        </div>
        <select
          className="text-[12px] md:text-[13px] font-semibold text-white rounded-lg px-2.5 pr-7 py-1.5 md:px-3.5 md:pr-8 outline-none cursor-pointer appearance-none transition-all flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='white'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
            backgroundSize: 'auto, 10px 6px',
          }}
          value={mode}
          onChange={e => onModeChange(e.target.value as BriefingMode)}
        >
          <option value="daily"   style={{ background: '#0f2d55' }}>Daily Briefing</option>
          <option value="weekly"  style={{ background: '#0f2d55' }}>Weekly Briefing</option>
          <option value="monthly" style={{ background: '#0f2d55' }}>Monthly Briefing</option>
        </select>
      </div>

      {/* Date line */}
      <div className="text-[11px] md:text-[12px] font-medium text-[#93c5fd] tracking-[0.3px] mb-2 md:mb-3">
        <span className="hidden sm:inline">{DATE_STR} &nbsp;·&nbsp; </span>
        <span className="sm:hidden">{new Date('2026-05-31').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &nbsp;·&nbsp; </span>
        COZIDENTAL
      </div>

      {/* Headline with typing animation */}
      <div className="text-[22px] md:text-[28px] font-light text-white tracking-[-0.5px] mb-2 leading-[1.25] min-h-[30px] md:min-h-[36px]">
        <span>{displayedPrefix}</span>
        {displayedBold && <strong className="font-semibold">{displayedBold}</strong>}
        {!headDone && <Cursor />}
      </div>

      {/* Subtitle */}
      <div className="text-[12px] md:text-[14px] text-[#93c5fd]/90 min-h-[20px] md:min-h-[22px]">
        {subDone
          ? <span dangerouslySetInnerHTML={{ __html: m.subHtml }} />
          : <span>{m.subText.slice(0, subIndex)}{subIndex > 0 && !subDone && <Cursor />}</span>
        }
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}
