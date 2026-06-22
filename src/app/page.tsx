'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Contacts, { Contact } from '@/components/Contacts';
import Pipeline, { Deal } from '@/components/Pipeline';
import AIAssistant from '@/components/AIAssistant';
import LeadGen from '@/components/LeadGen';
import Tasks, { Task } from '@/components/Tasks';
import Analytics from '@/components/Analytics';
import ExecutiveOverview from '@/components/ExecutiveOverview';
import Support from '@/components/Support';
import Login, { UserProfile } from '@/components/Login';

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

// Apex Global Tenant Initial Mock Data (SaaS isolation)
const initialApexContacts = [
  { id: 101, name: "Vikram Nair", company: "Apex Systems", status: "hot", email: "vikram@apex.io", initials: "VN", bg: "#EEEDFE", color: "#3C3489" },
  { id: 102, name: "Aanya Gupta", company: "Falcon Labs", status: "warm", email: "aanya@falcon.com", initials: "AG", bg: "#E1F5EE", color: "#085041" },
  { id: 103, name: "David Kim", company: "Zenith Retail", status: "cold", email: "david@zenith.co", initials: "DK", bg: "#FAECE7", color: "#712B13" },
];

const initialApexDeals = [
  { id: 101, name: "Apex Cloud Pack", amount: "₹1,50,000", stage: 1, winProb: 80 },
  { id: 102, name: "Zenith Software Bundle", amount: "₹42,000", stage: 0, winProb: 35 },
];

const initialApexTasks: Task[] = [
  { id: 101, title: "Audit security checklist for David Kim", contactName: "David Kim", dueDate: "2026-07-01", priority: "high", completed: false },
  { id: 102, title: "Call Vikram Nair on proposal feedback", contactName: "Vikram Nair", dueDate: "2026-07-02", priority: "medium", completed: false },
];

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Tenant-partitioned datasets
  const [acmeData, setAcmeData] = useState<{ contacts: Contact[], deals: Deal[], tasks: Task[] }>({ contacts: initialContacts, deals: initialDeals, tasks: initialTasks });
  const [apexData, setApexData] = useState<{ contacts: Contact[], deals: Deal[], tasks: Task[] }>({ contacts: initialApexContacts, deals: initialApexDeals, tasks: initialApexTasks });

  // Derive active settings
  const role = currentUser ? currentUser.role : 'viewer';
  const tenant = currentUser ? currentUser.tenant : 'acme';

  const contacts = tenant === 'acme' ? acmeData.contacts : apexData.contacts;
  const deals = tenant === 'acme' ? acmeData.deals : apexData.deals;
  const tasks = tenant === 'acme' ? acmeData.tasks : apexData.tasks;

  const setContacts = (val: React.SetStateAction<Contact[]>) => {
    const updater = (prevContacts: Contact[]) => {
      if (typeof val === 'function') {
        return (val as (prev: Contact[]) => Contact[])(prevContacts);
      }
      return val;
    };

    if (tenant === 'acme') {
      setAcmeData(prev => ({ ...prev, contacts: updater(prev.contacts) }));
    } else {
      setApexData(prev => ({ ...prev, contacts: updater(prev.contacts) }));
    }
  };

  const setDeals = (val: React.SetStateAction<Deal[]>) => {
    const updater = (prevDeals: Deal[]) => {
      if (typeof val === 'function') {
        return (val as (prev: Deal[]) => Deal[])(prevDeals);
      }
      return val;
    };

    if (tenant === 'acme') {
      setAcmeData(prev => ({ ...prev, deals: updater(prev.deals) }));
    } else {
      setApexData(prev => ({ ...prev, deals: updater(prev.deals) }));
    }
  };

  const setTasks = (val: React.SetStateAction<Task[]>) => {
    if (tenant === 'acme') {
      setAcmeData(prev => ({
        ...prev,
        tasks: typeof val === 'function' ? val(prev.tasks) : val
      }));
    } else {
      setApexData(prev => ({
        ...prev,
        tasks: typeof val === 'function' ? val(prev.tasks) : val
      }));
    }
  };

  if (!currentUser) {
    return (
      <Login 
        onLogin={(user) => {
          setCurrentUser(user);
          setActiveTab('dashboard');
        }} 
      />
    );
  }

  return (
    <div className="shell">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser} 
        onLogout={() => {
          setCurrentUser(null);
          setActiveTab('overview');
        }} 
      />
      
      <div className="main">
        {activeTab === 'overview' && <ExecutiveOverview />}
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
        {activeTab === 'support' && <Support role={role} contacts={contacts} />}
      </div>
    </div>
  );
}
