'use client';

import React from 'react';
import { LayoutDashboard, Users, KanbanSquare, BotMessageSquare, Target, CheckSquare, LineChart, Shield, Lightbulb, LifeBuoy, Building, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  tenant: string;
  initials: string;
  bg: string;
  color: string;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout }: SidebarProps) {
  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="logo">Orb <span>CRM</span></div>
      <div className="nav">
        <div 
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} 
          onClick={() => setActiveTab('overview')}
        >
          <Lightbulb />
          System Vision
        </div>

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
          className={`nav-item ${activeTab === 'support' ? 'active' : ''}`} 
          onClick={() => setActiveTab('support')}
        >
          <LifeBuoy />
          Support Portal
        </div>

        <div 
          className={`nav-item ${activeTab === 'ai' ? 'active' : ''}`} 
          onClick={() => setActiveTab('ai')}
        >
          <BotMessageSquare />
          AI Assistant
        </div>
      </div>
      
      {/* Logged-In User Profile Card */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="avatar" style={{ background: currentUser.bg, color: currentUser.color, width: '28px', height: '28px', fontSize: '11px' }}>
            {currentUser.initials}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser.email}
            </div>
          </div>
          <button 
            onClick={onLogout} 
            className="btn" 
            style={{ padding: '6px', border: 'none', background: 'none', boxShadow: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
            title="Sign Out"
          >
            <LogOut size={14} />
          </button>
        </div>
        
        {/* User Badges */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: 'var(--purple-bg)', color: 'var(--purple-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Building size={8} />
            {currentUser.tenant === 'acme' ? 'Acme' : 'Apex'}
          </span>
          <span style={{ 
            fontSize: '9px', 
            fontWeight: 600, 
            padding: '2px 6px', 
            borderRadius: '4px', 
            background: currentUser.role === 'admin' ? 'var(--red-bg)' : currentUser.role === 'rep' ? 'var(--amber-bg)' : 'var(--blue-bg)', 
            color: currentUser.role === 'admin' ? 'var(--red-text)' : currentUser.role === 'rep' ? 'var(--amber-text)' : 'var(--blue-text)',
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px'
          }}>
            <Shield size={8} />
            {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'rep' ? 'Sales Rep' : 'Viewer'}
          </span>
        </div>
      </div>

      <ThemeToggle />
      <div className="sidebar-footer">Orb CRM v0.4</div>
    </div>
  );
}
