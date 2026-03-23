import React from 'react';
import './SummaryCard.css';

export interface SummaryCardProps {
  label: string;
  count: number;
  color: string;
  textColor: string;
  onClick?: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ label, count, color, textColor, onClick }) => (
  <div
    className={`sc-card${onClick ? ' sc-card--clickable' : ''}`}
    style={{ background: color }}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    aria-label={onClick ? `Scroll to ${label} section` : undefined}
  >
    <span className="sc-count" style={{ color: textColor }}>{count}</span>
    <span className="sc-label" style={{ color: textColor }}>{label}</span>
  </div>
);
