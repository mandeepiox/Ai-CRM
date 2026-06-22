'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Contacts from '@/components/Contacts';
import Pipeline from '@/components/Pipeline';
import AIAssistant from '@/components/AIAssistant';
import LeadGen from '@/components/LeadGen';
import Tasks, { Task } from '@/components/Tasks';
import Analytics from '@/components/Analytics';

const initialContacts = [
  { id: 1, name: "Priya Sharma", company: "TechNova Inc", status: "hot", email: "priya@technova.io", initials: "PS", bg: "#EEEDFE", color: "#3C3489" },
  { id: 2, name: "Rahul Mehta", company: "GrowthBase", status: "warm", email: "rahul@growthbase.com", initials: "RM", bg: "#E1F5EE", color: "#085041" },
  { id: 3, name: "Sara Chen", company: "DataBridge", status: "cold", email: "sara@databridge.co", initials: "SC", bg: "#FAECE7", color: "#712B13" },
  { id: 4, name: "James Okafor", company: "BuildFlow", status: "won", email: "james@buildflow.io", initials: "JO", bg: "#E6F1FB", color: "#0C447C" },
  { id: 5, name: "Meera Patel", company: "CloudEdge", status: "warm", email: "meera@cloudedge.com", initials: "MP", bg: "#FBEAF0", color: "#72243E" },
];

const initialDeals = [
  { id: 1, name: "TechNova License", amount: "₹22,000", stage: 0, winProb: 65 },
  { id: 2, name: "GrowthBase Pro", amount: "₹8,500", stage: 1, winProb: 40 },
  { id: 3, name: "DataBridge API", amount: "₹14,000", stage: 1, winProb: 75 },
  { id: 4, name: "BuildFlow Suite", amount: "₹31,000", stage: 2, winProb: 90 },
  { id: 5, name: "CloudEdge Pilot", amount: "₹9,000", stage: 3, winProb: 98 },
];

const initialTasks: Task[] = [
  { id: 1, title: "Follow up with Priya Sharma on license pricing", contactName: "Priya Sharma", dueDate: "2026-06-25", priority: "high", completed: false },
  { id: 2, title: "Send welcome email to James Okafor", contactName: "James Okafor", dueDate: "2026-06-26", priority: "medium", completed: false },
  { id: 3, title: "Qualify Sara Chen lead status", contactName: "Sara Chen", dueDate: "2026-06-30", priority: "low", completed: true },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [contacts, setContacts] = useState(initialContacts);
  const [deals, setDeals] = useState(initialDeals);
  const [tasks, setTasks] = useState(initialTasks);
  const [role, setRole] = useState('admin');

  return (
    <div className="shell">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={role} setRole={setRole} />
      
      <div className="main">
        {activeTab === 'dashboard' && <Dashboard onAskAi={() => setActiveTab('ai')} tasks={tasks} />}
        {activeTab === 'contacts' && <Contacts contacts={contacts} setContacts={setContacts} role={role} />}
        {activeTab === 'pipeline' && <Pipeline deals={deals} setDeals={setDeals} role={role} />}
        {activeTab === 'ai' && <AIAssistant />}
        {activeTab === 'leadgen' && (
          <LeadGen onAddContact={(lead: { name: string; company: string; email: string }) => {
            const initials = lead.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
            const palette = [
              { bg: "#EEEDFE", color: "#3C3489" },
              { bg: "#E1F5EE", color: "#085041" },
              { bg: "#FAECE7", color: "#712B13" },
              { bg: "#E6F1FB", color: "#0C447C" },
              { bg: "#FBEAF0", color: "#72243E" },
            ];
            setContacts([...contacts, { 
              id: Date.now(), 
              name: lead.name, 
              company: lead.company || "—", 
              status: "cold", 
              email: lead.email || "—", 
              initials, 
              ...palette[contacts.length % palette.length] 
            }]);
          }} />
        )}
        {activeTab === 'tasks' && <Tasks role={role} contacts={contacts} deals={deals} tasks={tasks} setTasks={setTasks} />}
        {activeTab === 'analytics' && <Analytics role={role} deals={deals} contacts={contacts} />}
      </div>
    </div>
  );
}
