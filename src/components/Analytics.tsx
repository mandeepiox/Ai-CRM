'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BarChart3, TrendingUp, Sparkles, Loader2, Coins, Target } from 'lucide-react';

interface Deal {
  id: number;
  name: string;
  amount: string;
  stage: number;
  winProb: number;
}

interface Contact {
  id: number;
  name: string;
}

interface AnalyticsProps {
  role: string;
  deals: Deal[];
  contacts: Contact[];
}

const stages = ["Lead", "Proposal", "Negotiation", "Closed"];

export default function Analytics({ role, deals, contacts }: AnalyticsProps) {
  const [aiReport, setAiReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Parse deal amount string to number (e.g. "₹22,000" -> 22000)
  const parseAmount = (amtStr: string): number => {
    const num = parseInt(amtStr.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 0 : num;
  };

  const totalValue = deals.reduce((acc, d) => acc + parseAmount(d.amount), 0);
  const avgWinProb = deals.length > 0 
    ? Math.round(deals.reduce((acc, d) => acc + d.winProb, 0) / deals.length) 
    : 0;

  // Expected Value = Sum(Amount * Win Probability)
  const expectedValue = Math.round(
    deals.reduce((acc, d) => acc + (parseAmount(d.amount) * (d.winProb / 100)), 0)
  );

  // Stage distribution counts
  const stageCounts = stages.map((_, i) => deals.filter(d => d.stage === i).length);
  const maxStageCount = Math.max(...stageCounts, 1);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setAiReport('');

    const prompt = `Act as an expert Chief Revenue Officer (CRO). Analyze the following CRM sales pipeline data:
Current Active Deals:
${JSON.stringify(deals.map(d => ({ name: d.name, amount: d.amount, stageName: stages[d.stage], winProbability: d.winProb + '%' })))}

Key Stats:
- Total Pipeline Value: ₹${totalValue.toLocaleString('en-IN')}
- Expected Weighted Value: ₹${expectedValue.toLocaleString('en-IN')}
- Average Win Probability: ${avgWinProb}%

Please provide a concise, high-level Strategic Sales Forecast report including:
1. **Pipeline Health Assessment**: Outline where the bottlenecks are (e.g. too many in proposals, low velocity).
2. **Top Opportunities**: Highlight the most promising deals to focus on.
3. **Strategic Recommendations**: 2-3 specific, actionable steps to increase the close rate.
Keep the response under 250 words and format it beautifully with bullet points.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setAiReport(data.reply);
      } else {
        setAiReport("Failed to generate strategic analysis: " + (data.error || "Unknown server error."));
      }
    } catch (e) {
      console.error(e);
      setAiReport("Failed to reach AI. Please check your HF token configure.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="tab-analytics" className="panel active" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="topbar">
        <h2>Enterprise Analytics</h2>
        <span className="ai-badge">
          <BarChart3 size={14} />
          Executive Dashboard
        </span>
      </div>

      <div className="content" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Core Financial Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div className="stat" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="stat-label">Total Pipeline Value</span>
              <Coins size={16} color="var(--purple)" />
            </div>
            <div className="stat-num" style={{ color: 'var(--text-primary)', fontSize: '26px' }}>₹{totalValue.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Across {deals.length} deals for {contacts.length} contacts</div>
          </div>

          <div className="stat" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="stat-label">Weighted Expected Value</span>
              <TrendingUp size={16} color="var(--green-text)" />
            </div>
            <div className="stat-num" style={{ color: 'var(--green-text)', fontSize: '26px' }}>₹{expectedValue.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Adjusted for win probability</div>
          </div>

          <div className="stat" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="stat-label">Average Win Confidence</span>
              <Target size={16} color="var(--blue-text)" />
            </div>
            <div className="stat-num" style={{ color: 'var(--blue-text)', fontSize: '26px' }}>{avgWinProb}%</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Average chance of closing deals</div>
          </div>
        </div>

        {/* CSS Chart Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          
          <div style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={16} color="var(--purple)" />
              Deal Distribution by Stage
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stages.map((stage, idx) => {
                const count = stageCounts[idx];
                const pct = Math.round((count / maxStageCount) * 100);
                const stageDeals = deals.filter(d => d.stage === idx);
                const stageVal = stageDeals.reduce((sum, d) => sum + parseAmount(d.amount), 0);

                return (
                  <div key={stage} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                      <span>{stage}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                        {count} {count === 1 ? 'deal' : 'deals'} (₹{stageVal.toLocaleString('en-IN')})
                      </span>
                    </div>
                    <div style={{ background: 'var(--bg-secondary)', height: '14px', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <div 
                        style={{ 
                          width: `${Math.max(pct, 4)}%`, 
                          height: '100%', 
                          background: 'linear-gradient(90deg, var(--purple) 0%, var(--purple-dark) 100%)',
                          borderRadius: '999px',
                          transition: 'width 0.8s ease-out'
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Strategic Forecast Section */}
          <div style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--purple)" />
                AI Revenue & Strategy Forecast
              </h3>
            </div>
            
            {aiReport ? (
              <div className="forecast-box" style={{ flex: 1, overflow: 'auto', fontSize: '13px', lineHeight: 1.6, color: 'var(--text-primary)', background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <ReactMarkdown>{aiReport}</ReactMarkdown>
                <button className="btn" onClick={handleGenerateReport} style={{ marginTop: '12px', fontSize: '12px', width: '100%' }}>
                  Regenerate Report
                </button>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
                <Sparkles size={28} color="var(--purple)" style={{ marginBottom: '12px' }} />
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', maxWidth: '280px' }}>
                  Analyze pipeline metrics and current active deals to draft a strategic revenue report.
                </p>
                <button className="btn btn-primary" onClick={handleGenerateReport} disabled={isLoading || role === 'viewer'} style={{ width: '100%' }}>
                  {isLoading ? (
                    <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    "Generate Forecast"
                  )}
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
