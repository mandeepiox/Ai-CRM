'use client';

import React from 'react';
import { LayoutDashboard, Users, KanbanSquare, BotMessageSquare, Target } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
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
          className={`nav-item ${activeTab === 'leadgen' ? 'active' : ''}`} 
          onClick={() => setActiveTab('leadgen')}
        >
          <Target />
          AI Lead Gen
        </div>

        <div 
          className={`nav-item ${activeTab === 'ai' ? 'active' : ''}`} 
          onClick={() => setActiveTab('ai')}
        >
          <BotMessageSquare />
          AI Assistant
        </div>
      </div>
      
      <ThemeToggle />
      <div className="sidebar-footer">Orb CRM v0.1</div>
    </div>
  );
}
