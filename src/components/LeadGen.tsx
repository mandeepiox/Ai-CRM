'use client';

import React, { useState } from 'react';
import { Search, Plus, Sparkles, Loader2 } from 'lucide-react';

interface MockLead {
  name: string;
  company: string;
  email: string;
  reason: string;
}

export default function LeadGen({ onAddContact }: { onAddContact: (lead: { name: string; company: string; email: string; reason: string }) => void }) {
  const [target, setTarget] = useState("");
  const [leads, setLeads] = useState<MockLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!target) return;
    setIsLoading(true);
    
    const prompt = `Act as a master sales prospector. The user wants leads for: "${target}".
Generate exactly 3 highly realistic mock leads. 
Return ONLY a valid JSON array of objects. No markdown, no conversational text.
Format:
[
  { "name": "First Last", "company": "Company Name", "email": "email@example.com", "reason": "Why they are a good fit in 1 short sentence" }
]`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      });
      const data = await res.json();
      
      const rawText = data.reply.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(rawText);
      setLeads(parsed);
    } catch (e) {
      console.error(e);
      alert("Failed to generate leads. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCRM = (lead: MockLead, idx: number) => {
    onAddContact(lead);
    setLeads(leads.filter((_, i) => i !== idx));
    alert(`${lead.name} added to Contacts!`);
  };

  return (
    <div id="tab-leadgen" className="panel active" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="topbar">
        <h2>AI Lead Generation</h2>
        <span className="ai-badge">
          <Sparkles size={14} />
          Outbound Agent
        </span>
      </div>
      <div className="content" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Define Target Audience</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>
            Describe your ideal customer profile, and our AI will generate highly targeted mock prospects.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              className="chat-input"
              style={{ flex: 1 }}
              placeholder="e.g., Healthcare CTOs in California..."
              value={target}
              onChange={e => setTarget(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            />
            <button className="btn btn-primary" onClick={handleGenerate} disabled={isLoading || !target}>
              {isLoading ? <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={16} />}
              Generate Leads
            </button>
          </div>
        </div>

        {leads.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {leads.map((lead, i) => (
              <div key={i} style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div className="avatar" style={{ background: 'var(--purple-bg)', color: 'var(--purple-text)' }}>
                    {lead.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lead.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{lead.company}</div>
                  </div>
                </div>
                
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Email:</strong> {lead.email}</div>
                  <div style={{ fontStyle: 'italic', background: 'var(--bg-secondary)', padding: '8px', borderRadius: '4px' }}>&quot;{lead.reason}&quot;</div>
                </div>

                <button className="btn" style={{ width: '100%' }} onClick={() => handleAddToCRM(lead, i)}>
                  <Plus size={16} />
                  Add to CRM
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
