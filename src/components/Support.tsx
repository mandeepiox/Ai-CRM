'use client';

import React, { useState } from 'react';
import { Plus, Sparkles, Loader2, Copy, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';

interface Ticket {
  id: string;
  contactName: string;
  subject: string;
  status: 'open' | 'progress' | 'resolved';
  date: string;
}

interface Contact {
  id: number;
  name: string;
  company: string;
}

interface SupportProps {
  role: string;
  contacts: Contact[];
}

export default function Support({ role, contacts }: SupportProps) {
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: "SPT-101", contactName: "Priya Sharma", subject: "License activation code failed", status: "open", date: "2026-06-22" },
    { id: "SPT-102", contactName: "Rahul Mehta", subject: "Invoice mismatch on growth package", status: "progress", date: "2026-06-21" },
    { id: "SPT-103", contactName: "Sara Chen", subject: "Requesting onboarding call setup", status: "resolved", date: "2026-06-19" }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({ contactName: '', subject: '', status: 'open' as 'open' | 'progress' | 'resolved' });
  const [aiDraft, setAiDraft] = useState({ isOpen: false, text: '', isLoading: false, ticketId: '', contactName: '' });

  const handleSaveTicket = () => {
    if (!ticketForm.subject) return;
    
    const nextNum = Math.floor(Math.random() * 900) + 100;
    setTickets([
      {
        id: `SPT-${nextNum}`,
        contactName: ticketForm.contactName || "Anonymous",
        subject: ticketForm.subject,
        status: ticketForm.status,
        date: new Date().toISOString().split('T')[0]
      },
      ...tickets
    ]);

    setIsModalOpen(false);
    setTicketForm({ contactName: '', subject: '', status: 'open' });
  };

  const handleDeleteTicket = (id: string) => {
    if (confirm(`Delete ticket ${id}?`)) {
      setTickets(tickets.filter(t => t.id !== id));
    }
  };

  const handleUpdateStatus = (id: string, nextStatus: 'open' | 'progress' | 'resolved') => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: nextStatus } : t));
  };

  const handleAiSolve = async (t: Ticket) => {
    setAiDraft({ isOpen: true, text: '', isLoading: true, ticketId: t.id, contactName: t.contactName });
    
    const prompt = `Act as a senior customer support representative. A customer named ${t.contactName} submitted ticket ${t.id}.
Subject: "${t.subject}"
Status: "${t.status}"

Write a short, highly professional, polite email response addressing their issue. Be helpful, clear, and keep it under 100 words. Do not use generic placeholders like [Your Name], assume I will sign off.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
      });
      const data = await res.json();
      
      setAiDraft({ isOpen: true, text: data.reply, isLoading: false, ticketId: t.id, contactName: t.contactName });
    } catch {
      setAiDraft({ isOpen: true, text: 'Error generating AI resolution draft.', isLoading: false, ticketId: t.id, contactName: t.contactName });
    }
  };

  return (
    <div id="tab-support" className="panel active" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="topbar">
        <h2>Support Tickets</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} disabled={role === 'viewer'} title={role === 'viewer' ? "Viewer role cannot log tickets" : "Log ticket"}>
          <Plus size={16} />
          New ticket
        </button>
      </div>

      <div className="content" style={{ flex: 1, overflow: 'auto' }}>
        
        {/* Ticket Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle color="#ef4444" size={24} />
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>{tickets.filter(t => t.status === 'open').length}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Open Tickets</div>
            </div>
          </div>
          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Loader2 color="#f59e0b" size={24} style={{ animation: 'spin 3s linear infinite' }} />
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>{tickets.filter(t => t.status === 'progress').length}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>In Progress</div>
            </div>
          </div>
          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 color="var(--green-text)" size={24} />
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>{tickets.filter(t => t.status === 'resolved').length}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Resolved Tickets</div>
            </div>
          </div>
        </div>

        {/* Ticket Table */}
        <div className="contact-table-wrapper">
          <table className="contact-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Contact</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600, color: 'var(--purple)' }}>{t.id}</td>
                  <td>{t.contactName}</td>
                  <td style={{ color: 'var(--text-primary)' }}>{t.subject}</td>
                  <td>
                    <select
                      value={t.status}
                      disabled={role === 'viewer'}
                      onChange={e => handleUpdateStatus(t.id, e.target.value as 'open' | 'progress' | 'resolved')}
                      className="form-input"
                      style={{ 
                        fontSize: '11px', 
                        padding: '2px 6px', 
                        width: '100px',
                        background: t.status === 'open' ? 'var(--red-bg)' : t.status === 'progress' ? 'var(--amber-bg)' : 'var(--green-bg)',
                        color: t.status === 'open' ? 'var(--red-text)' : t.status === 'progress' ? 'var(--amber-text)' : 'var(--green-text)',
                        border: 'none',
                        fontWeight: 600
                      }}
                    >
                      <option value="open">Open</option>
                      <option value="progress">Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{t.date}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                      <button className="btn" style={{ padding: '6px', border: 'none', boxShadow: 'none' }} onClick={() => handleAiSolve(t)} title="AI Draft Reply">
                        <Sparkles size={14} color="var(--purple)" />
                      </button>
                      <button 
                        className="btn" 
                        style={{ padding: '6px', border: 'none', boxShadow: 'none' }} 
                        onClick={() => handleDeleteTicket(t.id)} 
                        disabled={role === 'viewer'} 
                        title={role === 'viewer' ? "Viewer cannot delete tickets" : "Delete Ticket"}
                      >
                        <Trash2 size={14} color={role === 'viewer' ? "var(--text-tertiary)" : "#ef4444"} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* New Ticket Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Customer Ticket">
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Contact Name</label>
            <select 
              className="form-input"
              value={ticketForm.contactName}
              onChange={e => setTicketForm({...ticketForm, contactName: e.target.value})}
            >
              <option value="">Select contact...</option>
              {contacts.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Issue Subject</label>
            <input 
              className="form-input" 
              placeholder="e.g. Database API throwing 500 error"
              value={ticketForm.subject}
              onChange={e => setTicketForm({...ticketForm, subject: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Initial Status</label>
            <select 
              className="form-input"
              value={ticketForm.status}
              onChange={e => setTicketForm({...ticketForm, status: e.target.value as 'open' | 'progress' | 'resolved'})}
            >
              <option value="open">Open</option>
              <option value="progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveTicket} disabled={!ticketForm.subject}>
            Log Ticket
          </button>
        </div>
      </Modal>

      {/* AI Solver Modal */}
      <Modal isOpen={aiDraft.isOpen} onClose={() => setAiDraft({ ...aiDraft, isOpen: false })} title={`AI Support Response: ${aiDraft.ticketId}`}>
        <div className="modal-body">
          {aiDraft.isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '20px', color: 'var(--text-secondary)' }}>
              <Loader2 size={24} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
              Drafting support reply...
            </div>
          ) : (
            <textarea 
              className="form-input" 
              style={{ minHeight: '150px', resize: 'vertical' }}
              value={aiDraft.text}
              onChange={(e) => setAiDraft({...aiDraft, text: e.target.value})}
            />
          )}
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={() => setAiDraft({ ...aiDraft, isOpen: false })}>Close</button>
          <button className="btn btn-primary" onClick={() => { navigator.clipboard.writeText(aiDraft.text); alert('Copied support response!'); }} disabled={aiDraft.isLoading}>
            <Copy size={16} />
            Copy Draft
          </button>
        </div>
      </Modal>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
