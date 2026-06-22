'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { Plus, Edit2, Mail, Loader2, Copy, Trash2, MessageSquare } from 'lucide-react';

export interface Contact {
  id: number;
  name: string;
  company: string;
  status: string;
  email: string;
  initials: string;
  bg: string;
  color: string;
}

export default function Contacts({ contacts, setContacts, role }: { contacts: Contact[], setContacts: React.Dispatch<React.SetStateAction<Contact[]>>, role: string }) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', company: '', email: '' });
  
  const [emailDraft, setEmailDraft] = useState({ isOpen: false, text: '', isLoading: false, contactName: '' });

  // Communication logs state (Section 11)
  const [logsModal, setLogsModal] = useState({ isOpen: false, contactId: 0, contactName: '' });
  const [newLog, setNewLog] = useState({ type: 'Call', note: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [interactionLogs, setInteractionLogs] = useState<Record<number, { type: string, note: string, date: string }[]>>({
    1: [
      { type: "Call", note: "Priya requested a pricing sheet. Sent over email.", date: "2026-06-22" },
      { type: "Email", note: "Follow-up email detailing API capabilities.", date: "2026-06-21" }
    ],
    2: [
      { type: "Meeting", note: "Introductory demo call. Rahul is interested in team package.", date: "2026-06-20" }
    ]
  });

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenLogs = (c: Contact) => {
    setLogsModal({ isOpen: true, contactId: c.id, contactName: c.name });
  };

  const handleSaveLog = () => {
    if (!newLog.note) return;
    const currentLogs = interactionLogs[logsModal.contactId] || [];
    setInteractionLogs({
      ...interactionLogs,
      [logsModal.contactId]: [
        { type: newLog.type, note: newLog.note, date: new Date().toISOString().split('T')[0] },
        ...currentLogs
      ]
    });
    setNewLog({ type: 'Call', note: '' });
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setContactForm({ name: '', company: '', email: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: { id: number; name: string; company: string; email: string }) => {
    setEditingId(c.id);
    setContactForm({ name: c.name, company: c.company, email: c.email });
    setIsModalOpen(true);
  };

  const handleDraftEmail = async (c: { name: string; company: string; status: string }) => {
    setEmailDraft({ isOpen: true, text: '', isLoading: true, contactName: c.name });
    try {
      const prompt = `Write a short, punchy, highly personalized outbound sales email to ${c.name} at ${c.company}. Context: They are currently a '${c.status}' lead. Keep it under 100 words. Don't use placeholders like [Your Name], assume I will fill it.`;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
      });
      const data = await res.json();
      setEmailDraft({ isOpen: true, text: data.reply, isLoading: false, contactName: c.name });
    } catch {
      setEmailDraft({ isOpen: true, text: 'Error generating draft.', isLoading: false, contactName: c.name });
    }
  };

  const handleDeleteContact = (id: number) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const handleSaveContact = () => {
    if (!contactForm.name) return;
    
    if (editingId) {
      setContacts(contacts.map(c => 
        c.id === editingId 
          ? { ...c, name: contactForm.name, company: contactForm.company, email: contactForm.email } 
          : c
      ));
    } else {
      const initials = contactForm.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
      const palette = [
        { bg: "#EEEDFE", color: "#3C3489" },
        { bg: "#E1F5EE", color: "#085041" },
        { bg: "#FAECE7", color: "#712B13" },
        { bg: "#E6F1FB", color: "#0C447C" },
        { bg: "#FBEAF0", color: "#72243E" },
      ];
      const p = palette[contacts.length % palette.length];
      
      setContacts([...contacts, { 
        id: Date.now(), 
        name: contactForm.name, 
        company: contactForm.company || "—", 
        status: "cold", 
        email: contactForm.email || "—", 
        initials, 
        ...p 
      }]);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div id="tab-contacts" className="panel active" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="topbar">
        <h2>Contacts</h2>
        <button className="btn btn-primary" onClick={handleOpenNew} disabled={role === 'viewer'} title={role === 'viewer' ? "Viewer role cannot add contacts" : "Add contact"}>
          <Plus size={16} />
          Add contact
        </button>
      </div>
      <div className="content">
        <input 
          className="search-bar" 
          placeholder="Search contacts..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['all', 'hot', 'warm', 'cold', 'won'].map(f => (
            <button 
              key={f} 
              className="btn" 
              style={{ 
                padding: '6px 12px', 
                fontSize: '12px', 
                borderRadius: '6px',
                background: statusFilter === f ? 'var(--purple-bg)' : 'var(--bg-primary)',
                color: statusFilter === f ? 'var(--purple-text)' : 'var(--text-secondary)',
                borderColor: statusFilter === f ? 'var(--purple)' : 'var(--border)'
              }}
              onClick={() => setStatusFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="contact-table-wrapper">
          <table className="contact-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Status</th>
                <th>Email</th>
                <th style={{ width: '110px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="name-cell">
                      <span className="avatar" style={{ background: c.bg, color: c.color }}>{c.initials}</span>
                      {c.name}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.company}</td>
                  <td><span className={`tag tag-${c.status}`}>{c.status}</span></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{c.email}</td>
                  <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                    <button className="btn" style={{ padding: '6px', border: 'none', boxShadow: 'none' }} onClick={() => handleOpenLogs(c)} title="Communication Logs">
                      <MessageSquare size={14} color="var(--purple)" />
                    </button>
                    <button className="btn" style={{ padding: '6px', border: 'none', boxShadow: 'none' }} onClick={() => handleDraftEmail(c)} title="Draft AI Email">
                      <Mail size={14} color="var(--purple)" />
                    </button>
                    <button className="btn" style={{ padding: '6px', border: 'none', boxShadow: 'none' }} onClick={() => handleOpenEdit(c)} disabled={role === 'viewer'} title={role === 'viewer' ? "Viewer role cannot edit contacts" : "Edit Contact"}>
                      <Edit2 size={14} color={role === 'viewer' ? "var(--text-tertiary)" : "var(--text-tertiary)"} />
                    </button>
                    <button className="btn" style={{ padding: '6px', border: 'none', boxShadow: 'none' }} onClick={() => handleDeleteContact(c.id)} disabled={role === 'viewer'} title={role === 'viewer' ? "Viewer role cannot delete contacts" : "Delete Contact"}>
                      <Trash2 size={14} color={role === 'viewer' ? "var(--text-tertiary)" : "#ef4444"} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Contact" : "New Contact"}>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input 
              className="form-input" 
              placeholder="e.g. John Doe"
              value={contactForm.name}
              onChange={e => setContactForm({...contactForm, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Company</label>
            <input 
              className="form-input" 
              placeholder="e.g. Acme Corp"
              value={contactForm.company}
              onChange={e => setContactForm({...contactForm, company: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              className="form-input" 
              placeholder="john@example.com"
              value={contactForm.email}
              onChange={e => setContactForm({...contactForm, email: e.target.value})}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveContact} disabled={!contactForm.name}>
            Save
          </button>
        </div>
      </Modal>

      <Modal isOpen={emailDraft.isOpen} onClose={() => setEmailDraft({ ...emailDraft, isOpen: false })} title={`AI Email Draft for ${emailDraft.contactName}`}>
        <div className="modal-body">
          {emailDraft.isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '20px', color: 'var(--text-secondary)' }}>
              <Loader2 size={24} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
              Drafting personalized email...
            </div>
          ) : (
            <textarea 
              className="form-input" 
              style={{ minHeight: '150px', resize: 'vertical' }}
              value={emailDraft.text}
              onChange={(e) => setEmailDraft({...emailDraft, text: e.target.value})}
            />
          )}
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={() => setEmailDraft({ ...emailDraft, isOpen: false })}>Close</button>
          <button className="btn btn-primary" onClick={() => { navigator.clipboard.writeText(emailDraft.text); alert('Copied to clipboard!'); }} disabled={emailDraft.isLoading}>
            <Copy size={16} />
            Copy to Clipboard
          </button>
        </div>
      </Modal>

      {/* Communication Logs Modal (Section 11) */}
      <Modal isOpen={logsModal.isOpen} onClose={() => setLogsModal({ ...logsModal, isOpen: false })} title={`Communication Logs: ${logsModal.contactName}`}>
        <div className="modal-body" style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px', color: 'var(--text-primary)' }}>Log New Interaction</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <select 
                value={newLog.type} 
                onChange={e => setNewLog({ ...newLog, type: e.target.value })}
                className="form-input" 
                style={{ flex: '0 0 90px', fontSize: '12px', padding: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              >
                <option value="Call">Call</option>
                <option value="Meeting">Meeting</option>
                <option value="Email">Email</option>
              </select>
              <input 
                placeholder="Details of interaction..." 
                value={newLog.note} 
                onChange={e => setNewLog({ ...newLog, note: e.target.value })}
                className="form-input"
                style={{ flex: 1, fontSize: '12px', padding: '4px 8px' }}
                onKeyDown={e => e.key === 'Enter' && handleSaveLog()}
              />
              <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={handleSaveLog} disabled={!newLog.note}>
                Log
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(interactionLogs[logsModal.contactId] || []).length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '13px', padding: '12px' }}>
                No interaction logs recorded yet.
              </div>
            ) : (
              (interactionLogs[logsModal.contactId] || []).map((log, i) => (
                <div key={i} style={{ padding: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', fontWeight: 600 }}>
                    <span className={`tag tag-${log.type === 'Call' ? 'hot' : log.type === 'Meeting' ? 'warm' : 'cold'}`} style={{ padding: '2px 6px', fontSize: '10px' }}>{log.type}</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>{log.date}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.4 }}>{log.note}</div>
                </div>
              ))
            )}
          </div>

        </div>
        <div className="modal-footer">
          <button className="btn" onClick={() => setLogsModal({ ...logsModal, isOpen: false })}>Close</button>
        </div>
      </Modal>
    </div>
  );
}
