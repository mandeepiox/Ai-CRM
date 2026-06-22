'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, CheckSquare, Square, Calendar, User, Loader2 } from 'lucide-react';
import Modal from './Modal';

export interface Task {
  id: number;
  title: string;
  contactName: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

interface ContactsProps {
  id: number;
  name: string;
  company: string;
}

interface DealsProps {
  id: number;
  name: string;
  amount: string;
  stage: number;
}

interface TasksProps {
  role: string;
  contacts: ContactsProps[];
  deals: DealsProps[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function Tasks({ role, contacts, deals, tasks, setTasks }: TasksProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', contactName: '', dueDate: '', priority: 'medium' as 'high' | 'medium' | 'low' });
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleToggleComplete = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const handleSaveTask = () => {
    if (!taskForm.title) return;
    
    setTasks([...tasks, {
      id: Date.now(),
      title: taskForm.title,
      contactName: taskForm.contactName || "—",
      dueDate: taskForm.dueDate || new Date().toISOString().split('T')[0],
      priority: taskForm.priority,
      completed: false
    }]);

    setIsModalOpen(false);
    setTaskForm({ title: '', contactName: '', dueDate: '', priority: 'medium' });
  };

  const handleAiRecommend = async () => {
    setIsAiLoading(true);

    const prompt = `Act as an automated sales assistant. You are reviewing the current deals and contacts in the CRM.
Current Contacts:
${JSON.stringify(contacts.map(c => ({ name: c.name, company: c.company })))}

Current Active Deals:
${JSON.stringify(deals.map(d => ({ name: d.name, amount: d.amount, stage: d.stage })))}

Generate exactly 3 follow-up tasks to secure these deals or build relationships with these contacts.
Return ONLY a valid JSON array of objects. No markdown formatting, no conversational text.
Format:
[
  { "title": "Clear action item description", "contactName": "Full name of the contact from the list", "dueDate": "2026-06-28", "priority": "high" }
]
Use priorities: "high" | "medium" | "low".`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      });
      const data = await res.json();
      
      const rawText = data.reply.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(rawText) as Omit<Task, 'id' | 'completed'>[];
      
      const newTasks = parsed.map((t, idx) => ({
        id: Date.now() + idx,
        title: t.title,
        contactName: t.contactName,
        dueDate: t.dueDate || new Date().toISOString().split('T')[0],
        priority: (t.priority === 'high' || t.priority === 'medium' || t.priority === 'low') ? t.priority : 'medium' as const,
        completed: false
      }));

      setTasks(prev => [...newTasks, ...prev]);
      alert("AI suggested 3 new follow-up tasks!");
    } catch (e) {
      console.error(e);
      alert("Failed to generate task recommendations. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div id="tab-tasks" className="panel active" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="topbar">
        <h2>Task Manager</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn" onClick={handleAiRecommend} disabled={isAiLoading || role === 'viewer'} style={{ border: '1px solid var(--purple)', color: 'var(--purple)' }}>
            {isAiLoading ? (
              <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Sparkles size={16} />
            )}
            AI Suggest Tasks
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} disabled={role === 'viewer'} title={role === 'viewer' ? "Viewer role cannot add tasks" : "New task"}>
            <Plus size={16} />
            New task
          </button>
        </div>
      </div>

      <div className="content" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--purple)' }}>{activeTasks.length}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Active Tasks</div>
          </div>
          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444' }}>{activeTasks.filter(t => t.priority === 'high').length}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>High Priority</div>
          </div>
          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--green-text)' }}>{completedTasks.length}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Completed Tasks</div>
          </div>
        </div>

        {/* Double Column Task List */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', minHeight: '300px' }}>
          
          {/* Active Tasks Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, borderBottom: '2px solid var(--purple)', paddingBottom: '6px', color: 'var(--text-primary)' }}>Active Follow-ups</h3>
            {activeTasks.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', padding: '24px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
                No active follow-ups. Good job!
              </div>
            ) : (
              activeTasks.map(task => (
                <div 
                  key={task.id} 
                  style={{ 
                    background: 'var(--bg-primary)', 
                    padding: '14px', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border)', 
                    borderLeft: `4px solid ${task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : 'var(--blue)'}`,
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '12px',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s'
                  }}
                >
                  <button onClick={() => handleToggleComplete(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '2px', color: 'var(--text-tertiary)' }}>
                    <Square size={18} />
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{task.title}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} />
                        {task.contactName}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                  <button 
                    disabled={role === 'viewer'} 
                    onClick={() => handleDeleteTask(task.id)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#ef4444', opacity: role === 'viewer' ? 0.3 : 0.8 }}
                    title={role === 'viewer' ? "Viewer cannot delete tasks" : "Delete Task"}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Completed Tasks Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, borderBottom: '2px solid var(--border-md)', paddingBottom: '6px', color: 'var(--text-secondary)' }}>Completed</h3>
            {completedTasks.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', padding: '24px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
                No completed tasks yet. Keep moving forward!
              </div>
            ) : (
              completedTasks.map(task => (
                <div 
                  key={task.id} 
                  style={{ 
                    background: 'var(--bg-secondary)', 
                    padding: '14px', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border)', 
                    opacity: 0.7,
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '12px'
                  }}
                >
                  <button onClick={() => handleToggleComplete(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '2px', color: 'var(--purple)' }}>
                    <CheckSquare size={18} />
                  </button>
                  <div style={{ flex: 1, textDecoration: 'line-through' }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>{task.title}</div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      <span>👤 {task.contactName}</span>
                    </div>
                  </div>
                  <button 
                    disabled={role === 'viewer'} 
                    onClick={() => handleDeleteTask(task.id)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#ef4444', opacity: role === 'viewer' ? 0.3 : 0.8 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* Manual Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Custom Task">
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Task Description</label>
            <input 
              className="form-input" 
              placeholder="e.g. Call Priya about custom features"
              value={taskForm.title}
              onChange={e => setTaskForm({...taskForm, title: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Associated Contact</label>
            <select 
              className="form-input"
              value={taskForm.contactName}
              onChange={e => setTaskForm({...taskForm, contactName: e.target.value})}
            >
              <option value="">Select a contact...</option>
              {contacts.map(c => (
                <option key={c.id} value={c.name}>{c.name} ({c.company})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input 
              type="date"
              className="form-input" 
              value={taskForm.dueDate}
              onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select 
              className="form-input"
              value={taskForm.priority}
              onChange={e => setTaskForm({...taskForm, priority: e.target.value as 'high' | 'medium' | 'low'})}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveTask} disabled={!taskForm.title}>
            Save Task
          </button>
        </div>
      </Modal>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
