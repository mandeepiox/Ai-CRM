'use client';

import React, { useState } from 'react';
import { Key, Shield, User } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  tenant: string;
  initials: string;
  bg: string;
  color: string;
}

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const quickProfiles: UserProfile[] = [
    {
      name: "Priya Sharma",
      email: "priya@technova.io",
      role: "admin",
      tenant: "acme",
      initials: "PS",
      bg: "#EEEDFE",
      color: "#3C3489"
    },
    {
      name: "Rahul Mehta",
      email: "rahul@growthbase.com",
      role: "rep",
      tenant: "acme",
      initials: "RM",
      bg: "#E1F5EE",
      color: "#085041"
    },
    {
      name: "Vikram Nair",
      email: "vikram@apex.io",
      role: "viewer",
      tenant: "apex",
      initials: "VN",
      bg: "#FAECE7",
      color: "#712B13"
    }
  ];

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Check if entered email matches any quick profiles, else create a default Admin profile
    const matched = quickProfiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      onLogin(matched);
    } else {
      onLogin({
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: "admin",
        tenant: "acme",
        initials: email.slice(0, 2).toUpperCase(),
        bg: "#E6F1FB",
        color: "#0C447C"
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '450px', maxWidth: '90vw', padding: '32px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Orb <span style={{ color: 'var(--purple)' }}>CRM</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Enterprise Multi-Tenant AI Platform</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleFormLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} />
              Email Address
            </label>
            <input 
              type="email"
              required
              className="form-input" 
              placeholder="name@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} />
              Password
            </label>
            <input 
              type="password"
              required
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
            Sign In
          </button>
        </form>

        {/* Separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Or Quick Access</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        {/* Quick Profiles list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {quickProfiles.map((p, idx) => (
            <div 
              key={idx}
              onClick={() => onLogin(p)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '12px', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-md)', 
                cursor: 'pointer',
                background: 'var(--bg-secondary)',
                transition: 'all 0.2s'
              }}
              className="deal-card" // reuse hover effect from deal-card
            >
              <span className="avatar" style={{ background: p.bg, color: p.color }}>{p.initials}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{p.email}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <span className="tag tag-cold" style={{ fontSize: '9px', padding: '2px 6px', background: 'var(--purple-bg)', color: 'var(--purple-text)' }}>
                  {p.tenant === 'acme' ? 'Acme Sales' : 'Apex Global'}
                </span>
                <span className="tag" style={{ fontSize: '9px', padding: '1px 4px', textTransform: 'uppercase', background: p.role === 'admin' ? 'var(--red-bg)' : p.role === 'rep' ? 'var(--amber-bg)' : 'var(--blue-bg)', color: p.role === 'admin' ? 'var(--red-text)' : p.role === 'rep' ? 'var(--amber-text)' : 'var(--blue-text)' }}>
                  {p.role}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <Shield size={12} />
          <span>Role-Based Access Control Active</span>
        </div>

      </div>
    </div>
  );
}
