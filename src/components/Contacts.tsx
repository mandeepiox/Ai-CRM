'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { Plus, Edit2, Mail, Loader2, Copy, Trash2 } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  company: string;
  status: string;
  email: string;
  initials: string;
  bg: string;
  color: string;
}

export default function Contacts({ contacts, setContacts }: { contacts: Contact[], setContacts: React.Dispatch<React.SetStateAction<Contact[]>> }) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', company: '', email: '' });
  
  const [emailDraft, setEmailDraft] = useState({ isOpen: false, text: '', isLoading: false, contactName: '' });

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

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
        <button className="btn btn-primary" onClick={handleOpenNew}>
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
                    <button className="btn" style={{ padding: '6px', border: 'none', boxShadow: 'none' }} onClick={() => handleDraftEmail(c)} title="Draft AI Email">
                      <Mail size={14} color="var(--purple)" />
                    </button>
                    <button className="btn" style={{ padding: '6px', border: 'none', boxShadow: 'none' }} onClick={() => handleOpenEdit(c)} title="Edit Contact">
                      <Edit2 size={14} color="var(--text-tertiary)" />
                    </button>
                    <button className="btn" style={{ padding: '6px', border: 'none', boxShadow: 'none' }} onClick={() => handleDeleteContact(c.id)} title="Delete Contact">
                      <Trash2 size={14} color="#ef4444" />
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
    </div>
  );
}
