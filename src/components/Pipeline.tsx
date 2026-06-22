'use client';

import React, { useState } from 'react';
import { GripVertical, Plus, Flame, Edit2, Trash2 } from 'lucide-react';
import Modal from './Modal';

const stages = ["Lead", "Proposal", "Negotiation", "Closed"];
const stageTagClass = ["tag-cold", "tag-warm", "tag-hot", "tag-won"];

interface Deal {
  id: number;
  name: string;
  amount: string;
  stage: number;
  winProb: number;
}

export default function Pipeline({ deals, setDeals, role }: { deals: Deal[], setDeals: React.Dispatch<React.SetStateAction<Deal[]>>, role: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealForm, setDealForm] = useState({ name: '', amount: '' });
  const [editingDealId, setEditingDealId] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData("dealId", id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetStage: number) => {
    e.preventDefault();
    const dealIdStr = e.dataTransfer.getData("dealId");
    if (!dealIdStr) return;
    const dealId = parseInt(dealIdStr, 10);
    setDeals(deals.map(d => d.id === dealId ? { ...d, stage: targetStage } : d));
  };

  const handleOpenNewDeal = () => {
    setEditingDealId(null);
    setDealForm({ name: '', amount: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditDeal = (d: Deal) => {
    setEditingDealId(d.id);
    setDealForm({ name: d.name, amount: d.amount });
    setIsModalOpen(true);
  };

  const handleDeleteDeal = (id: number) => {
    if (confirm("Are you sure you want to delete this deal?")) {
      setDeals(deals.filter(d => d.id !== id));
    }
  };

  const handleSaveDeal = () => {
    if (!dealForm.name) return;
    
    if (editingDealId) {
      setDeals(deals.map(d => 
        d.id === editingDealId 
          ? { ...d, name: dealForm.name, amount: dealForm.amount } 
          : d
      ));
    } else {
      setDeals([...deals, {
        id: Date.now(),
        name: dealForm.name,
        amount: dealForm.amount || "₹0",
        stage: 0,
        winProb: Math.floor(Math.random() * 40) + 20
      }]);
    }
    
    setIsModalOpen(false);
    setDealForm({ name: '', amount: '' });
  };

  return (
    <div id="tab-pipeline" className="panel active" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="topbar">
        <h2>Pipeline</h2>
        <button className="btn btn-primary" onClick={handleOpenNewDeal} disabled={role === 'viewer'} title={role === 'viewer' ? "Viewer role cannot add deals" : "New deal"}>
          <Plus size={16} />
          New deal
        </button>
      </div>
      <div className="content" style={{ flex: 1, overflow: 'auto' }}>
        <div className="pipeline" id="pipeline-board">
          {stages.map((s, i) => (
            <div 
              key={s} 
              className="stage"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, i)}
            >
              <div className="stage-title">
                <span>{s}</span>
                <span className="stage-count">{deals.filter(d => d.stage === i).length}</span>
              </div>
              {deals.filter(d => d.stage === i).map(d => (
                <div 
                  key={d.id} 
                  className="deal-card"
                  draggable={role !== 'viewer'}
                  onDragStart={(e) => {
                    if (role === 'viewer') return;
                    handleDragStart(e, d.id);
                  }}
                  style={d.winProb >= 85 ? { borderColor: '#f97316', boxShadow: '0 0 10px rgba(249, 115, 22, 0.1)' } : {}}
                >
                  <div className="deal-name" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {d.name}
                    {d.winProb >= 80 && <span title="High AI Win Probability"><Flame size={14} color="#f97316" /></span>}
                  </div>
                  <div className="deal-amount" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    {d.amount}
                    <span style={{ fontSize: '11px', fontWeight: 600, color: d.winProb >= 80 ? '#f97316' : 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                      AI {d.winProb}%
                    </span>
                  </div>
                  <div className="deal-tag" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: '8px' }}>
                    <span className={`tag ${stageTagClass[i]}`}>{s}</span>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <button className="btn" style={{ padding: '4px', border: 'none', boxShadow: 'none' }} onClick={() => handleOpenEditDeal(d)} disabled={role === 'viewer'} title={role === 'viewer' ? "Viewer role cannot edit deals" : "Edit Deal"}>
                        <Edit2 size={14} color={role === 'viewer' ? "var(--text-tertiary)" : "var(--text-tertiary)"} />
                      </button>
                      <button className="btn" style={{ padding: '4px', border: 'none', boxShadow: 'none' }} onClick={() => handleDeleteDeal(d.id)} disabled={role === 'viewer'} title={role === 'viewer' ? "Viewer role cannot delete deals" : "Delete Deal"}>
                        <Trash2 size={14} color={role === 'viewer' ? "var(--text-tertiary)" : "#ef4444"} />
                      </button>
                      {role !== 'viewer' && <GripVertical size={14} style={{ color: 'var(--text-tertiary)', cursor: 'grab', marginLeft: '4px' }} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDealId ? "Edit Deal" : "New Deal"}>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Deal Name</label>
            <input 
              className="form-input" 
              placeholder="e.g. Acme Corp License"
              value={dealForm.name}
              onChange={e => setDealForm({...dealForm, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input 
              className="form-input" 
              placeholder="e.g. ₹15,000"
              value={dealForm.amount}
              onChange={e => setDealForm({...dealForm, amount: e.target.value})}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveDeal} disabled={!dealForm.name}>
            {editingDealId ? "Save Deal" : "Add Deal"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
