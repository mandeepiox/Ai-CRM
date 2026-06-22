'use client';

import React from 'react';
import { Lightbulb, Users, HelpCircle, ShieldCheck } from 'lucide-react';

export default function ExecutiveOverview() {
  const personas = [
    {
      title: "Startup Founder",
      desc: "Needs automated sales outbounds to act as a force multiplier for a small team.",
      benefit: "AI Lead Gen & Email drafts save hours of copywriting every week."
    },
    {
      title: "SMB Sales Manager",
      desc: "Wants to track pipelines visually and understand which deals are lagging.",
      benefit: "Expected weighted value analytics and predictive deal win rates."
    },
    {
      title: "Enterprise VP of Sales",
      desc: "Requires strict security boundaries and strategic revenue assessments.",
      benefit: "Role-based views (RBAC) and automated executive strategy forecasting reports."
    }
  ];

  return (
    <div id="tab-overview" className="panel active" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="topbar">
        <h2>System Vision</h2>
        <span className="ai-badge">
          <Lightbulb size={14} />
          Enterprise Blueprint v1.0
        </span>
      </div>

      <div className="content" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Core Vision Banner */}
        <div style={{ background: 'linear-gradient(135deg, var(--purple-bg) 0%, rgba(99, 102, 241, 0.05) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--purple-text)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={20} />
            Orb CRM Product Vision
          </h3>
          <p style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: 1.6 }}>
            Traditional CRMs act as digital filing cabinets. **Orb CRM** transforms contact management by injecting an active sales agent into everyday workflows. The system automatically finds targeted outbound prospects, scores pipeline win confidence, drafts copywriter-grade follow-ups, and auto-prioritizes to-do lists.
          </p>
        </div>

        {/* Two Column Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="var(--purple)" />
              Executive Summary
            </h4>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.5 }}>
              <li><strong>Modular & Scalable</strong>: Clean React interface mapped to Next.js routes.</li>
              <li><strong>Secure Proxy</strong>: Keeps API inference secret via backend route handling.</li>
              <li><strong>AI-Driven</strong>: Meta-Llama-3 model parses inputs to drive workflow automation.</li>
              <li><strong>RBAC Protection</strong>: Granular controls to lock actions for non-authorized viewers.</li>
            </ul>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={16} color="var(--purple)" />
              Market Problems Addressed
            </h4>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.5 }}>
              <li><strong>Deals Stalling</strong>: Sales reps forget follow-ups (fixed by AI Tasks).</li>
              <li><strong>Copywriting Friction</strong>: Drafting personalized templates is slow (fixed by AI Outbounds).</li>
              <li><strong>Blackbox Pipelines</strong>: Hard to forecast quarterly results (fixed by AI Expected Value Analytics).</li>
            </ul>
          </div>

        </div>

        {/* Customer Personas Section */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="var(--purple)" />
            Target Customer Persona Profiles
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {personas.map((p, idx) => (
              <div key={idx} style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>{p.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, flex: 1 }}>{p.desc}</div>
                <div style={{ fontSize: '11px', color: 'var(--purple-text)', background: 'var(--purple-bg)', padding: '6px 8px', borderRadius: '4px', fontWeight: 500 }}>
                  <strong>Key Value:</strong> {p.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
