'use client';

import React from 'react';
import { LayoutDashboard, Users, KanbanSquare, BotMessageSquare, Target, CheckSquare, LineChart, Shield } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: string;
  setRole: (role: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab, role, setRole }: SidebarProps) {
  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="logo">Orb <span>CRM</span></div>
      <div className="nav">
        <div 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} 
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard />
          Dashboard
        </div>

        <div 
          className={`nav-item ${activeTab === 'contacts' ? 'active' : ''}`} 
          onClick={() => setActiveTab('contacts')}
        >
          <Users />
          Contacts
        </div>

        <div 
          className={`nav-item ${activeTab === 'pipeline' ? 'active' : ''}`} 
          onClick={() => setActiveTab('pipeline')}
        >
          <KanbanSquare />
          Pipeline
        </div>

        <div 
          className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`} 
          onClick={() => setActiveTab('tasks')}
        >
          <CheckSquare />
          Tasks
        </div>

        <div 
          className={`nav-item ${activeTab === 'leadgen' ? 'active' : ''}`} 
          onClick={() => setActiveTab('leadgen')}
        >
          <Target />
          AI Lead Gen
        </div>

        <div 
          className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} 
          onClick={() => setActiveTab('analytics')}
        >
          <LineChart />
          Analytics
        </div>

        <div 
          className={`nav-item ${activeTab === 'ai' ? 'active' : ''}`} 
          onClick={() => setActiveTab('ai')}
        >
          <BotMessageSquare />
          AI Assistant
        </div>
      </div>
      
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <Shield size={14} color="var(--purple)" />
          <span>Active Role</span>
        </div>
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          className="form-input" 
          style={{ fontSize: '13px', padding: '6px 10px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', outline: 'none', cursor: 'pointer' }}
        >
          <option value="admin">Admin</option>
          <option value="rep">Sales Rep</option>
          <option value="viewer">Viewer (Read-Only)</option>
        </select>
      </div>

      <ThemeToggle />
      <div className="sidebar-footer">Orb CRM v0.2</div>
    </div>
  );
}
