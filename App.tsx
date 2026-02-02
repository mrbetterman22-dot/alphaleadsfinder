import React, { useState } from 'react';
import { View, Lead } from './types';
import { LayoutDashboard, Radio, Users, Settings, Plus, Download, FileSpreadsheet, LogOut, ChevronUp } from 'lucide-react';
import { MOCK_LEADS, MOCK_MONITORS } from './services/mockData';
import { LeadCard } from './components/LeadCard';

// Inline Components for file simplicity

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  isActive: boolean; 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors mb-1 ${
      isActive 
        ? 'bg-primary text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]' 
        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

// Pages

const Dashboard = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { label: 'Active Monitors', value: '12', color: 'text-primary' },
        { label: 'Leads Found (Today)', value: '143', color: 'text-white' },
        { label: 'Pain Points Detected', value: '28', color: 'text-red-500' },
      ].map((stat, i) => (
        <div key={i} className="bg-surface border border-border p-6 rounded-lg">
          <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
          <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
    <div className="bg-surface border border-border rounded-lg p-6 min-h-[300px] flex items-center justify-center text-zinc-600 flex-col gap-4">
      <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
         <Radio size={24} className="text-zinc-700" />
      </div>
      <p>Activity Chart Visualization</p>
    </div>
  </div>
);

const Monitors = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Monitors</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-black px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
        >
          <Plus size={16} />
          Add Monitor
        </button>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-900 text-zinc-500 border-b border-border uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Keyword</th>
              <th className="px-6 py-4 font-medium">City</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Last Check</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MOCK_MONITORS.map((m) => (
              <tr key={m.id} className="hover:bg-zinc-900/50 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{m.keyword}</td>
                <td className="px-6 py-4 text-zinc-400">{m.city}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                    m.status === 'active' 
                      ? 'bg-primary/20 text-primary border border-primary/30' 
                      : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                  }`}>
                    {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-500">{new Date(m.last_check_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                   <button className="text-zinc-400 hover:text-white transition-colors">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-surface border border-border p-6 rounded-lg w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Add New Monitor</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Business Keyword</label>
                <input type="text" placeholder="e.g. Chiropractor" className="w-full bg-black border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary placeholder:text-zinc-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">City/Location</label>
                <input type="text" placeholder="e.g. San Diego, CA" className="w-full bg-black border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary placeholder:text-zinc-700" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm bg-primary text-black font-bold rounded-md hover:bg-primary-hover shadow-lg shadow-primary/20">Create Monitor</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Leads = () => {
  const [activeTab, setActiveTab] = useState<'fresh' | 'pain'>('fresh');
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  const filteredLeads = leads.filter(l => 
    activeTab === 'fresh' ? l.type === 'new_business' : l.type === 'pain_point'
  );

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (activeTab === 'fresh') {
      // Headers for Fresh Opportunities
      csvContent += "Business Name,Rating,Email,Phone\n";
      
      filteredLeads.forEach(lead => {
        const row = [
          `"${lead.business_name}"`,
          lead.rating,
          `"${lead.email || 'N/A'}"`,
          `"${lead.phone || 'N/A'}"`
        ].join(",");
        csvContent += row + "\n";
      });
    } else {
      // Headers for Pain Hunter
      csvContent += "Business Name,Email,Phone,Review,AI Pitch\n";
      
      filteredLeads.forEach(lead => {
        // Clean up review text and pitch for CSV (escape quotes)
        const cleanReview = (lead.review_text || '').replace(/"/g, '""');
        const cleanPitch = (lead.ai_pitch || 'Pitch not generated').replace(/"/g, '""');
        
        const row = [
          `"${lead.business_name}"`,
          `"${lead.email || 'N/A'}"`,
          `"${lead.phone || 'N/A'}"`,
          `"${cleanReview}"`,
          `"${cleanPitch}"`
        ].join(",");
        csvContent += row + "\n";
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const filename = activeTab === 'fresh' ? "fresh_leads.csv" : "pain_points_with_pitch.csv";
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Leads Explorer</h2>
        
        <div className="flex gap-4">
          <div className="flex bg-surface p-1 rounded-lg border border-border">
            <button
              onClick={() => setActiveTab('fresh')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'fresh' ? 'bg-primary text-black shadow-sm font-bold' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Fresh Opportunities
            </button>
            <button
              onClick={() => setActiveTab('pain')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'pain' ? 'bg-red-600 text-white shadow-sm font-bold' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Pain Hunter
            </button>
          </div>

          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-surface hover:bg-zinc-800 text-zinc-300 px-4 py-1.5 rounded-md text-sm font-medium border border-border transition-colors"
          >
            <FileSpreadsheet size={16} className="text-success" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredLeads.map(lead => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        {filteredLeads.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            No leads found for this category yet.
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsPage = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">Account Settings</h2>
    <div className="bg-surface border border-border rounded-lg p-6">
        <div className="space-y-4 max-w-lg">
            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Email Address</label>
                <input disabled value="john@example.com" className="w-full bg-black border border-border rounded-md px-3 py-2 text-zinc-500 cursor-not-allowed" />
            </div>
            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">API Secret Key (for Webhooks)</label>
                <div className="flex gap-2">
                    <input type="password" value="sk_live_xxxxxxxxxxxxx" className="w-full bg-black border border-border rounded-md px-3 py-2 text-white" />
                    <button className="px-3 bg-zinc-800 border border-border rounded-md text-zinc-300 hover:text-white">Regenerate</button>
                </div>
            </div>
            <div className="pt-4">
                <button className="px-4 py-2 bg-primary text-black font-bold rounded-md hover:bg-primary-hover">Save Changes</button>
            </div>
        </div>
    </div>
  </div>
);

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    alert("Logging out...");
  };

  return (
    <div className="flex min-h-screen bg-background text-zinc-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-background flex-shrink-0 flex flex-col fixed h-full z-10">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2 text-white">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-full" />
            </div>
            AlphaLeadsFinder
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            isActive={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
          />
          <SidebarItem 
            icon={Radio} 
            label="My Monitors" 
            isActive={activeView === 'monitors'} 
            onClick={() => setActiveView('monitors')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Leads" 
            isActive={activeView === 'leads'} 
            onClick={() => setActiveView('leads')} 
          />
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-border">
          <div className="relative">
              {isProfileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-0" onClick={() => setIsProfileMenuOpen(false)} />
                    <div className="absolute bottom-full left-0 mb-2 w-full bg-surface border border-border rounded-lg shadow-xl p-1 z-10 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <button 
                            onClick={() => { setActiveView('settings'); setIsProfileMenuOpen(false); }}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-md transition-colors"
                        >
                            <Settings size={14} />
                            Settings
                        </button>
                        <div className="h-px bg-border my-1" />
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
                        >
                            <LogOut size={14} />
                            Log Out
                        </button>
                    </div>
                  </>
              )}
              
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors border ${isProfileMenuOpen ? 'bg-surface border-border' : 'border-transparent hover:bg-surface'}`}
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-black">
                  JD
                </div>
                <div className="text-sm text-left flex-1">
                  <p className="text-white font-medium leading-none">John Doe</p>
                  <p className="text-zinc-500 text-xs mt-1">john@example.com</p>
                </div>
                <ChevronUp size={14} className={`text-zinc-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'monitors' && <Monitors />}
        {activeView === 'leads' && <Leads />}
        {activeView === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}