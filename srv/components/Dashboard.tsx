'use client';

import React from 'react';
import { Users, IndianRupee, Briefcase, Sparkles, Activity } from 'lucide-react';

interface DashboardProps {
  onAskAi: () => void;
}

export default function Dashboard({ onAskAi }: DashboardProps) {
  const activities = [
    { text: "Priya Sharma viewed proposal", time: "2h ago", dot: true },
    { text: "New contact: James Okafor added", time: "5h ago", dot: true },
    { text: "Deal 'BuildFlow Suite' moved to Negotiation", time: "Yesterday", dot: false },
    { text: "Meera Patel replied to email", time: "Yesterday", dot: false },
  ];

  return (
    <div id="tab-dashboard" className="panel active" style={{ display: 'block' }}>
      <div className="topbar">
        <h2>Dashboard</h2>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>April 2026</span>
      </div>
      <div className="content">
        <div className="stat-grid">
          <div className="stat">
            <div className="stat-header">
              <div className="stat-icon purple"><Users size={18} /></div>
              <span className="stat-trend up">+12%</span>
            </div>
            <div className="stat-num">47</div>
            <div className="stat-label">Total contacts</div>
          </div>
          <div className="stat">
            <div className="stat-header">
              <div className="stat-icon green"><IndianRupee size={18} /></div>
              <span className="stat-trend up">+8.5%</span>
            </div>
            <div className="stat-num" style={{ color: 'var(--green-text)' }}>₹84,000</div>
            <div className="stat-label">Pipeline value</div>
          </div>
          <div className="stat">
            <div className="stat-header">
              <div className="stat-icon blue"><Briefcase size={18} /></div>
              <span className="stat-trend down">-2%</span>
            </div>
            <div className="stat-num" style={{ color: 'var(--blue-text)' }}>6</div>
            <div className="stat-label">Active deals</div>
          </div>
        </div>

        <div className="activity-card">
          <div className="activity-card-title">
            <Activity size={18} color="var(--purple)" />
            Recent activity
          </div>
          <div id="activity-list">
            {activities.map((a, i) => (
              <div key={i} className="activity-row">
                <div className="activity-content">
                  {a.dot ? <div className="activity-dot" /> : <div className="activity-dot" style={{ background: 'var(--border-md)' }} />}
                  <span>{a.text}</span>
                </div>
                <span className="activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '14px' }} onClick={onAskAi}>
          <Sparkles size={16} />
          Ask AI Assistant
        </button>
      </div>
    </div>
  );
}
