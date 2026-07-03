import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart as BarIcon, 
  Database, 
  Activity, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Search, 
  SlidersHorizontal, 
  HardDrive, 
  Wallet, 
  Ticket, 
  TrendingDown, 
  Globe, 
  X, 
  Check, 
  RefreshCw, 
  ShieldAlert, 
  Sparkles,
  Award,
  Phone,
  Printer,
  FileSpreadsheet,
  Download,
  Copy,
  Terminal
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie,
  Legend
} from 'recharts';
import { AppState, generateVoucherCode } from '../data';
import { Voucher, Package, Agent, ActiveSession, RouterSite } from '../types';

interface DashboardViewProps {
  state: AppState;
  onStateUpdate: () => void;
  onGoToPortal: () => void;
}

export default function DashboardView({ state, onStateUpdate, onGoToPortal }: DashboardViewProps) {
  // RBAC State
  const [currentRole, setCurrentRole] = useState<'Super Admin' | 'Operator' | 'Agent'>('Super Admin');
  const [currentAgentId, setCurrentAgentId] = useState<string>('agent-1'); // Default Agent if role is 'Agent'

  // Tabs by Role
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Search & Filter state
  const [voucherSearch, setVoucherSearch] = useState('');
  const [voucherFilterStatus, setVoucherFilterStatus] = useState<string>('all');
  const [voucherFilterPackage, setVoucherFilterPackage] = useState<string>('all');

  // Session search
  const [sessionSearch, setSessionSearch] = useState('');

  // Bulk Voucher Generator Form State
  const [bulkQty, setBulkQty] = useState(10);
  const [bulkPkgId, setBulkPkgId] = useState('pkg-daily');
  const [bulkAgentId, setBulkAgentId] = useState<string>('none');
  const [bulkSuccessCount, setBulkSuccessCount] = useState<number | null>(null);

  // Agent Wallet top-up
  const [selectedAgentForTopup, setSelectedAgentForTopup] = useState<Agent | null>(null);
  const [topupAmount, setTopupAmount] = useState<number>(50000);

  // Agent Selling Vouchers (Agent View)
  const [sellingPkgId, setSellingPkgId] = useState('pkg-quick');
  const [soldVoucherDetail, setSoldVoucherDetail] = useState<Voucher | null>(null);
  const [sellError, setSellError] = useState<string | null>(null);

  // System Seed reset
  const [resetSuccess, setResetSuccess] = useState(false);

  // MikroTik script generator states
  const [selectedSiteForScript, setSelectedSiteForScript] = useState('site-bukedea');
  const [hotspotInterface, setHotspotInterface] = useState('ether2-hotspot');
  const [hotspotProfileName, setHotspotProfileName] = useState('Techaus_Hotspot');
  const [serverDnsName, setServerDnsName] = useState('techaus.connect');
  const [copiedScript, setCopiedScript] = useState(false);

  // Get active agent details if Agent role is active
  const activeAgent = useMemo(() => {
    return state.agents.find(a => a.id === currentAgentId) || state.agents[0];
  }, [state.agents, currentAgentId, currentAgentId]);

  // Handle Bulk Generator
  const handleBulkGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkQty <= 0 || bulkQty > 100) return;

    const newVouchers: Voucher[] = [];
    const pkg = state.packages.find(p => p.id === bulkPkgId);
    if (!pkg) return;

    for (let i = 0; i < bulkQty; i++) {
      newVouchers.push({
        code: generateVoucherCode(),
        packageId: bulkPkgId,
        status: 'unused',
        activationTime: null,
        expiryTime: null,
        boundMACs: [],
        phone: null,
        agentId: bulkAgentId === 'none' ? null : bulkAgentId,
        createdTime: new Date().toISOString()
      });
    }

    state.vouchers = [...newVouchers, ...state.vouchers];
    
    // Log Audit
    const agentName = bulkAgentId === 'none' ? 'Admin Inventory' : (state.agents.find(a => a.id === bulkAgentId)?.name || 'Agent');
    state.addLog(
      'Super Admin', 
      'Super Admin Console', 
      'Bulk Vouchers Generated', 
      `Generated ${bulkQty} x ${pkg.name} vouchers assigned to ${agentName}`
    );

    setBulkSuccessCount(bulkQty);
    state.save();
    onStateUpdate();
    setTimeout(() => setBulkSuccessCount(null), 4000);
  };

  // Force Disconnect Session
  const handleForceDisconnect = (sessionId: string) => {
    const session = state.sessions.find(s => s.id === sessionId);
    if (!session) return;

    state.sessions = state.sessions.filter(s => s.id !== sessionId);
    state.addLog(
      currentRole === 'Super Admin' ? 'Super Admin' : 'Operator',
      currentRole === 'Super Admin' ? 'Super Admin Dashboard' : 'Operator Portal',
      'Session Force Disconnected',
      `Manually disconnected active session for MAC: ${session.mac} using voucher: ${session.voucherCode}`
    );
    state.save();
    onStateUpdate();
  };

  // Approve Agent Wallet Topup
  const handleAgentTopup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentForTopup) return;

    const agentIndex = state.agents.findIndex(a => a.id === selectedAgentForTopup.id);
    if (agentIndex === -1) return;

    const oldBalance = state.agents[agentIndex].walletBalance;
    state.agents[agentIndex].walletBalance += topupAmount;

    state.addLog(
      'Super Admin',
      'Super Admin Dashboard',
      'Agent Wallet Topup Approved',
      `Approved ${topupAmount.toLocaleString()} UGX top-up for ${selectedAgentForTopup.name}. Balance increased from ${oldBalance.toLocaleString()} to ${state.agents[agentIndex].walletBalance.toLocaleString()} UGX.`
    );

    setSelectedAgentForTopup(null);
    state.save();
    onStateUpdate();
  };

  // Agent Voucher Sale (Agent View)
  const handleAgentSellVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setSellError(null);
    setSoldVoucherDetail(null);

    const pkg = state.packages.find(p => p.id === sellingPkgId);
    if (!pkg) return;

    const agentIndex = state.agents.findIndex(a => a.id === activeAgent.id);
    if (agentIndex === -1) return;

    const agent = state.agents[agentIndex];

    // Deduct cost minus commission.
    // E.g., package price is 10,000 UGX. Agent gets 10% commission.
    // Net deduction is 9,000 UGX.
    const commissionRatio = agent.commissionPercent / 100;
    const discountAmount = pkg.priceUGX * commissionRatio;
    const netDeduction = pkg.priceUGX - discountAmount;

    if (agent.walletBalance < netDeduction) {
      setSellError(`Insufficient wallet balance. You need ${netDeduction.toLocaleString()} UGX (Price: ${pkg.priceUGX.toLocaleString()} minus your ${agent.commissionPercent}% commission). Your balance is ${agent.walletBalance.toLocaleString()} UGX.`);
      return;
    }

    // Generate code
    const voucherCode = generateVoucherCode();
    const newVoucher: Voucher = {
      code: voucherCode,
      packageId: pkg.id,
      status: 'unused',
      activationTime: null,
      expiryTime: null,
      boundMACs: [],
      phone: null,
      agentId: agent.id,
      createdTime: new Date().toISOString()
    };

    // Deduct and add statistics
    state.agents[agentIndex].walletBalance -= netDeduction;
    state.agents[agentIndex].totalSalesUGX += pkg.priceUGX;
    state.agents[agentIndex].totalCommissionUGX += discountAmount;

    state.vouchers = [newVoucher, ...state.vouchers];

    // Record Transaction
    state.transactions.push({
      id: "txn-" + Math.floor(Math.random() * 90000 + 10000),
      phone: "0700000000", // Generic sale
      amountUGX: pkg.priceUGX,
      packageId: pkg.id,
      voucherCode: voucherCode,
      type: 'agent',
      status: 'success',
      timestamp: new Date().toISOString(),
      agentId: agent.id,
      paymentMethod: 'Cash'
    });

    state.addLog(
      'Agent',
      `${agent.name} (${agent.id})`,
      'Voucher Sold (Agent Dashboard)',
      `Sold ${pkg.name} voucher: ${voucherCode}. Cost: ${pkg.priceUGX} UGX. Deducted net wallet: ${netDeduction} UGX.`
    );

    setSoldVoucherDetail(newVoucher);
    state.save();
    onStateUpdate();
  };

  // Re-seed DB helper
  const handleResetSystem = () => {
    state.reset();
    setResetSuccess(true);
    onStateUpdate();
    setTimeout(() => setResetSuccess(false), 2000);
  };

  // ----------------------------------------------------
  // Computations & Analytics for Super Admin Dashboard
  // ----------------------------------------------------
  
  // Vouchers Filtered
  const filteredVouchers = useMemo(() => {
    return state.vouchers.filter(v => {
      const matchSearch = v.code.toLowerCase().includes(voucherSearch.toLowerCase()) || 
                          (v.phone && v.phone.includes(voucherSearch)) ||
                          (v.boundMACs.some(m => m.toLowerCase().includes(voucherSearch.toLowerCase())));
      const matchStatus = voucherFilterStatus === 'all' || v.status === voucherFilterStatus;
      const matchPkg = voucherFilterPackage === 'all' || v.packageId === voucherFilterPackage;
      return matchSearch && matchStatus && matchPkg;
    });
  }, [state.vouchers, voucherSearch, voucherFilterStatus, voucherFilterPackage]);

  // Sessions Filtered
  const filteredSessions = useMemo(() => {
    return state.sessions.filter(s => {
      return s.mac.toLowerCase().includes(sessionSearch.toLowerCase()) || 
             s.voucherCode.toLowerCase().includes(sessionSearch.toLowerCase()) ||
             s.ipAddress.includes(sessionSearch);
    });
  }, [state.sessions, sessionSearch]);

  // Financial Stats
  const revenueStats = useMemo(() => {
    const totalTransactions = state.transactions.filter(t => t.status === 'success');
    const totalRev = totalTransactions.reduce((acc, t) => acc + t.amountUGX, 0);
    const onlineRev = totalTransactions.filter(t => t.type === 'online').reduce((acc, t) => acc + t.amountUGX, 0);
    const agentRev = totalTransactions.filter(t => t.type === 'agent').reduce((acc, t) => acc + t.amountUGX, 0);
    
    // Package stats
    const pkgCounts: { [key: string]: number } = {};
    const pkgRevenue: { [key: string]: number } = {};
    state.packages.forEach(p => {
      pkgCounts[p.name] = 0;
      pkgRevenue[p.name] = 0;
    });

    totalTransactions.forEach(t => {
      const pkg = state.packages.find(p => p.id === t.packageId);
      if (pkg) {
        pkgCounts[pkg.name] = (pkgCounts[pkg.name] || 0) + 1;
        pkgRevenue[pkg.name] = (pkgRevenue[pkg.name] || 0) + t.amountUGX;
      }
    });

    const packagePopularityData = Object.keys(pkgCounts).map(name => ({
      name,
      value: pkgCounts[name],
      revenue: pkgRevenue[name]
    }));

    return {
      totalRev,
      onlineRev,
      agentRev,
      packagePopularityData
    };
  }, [state.transactions, state.packages]);

  // Chart data: Mock sales trend for last 7 days (seeded with real + random transactions)
  const salesTrendData = useMemo(() => {
    const data = [
      { date: 'Jun 26', Sales: 35000, Users: 12 },
      { date: 'Jun 27', Sales: 42000, Users: 15 },
      { date: 'Jun 28', Sales: 58000, Users: 19 },
      { date: 'Jun 29', Sales: 62000, Users: 24 },
      { date: 'Jun 30', Sales: 84000, Users: 31 },
      { date: 'Jul 01', Sales: 98000, Users: 42 },
      { date: 'Jul 02', Sales: revenueStats.totalRev > 100000 ? revenueStats.totalRev - 80000 : 124000, Users: state.sessions.length * 8 + 10 }
    ];
    return data;
  }, [revenueStats, state.sessions.length]);

  // Export mock files helper
  const handleMockExport = (format: 'CSV' | 'XLSX' | 'PDF') => {
    const link = document.createElement("a");
    const content = `TECHAUS CONNECT BILLING SYSTEM - EXPORT\nGenerated: ${new Date().toLocaleString()}\nFormat: ${format}\n\nREVENUE TOTAL: ${revenueStats.totalRev} UGX\nACTIVE SESSIONS: ${state.sessions.length}\nTOTAL VOUCHERS: ${state.vouchers.length}\n`;
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = `techaus_connect_report_${Date.now()}.${format.toLowerCase()}`;
    link.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'unused': return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      case 'used': return 'bg-purple-500/10 text-purple-400 border border-purple-500/30';
      case 'expired': return 'bg-slate-500/10 text-slate-400 border border-slate-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Dashboard Top Header */}
      <header className="sticky top-0 z-40 bg-navy-800 border-b border-navy-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500 rounded-lg text-navy-800">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white font-display">Techaus TBS</h1>
                <span className="px-2 py-0.5 text-[10px] bg-teal-500/20 text-teal-300 font-bold rounded-full border border-teal-500/30">Admin Central</span>
              </div>
              <p className="text-[10px] text-slate-400">Uganda WISP Management Node</p>
            </div>
          </div>

          {/* Role Switching Control (For interactive demo and security review) */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-navy-700">
            <span className="text-[10px] text-slate-500 font-bold uppercase px-2">Access Role:</span>
            {(['Super Admin', 'Operator', 'Agent'] as const).map(role => (
              <button 
                key={role}
                onClick={() => {
                  setCurrentRole(role);
                  setActiveTab('overview');
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${currentRole === role ? 'bg-teal-500 text-navy-800' : 'text-slate-400 hover:text-slate-200'}`}
                id={`role-switch-${role.toLowerCase().replace(' ', '-')}`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a 
              href="/techaus-connect-wisp.zip"
              download="techaus-connect-wisp.zip"
              className="px-3.5 py-1.5 bg-teal-500/10 hover:bg-teal-500/25 text-xs text-teal-400 font-bold rounded-lg border border-teal-500/30 transition flex items-center gap-1.5"
              id="dashboard-source-code-download-btn"
            >
              <Download className="h-3.5 w-3.5 animate-bounce" />
              <span>Download Source ZIP</span>
            </a>

            <button 
              onClick={onGoToPortal}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 font-bold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
              id="go-to-portal-btn"
            >
              <LogOut className="h-3.5 w-3.5" />
              Go to Captive Portal
            </button>
          </div>
        </div>
      </header>

      {/* 2. Sub-Bar: Show current logged in agent details if Role is Agent */}
      {currentRole === 'Agent' && (
        <div className="bg-gradient-to-r from-teal-900/20 to-navy-800/30 border-b border-navy-700 py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Users className="h-4 w-4 text-teal-400" />
              <span>Reseller Storefront: <strong>{activeAgent.name}</strong> ({activeAgent.location})</span>
            </div>
            
            <div className="flex items-center gap-4 text-slate-300">
              <span className="flex items-center gap-1">
                <Wallet className="h-4 w-4 text-emerald-400" />
                <span>My Wallet: <strong className="text-white font-mono">{activeAgent.walletBalance.toLocaleString()} UGX</strong></span>
              </span>
              <span>Commission Level: <strong className="text-teal-400">{activeAgent.commissionPercent}%</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Dashboard Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Navigation Rail */}
        <aside className="md:w-56 shrink-0 flex flex-col gap-1.5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2.5 mb-1">Navigation</p>
          
          {/* Super Admin Nav */}
          {currentRole === 'Super Admin' && (
            <>
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'overview' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <BarIcon className="h-4 w-4" />
                Overview & Stats
              </button>
              <button 
                onClick={() => setActiveTab('vouchers')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'vouchers' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Ticket className="h-4 w-4" />
                Voucher Ledger
              </button>
              <button 
                onClick={() => setActiveTab('sessions')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'sessions' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Activity className="h-4 w-4 animate-pulse" />
                Active Sessions
              </button>
              <button 
                onClick={() => setActiveTab('agents')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'agents' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Users className="h-4 w-4" />
                Reseller Network
              </button>
              <button 
                onClick={() => setActiveTab('health')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'health' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <HardDrive className="h-4 w-4" />
                MikroTik Status
              </button>
              <button 
                onClick={() => setActiveTab('logs')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'logs' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Database className="h-4 w-4" />
                System Audit Logs
              </button>
            </>
          )}

          {/* Operator Nav */}
          {currentRole === 'Operator' && (
            <>
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'overview' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <BarIcon className="h-4 w-4" />
                Overview (Read Only)
              </button>
              <button 
                onClick={() => setActiveTab('vouchers')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'vouchers' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Ticket className="h-4 w-4" />
                Voucher Lookup
              </button>
              <button 
                onClick={() => setActiveTab('sessions')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'sessions' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Activity className="h-4 w-4" />
                Active Sessions
              </button>
              <button 
                onClick={() => setActiveTab('health')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'health' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <HardDrive className="h-4 w-4" />
                Router Uptime
              </button>
              <button 
                onClick={() => setActiveTab('logs')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'logs' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Database className="h-4 w-4" />
                Operator Logs
              </button>
            </>
          )}

          {/* Reseller Agent Nav */}
          {currentRole === 'Agent' && (
            <>
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'overview' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Wallet className="h-4 w-4" />
                My Account
              </button>
              <button 
                onClick={() => setActiveTab('vouchers')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'vouchers' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Ticket className="h-4 w-4" />
                Sell Vouchers
              </button>
              <button 
                onClick={() => setActiveTab('logs')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'logs' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <FileSpreadsheet className="h-4 w-4" />
                My Sales Ledger
              </button>
            </>
          )}
        </aside>

        {/* Content Panel */}
        <main className="flex-1 bg-navy-900 rounded-2xl border border-navy-700/80 p-6 shadow-xl min-w-0">
          
          {/* A. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Header block with Export Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-xl font-black text-white font-display">
                    {currentRole === 'Agent' ? 'My Storefront Overview' : 'Billing System Analytics'}
                  </h2>
                  <p className="text-xs text-slate-400">Real-time usage and financial summaries</p>
                </div>
                
                {currentRole === 'Super Admin' && (
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => handleMockExport('CSV')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] rounded border border-slate-700 transition flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Export CSV
                    </button>
                    <button 
                      onClick={() => handleMockExport('XLSX')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] rounded border border-slate-700 transition flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Excel
                    </button>
                  </div>
                )}
              </div>

              {/* Stat Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Revenue or Balance Box */}
                {currentRole === 'Agent' ? (
                  <div className="bg-slate-950 p-4 rounded-xl border border-navy-700 shadow-md">
                    <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase">
                      <span>Available Balance</span>
                      <Wallet className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-xl font-black text-emerald-400 font-mono mt-2">{activeAgent.walletBalance.toLocaleString()} <span className="text-xs text-slate-400">UGX</span></p>
                    <p className="text-[10px] text-slate-500 mt-1">Prepaid balance for generating cash vouchers</p>
                  </div>
                ) : (
                  <div className="bg-slate-950 p-4 rounded-xl border border-navy-700 shadow-md">
                    <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase">
                      <span>Total Revenue</span>
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-xl font-black text-white font-mono mt-2">
                      {currentRole === 'Super Admin' ? `${revenueStats.totalRev.toLocaleString()} UGX` : '•••••• UGX'}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {currentRole === 'Super Admin' ? 'Sum of all online & agent purchases' : 'Hidden for security'}
                    </p>
                  </div>
                )}

                {/* 2. Active Sessions Box */}
                <div className="bg-slate-950 p-4 rounded-xl border border-navy-700 shadow-md">
                  <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase">
                    <span>Active Sessions</span>
                    <Activity className="h-4 w-4 text-teal-400 animate-pulse" />
                  </div>
                  <p className="text-xl font-black text-white font-mono mt-2">
                    {currentRole === 'Agent' ? state.sessions.filter(s => {
                      const v = state.vouchers.find(vc => vc.code === s.voucherCode);
                      return v && v.agentId === activeAgent.id;
                    }).length : state.sessions.length}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Live connected hotspots users</p>
                </div>

                {/* 3. Vouchers Generated / Commissions Earned */}
                {currentRole === 'Agent' ? (
                  <div className="bg-slate-950 p-4 rounded-xl border border-navy-700 shadow-md">
                    <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase">
                      <span>Total Commissions Earned</span>
                      <Award className="h-4 w-4 text-teal-400" />
                    </div>
                    <p className="text-xl font-black text-white font-mono mt-2">{activeAgent.totalCommissionUGX.toLocaleString()} <span className="text-xs text-slate-400">UGX</span></p>
                    <p className="text-[10px] text-slate-500 mt-1">Accumulated {activeAgent.commissionPercent}% reseller discount</p>
                  </div>
                ) : (
                  <div className="bg-slate-950 p-4 rounded-xl border border-navy-700 shadow-md">
                    <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase">
                      <span>Voucher Count</span>
                      <Ticket className="h-4 w-4 text-teal-400" />
                    </div>
                    <p className="text-xl font-black text-white font-mono mt-2">{state.vouchers.length}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Pre-generated & live voucher codes</p>
                  </div>
                )}

                {/* 4. Network Status / Total Sales */}
                {currentRole === 'Agent' ? (
                  <div className="bg-slate-950 p-4 rounded-xl border border-navy-700 shadow-md">
                    <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase">
                      <span>Gross Sales</span>
                      <TrendingUp className="h-4 w-4 text-teal-400" />
                    </div>
                    <p className="text-xl font-black text-white font-mono mt-2">{activeAgent.totalSalesUGX.toLocaleString()} <span className="text-xs text-slate-400">UGX</span></p>
                    <p className="text-[10px] text-slate-500 mt-1">Total physical vouchers sold to date</p>
                  </div>
                ) : (
                  <div className="bg-slate-950 p-4 rounded-xl border border-navy-700 shadow-md">
                    <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase">
                      <span>Active Sites</span>
                      <Globe className="h-4 w-4 text-teal-400" />
                    </div>
                    <p className="text-xl font-black text-white font-mono mt-2">
                      {state.sites.filter(s => s.status === 'online').length} / {state.sites.length}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">MikroTik hotspot gateways online</p>
                  </div>
                )}
              </div>

              {/* Interactive Charts (Super Admin / Operator view only) */}
              {currentRole !== 'Agent' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Revenue Trend Line */}
                  <div className="lg:col-span-8 bg-slate-950 p-4 rounded-xl border border-navy-700">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Billing and Access Traffic Trend</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00A896" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#00A896" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                          <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                          <YAxis stroke="#94A3B8" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: '#0B1329', borderColor: '#1E293B' }} />
                          <Area type="monotone" dataKey={currentRole === 'Super Admin' ? 'Sales' : 'Users'} stroke="#00A896" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Package Distribution Pie */}
                  <div className="lg:col-span-4 bg-slate-950 p-4 rounded-xl border border-navy-700">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Package Popularity</h3>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={revenueStats.packagePopularityData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {revenueStats.packagePopularityData.map((entry, index) => {
                              const colors = ['#00A896', '#33C2B3', '#1E4E7A', '#12365A', '#0A2540', '#6366F1', '#A855F7'];
                              return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                            })}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#0B1329', borderColor: '#1E293B' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-400 mt-2">
                      {revenueStats.packagePopularityData.map((p, idx) => {
                        const colors = ['#00A896', '#33C2B3', '#1E4E7A', '#12365A', '#0A2540', '#6366F1', '#A855F7'];
                        return (
                          <div key={idx} className="flex items-center gap-1 text-[10px] truncate">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                            <span className="truncate">{p.name} ({p.value})</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ) : (
                /* Agent-Only Dashboard Landing Content */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Guide to Voucher Generation */}
                  <div className="bg-slate-950 p-5 rounded-xl border border-navy-700 space-y-3">
                    <h3 className="text-sm font-bold text-teal-300 font-display">Reseller Quick Sell Guide</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      To sell a voucher to a cash customer:
                    </p>
                    <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 pl-1">
                      <li>Select the desired high-speed package in the Sell menu.</li>
                      <li>Double-check you have enough Wallet balance (we auto-deduct the wholesale price minus your {activeAgent.commissionPercent}% discount).</li>
                      <li>Click <strong>Generate Cash Voucher</strong> to create the secure 12-digit code.</li>
                      <li>Hand the code to the customer or print it out! They can enter it on the Portal to connect immediately.</li>
                    </ol>
                  </div>

                  {/* Quick Profile Stats */}
                  <div className="bg-slate-950 p-5 rounded-xl border border-navy-700 space-y-3 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white font-display">Reseller Level</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Award className="h-8 w-8 text-yellow-500" />
                        <div>
                          <p className="text-xs font-bold text-white">Silver Tier Partner</p>
                          <p className="text-[10px] text-slate-400">Keep balance above 50,000 UGX for high sales ranking</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-navy-700/60 pt-3 text-[11px] text-slate-400 space-y-1.5">
                      <p>Your Support Phone: <strong className="text-white">+256 772 900 801</strong></p>
                      <p>WISP Site: <strong className="text-teal-400">{activeAgent.location}</strong></p>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* B. VOUCHER MANAGER / SELLER TAB */}
          {activeTab === 'vouchers' && (
            <div className="space-y-6">
              
              {/* Conditional UI based on currentRole */}
              {currentRole === 'Agent' ? (
                /* AGENT SELLING VOUCHERS VIEW */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Sell Form */}
                  <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-navy-700 space-y-4">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display">Generate New Customer Voucher</h2>
                    
                    {sellError && (
                      <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-lg">
                        {sellError}
                      </div>
                    )}

                    <form onSubmit={handleAgentSellVoucher} className="space-y-4">
                      
                      {/* Package Select */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Select Hotspot Package</label>
                        <select 
                          value={sellingPkgId}
                          onChange={(e) => {
                            setSellingPkgId(e.target.value);
                            setSellError(null);
                          }}
                          className="w-full px-3 py-2.5 bg-slate-900 border border-navy-600 rounded-lg text-xs text-white font-bold"
                        >
                          {state.packages.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.speed}) — Price: {p.priceUGX.toLocaleString()} UGX
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Display calculations */}
                      {(() => {
                        const p = state.packages.find(pkg => pkg.id === sellingPkgId);
                        if (!p) return null;
                        const commissionAmt = p.priceUGX * (activeAgent.commissionPercent / 100);
                        const netCost = p.priceUGX - commissionAmt;
                        return (
                          <div className="bg-slate-900/60 p-3 rounded-xl border border-navy-700/50 space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Customer Price:</span>
                              <span className="font-bold text-white">{p.priceUGX.toLocaleString()} UGX</span>
                            </div>
                            <div className="flex justify-between text-teal-400">
                              <span>My Commission ({activeAgent.commissionPercent}%):</span>
                              <span>+ {commissionAmt.toLocaleString()} UGX</span>
                            </div>
                            <div className="flex justify-between border-t border-navy-700/60 pt-1.5 text-emerald-400 font-bold">
                              <span>Net Wallet Deduction:</span>
                              <span>{netCost.toLocaleString()} UGX</span>
                            </div>
                          </div>
                        );
                      })()}

                      <button 
                        type="submit"
                        className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-navy-800 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1"
                        id="agent-generate-voucher-btn"
                      >
                        <Plus className="h-4 w-4" />
                        Generate Cash Voucher
                      </button>

                    </form>
                  </div>

                  {/* Right Column: Printed Coupon Visualizer */}
                  <div className="lg:col-span-7 flex flex-col justify-center items-center">
                    {soldVoucherDetail ? (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white text-slate-900 p-6 rounded-2xl w-full max-w-sm border-2 border-dashed border-slate-300 shadow-2xl relative"
                      >
                        {/* Cut corner visual effects */}
                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-navy-900 rounded-full" />
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-navy-900 rounded-full" />

                        <div className="text-center pb-4 border-b-2 border-dashed border-slate-200">
                          <h3 className="text-base font-bold tracking-tight uppercase">Techaus Connect Voucher</h3>
                          <p className="text-[9px] text-slate-500 font-semibold font-display">Internet that works when you need it.</p>
                        </div>

                        {(() => {
                          const p = state.packages.find(pkg => pkg.id === soldVoucherDetail.packageId);
                          return (
                            <div className="py-5 space-y-4 text-center">
                              <div>
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Access Code</p>
                                <p className="text-2xl font-mono font-black text-slate-950 tracking-wider mt-1">{soldVoucherDetail.code}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-left text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div>
                                  <p className="text-[10px] text-slate-400 font-semibold">PACKAGE</p>
                                  <p className="font-bold text-slate-800">{p?.name}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-slate-400 font-semibold">SPEED</p>
                                  <p className="font-bold text-slate-800">{p?.speed}</p>
                                </div>
                                <div className="mt-2">
                                  <p className="text-[10px] text-slate-400 font-semibold">DEVICES LIMIT</p>
                                  <p className="font-bold text-slate-800">{p?.devices} Device(s)</p>
                                </div>
                                <div className="mt-2">
                                  <p className="text-[10px] text-slate-400 font-semibold">VALIDITY</p>
                                  <p className="font-bold text-slate-800">{p ? `${p.durationHours} Hours` : ''}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        <div className="text-center pt-4 border-t-2 border-dashed border-slate-200 text-[10px] text-slate-500 leading-relaxed">
                          <p className="font-bold">Authorized Agent Receipt</p>
                          <p>Moses Okello • Bukedea Storefront</p>
                          <div className="flex items-center justify-center gap-1.5 mt-2">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(soldVoucherDetail.code);
                                alert("Voucher code copied!");
                              }}
                              className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold"
                            >
                              Copy Code
                            </button>
                            <button 
                              onClick={() => window.print()}
                              className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold flex items-center gap-1"
                            >
                              <Printer className="h-3 w-3" />
                              Print
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center p-8 bg-slate-950 rounded-xl border border-navy-700/50 w-full max-w-sm text-slate-400">
                        <Ticket className="h-12 w-12 mx-auto text-slate-600 mb-3" />
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">No active sale coupon</h3>
                        <p className="text-xs text-slate-500 mt-1">Select a package and click generate on the left to spawn a customer coupon here.</p>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                /* SUPER ADMIN / OPERATOR VOUCHER LEDGER VIEW */
                <div className="space-y-6">
                  
                  {/* Voucher bulk generator row (Super Admin only) */}
                  {currentRole === 'Super Admin' && (
                    <div className="p-4 bg-slate-950 rounded-xl border border-navy-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4.5 w-4.5 text-yellow-400" />
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">Bulk Voucher Generator</h3>
                      </div>

                      <form onSubmit={handleBulkGenerate} className="flex flex-wrap items-end gap-4 text-xs">
                        
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">Plan Type</label>
                          <select 
                            value={bulkPkgId}
                            onChange={(e) => setBulkPkgId(e.target.value)}
                            className="bg-slate-900 border border-navy-600 rounded px-2 py-1.5 text-white"
                          >
                            {state.packages.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">Quantity (1-100)</label>
                          <input 
                            type="number" 
                            value={bulkQty}
                            onChange={(e) => setBulkQty(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 bg-slate-900 border border-navy-600 rounded px-2 py-1.5 text-white text-center font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">Assign to Reseller</label>
                          <select 
                            value={bulkAgentId}
                            onChange={(e) => setBulkAgentId(e.target.value)}
                            className="bg-slate-900 border border-navy-600 rounded px-2 py-1.5 text-white"
                          >
                            <option value="none">Central System Inventory</option>
                            {state.agents.map(a => (
                              <option key={a.id} value={a.id}>{a.name} ({a.location})</option>
                            ))}
                          </select>
                        </div>

                        <button 
                          type="submit"
                          className="bg-teal-500 hover:bg-teal-600 text-navy-800 font-bold px-4 py-1.5 rounded transition shadow-md flex items-center gap-1"
                          id="admin-bulk-generate-btn"
                        >
                          Generate Batch
                        </button>

                        {bulkSuccessCount && (
                          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mb-1.5">
                            <Check className="h-4 w-4" />
                            Created {bulkSuccessCount} vouchers successfully.
                          </div>
                        )}
                      </form>
                    </div>
                  )}

                  {/* Filters Bar */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950 p-3 rounded-xl border border-navy-700">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="Search by code, phone, or connected MAC..."
                        value={voucherSearch}
                        onChange={(e) => setVoucherSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-navy-600 rounded-lg text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <select 
                        value={voucherFilterStatus}
                        onChange={(e) => setVoucherFilterStatus(e.target.value)}
                        className="bg-slate-900 border border-navy-600 rounded-lg text-xs text-white px-2.5 py-1.5 w-1/2 sm:w-auto"
                      >
                        <option value="all">All Statuses</option>
                        <option value="unused">Unused</option>
                        <option value="active">Active</option>
                        <option value="used">Used</option>
                        <option value="expired">Expired</option>
                      </select>

                      <select 
                        value={voucherFilterPackage}
                        onChange={(e) => setVoucherFilterPackage(e.target.value)}
                        className="bg-slate-900 border border-navy-600 rounded-lg text-xs text-white px-2.5 py-1.5 w-1/2 sm:w-auto"
                      >
                        <option value="all">All Plans</option>
                        {state.packages.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Ledgers Table */}
                  <div className="bg-slate-950 border border-navy-700 rounded-xl overflow-hidden shadow-md">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-slate-400 font-semibold border-b border-navy-700">
                            <th className="p-3">Access Code</th>
                            <th className="p-3">Plan</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">MAC Bound</th>
                            <th className="p-3">Customer Phone</th>
                            <th className="p-3">Reseller / Channel</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-800">
                          {filteredVouchers.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-slate-500 italic">No vouchers found matching filters.</td>
                            </tr>
                          ) : (
                            filteredVouchers.map((v) => {
                              const pkg = state.packages.find(p => p.id === v.packageId);
                              const agent = state.agents.find(a => a.id === v.agentId);
                              return (
                                <tr key={v.code} className="hover:bg-slate-900/40 transition">
                                  <td className="p-3 font-mono font-bold text-teal-400">{v.code}</td>
                                  <td className="p-3 font-medium text-slate-200">{pkg?.name || 'Unknown'}</td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${getStatusColor(v.status)}`}>
                                      {v.status}
                                    </span>
                                  </td>
                                  <td className="p-3 font-mono text-slate-300">
                                    {v.boundMACs.length > 0 ? v.boundMACs.join(', ') : <span className="text-slate-600">None</span>}
                                  </td>
                                  <td className="p-3 font-mono text-slate-300">{v.phone || <span className="text-slate-600">N/A</span>}</td>
                                  <td className="p-3 text-slate-400 font-medium">
                                    {agent ? (
                                      <span className="text-teal-400">{agent.name} ({agent.location})</span>
                                    ) : (
                                      <span className="text-slate-500">Direct Online API</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* C. ACTIVE SESSIONS TAB */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white font-display">Live Hotspot Sessions</h2>
                <p className="text-xs text-slate-400">Current connected client leases on MikroTik routers</p>
              </div>

              {/* Filters */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search by MAC address, Lease IP, or Voucher Code..."
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-navy-700 rounded-lg text-xs text-white focus:outline-none"
                />
              </div>

              {/* Table */}
              <div className="bg-slate-950 border border-navy-700 rounded-xl overflow-hidden shadow-md">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 font-semibold border-b border-navy-700">
                      <th className="p-3">Client MAC Address</th>
                      <th className="p-3">DHCP IP Lease</th>
                      <th className="p-3">Voucher Used</th>
                      <th className="p-3">Speed Profile</th>
                      <th className="p-3">Duration Connected</th>
                      <th className="p-3">Simulated Data</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-800">
                    {filteredSessions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 italic">No active connections found.</td>
                      </tr>
                    ) : (
                      filteredSessions.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-900/40 transition">
                          <td className="p-3 font-mono font-bold text-white">{s.mac}</td>
                          <td className="p-3 font-mono text-slate-300">{s.ipAddress}</td>
                          <td className="p-3 font-mono text-teal-400 font-semibold">{s.voucherCode}</td>
                          <td className="p-3">
                            <span className="px-1.5 py-0.5 bg-slate-900 text-slate-400 font-mono rounded text-[10px] font-bold border border-navy-700">
                              {s.speed}
                            </span>
                          </td>
                          <td className="p-3 text-slate-300 font-medium">
                            {s.voucherCode === "FREE-TRIAL-TEMP" ? 'Free Trial Loop' : 'Standard Plan clock'}
                          </td>
                          <td className="p-3 font-mono text-slate-300">{(s.dataUsedMB / 1024).toFixed(2)} GB</td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => handleForceDisconnect(s.id)}
                              className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800/80 hover:border-red-600 rounded text-[10px] font-bold transition"
                            >
                              Disconnect
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* D. RESELLER NETWORK TAB */}
          {activeTab === 'agents' && currentRole === 'Super Admin' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Reseller / Agent Partnerships</h2>
                  <p className="text-xs text-slate-400">Commission schedules and prepaid wallet topups</p>
                </div>
              </div>

              {/* Agent Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {state.agents.map((agent) => (
                  <div key={agent.id} className="bg-slate-950 rounded-xl border border-navy-700 p-5 flex flex-col justify-between shadow-md">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                        <span className="px-2 py-0.5 bg-teal-500/10 text-teal-300 rounded font-bold text-[10px]">
                          {agent.commissionPercent}% Comm
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5 text-slate-500" />
                        {agent.location}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-900/60 p-3 rounded-lg border border-navy-800/50">
                        <div>
                          <p className="text-[9px] text-slate-500 font-bold uppercase">Wallet</p>
                          <p className="text-xs font-bold font-mono text-emerald-400">{agent.walletBalance.toLocaleString()} UGX</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 font-bold uppercase">Total Sales</p>
                          <p className="text-xs font-bold font-mono text-white">{agent.totalSalesUGX.toLocaleString()} UGX</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-navy-800 flex justify-end">
                      <button 
                        onClick={() => {
                          setSelectedAgentForTopup(agent);
                          setTopupAmount(50000);
                        }}
                        className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-navy-800 font-bold text-[10px] rounded-lg transition"
                      >
                        Top Up Wallet
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Leaderboard & Commissions Summary */}
              <div className="bg-slate-950 p-5 rounded-xl border border-navy-700">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Agent Commission Payout Standings</h3>
                <div className="space-y-3">
                  {state.agents.map((agent, i) => (
                    <div key={agent.id} className="flex items-center justify-between text-xs border-b border-navy-800 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 font-bold">#{i + 1}</span>
                        <p className="font-bold text-white">{agent.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-teal-400">{agent.totalCommissionUGX.toLocaleString()} UGX</p>
                        <p className="text-[9px] text-slate-500">Earned commission</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* E. MIKROTIK STATUS TAB */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white font-display">RouterOS Hotspot Status</h2>
                <p className="text-xs text-slate-400">MikroTik Router API endpoints connection health and system health</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.sites.map((site) => (
                  <div key={site.id} className="bg-slate-950 rounded-xl border border-navy-700 p-4 shadow-md flex items-center justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">{site.name}</h3>
                        <span className={`h-2.5 w-2.5 rounded-full ${site.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                      </div>
                      <p className="text-xs text-slate-400">Location: {site.location}</p>
                      
                      {site.status === 'online' && (
                        <div className="flex gap-4 text-[10px] text-slate-500 font-mono">
                          <span>CPU: {site.cpuUsage}%</span>
                          <span>RAM: {site.ramUsage}%</span>
                          <span>Active: {site.activeUsers} leases</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Router Latency</p>
                      <p className={`text-base font-black font-mono ${site.status === 'online' ? 'text-teal-400' : 'text-red-500'}`}>
                        {site.status === 'online' ? `${site.latencyMs} ms` : 'Offline'}
                      </p>
                      <span className="text-[9px] text-slate-600 font-mono">WireGuard tunnel</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* System Health Status */}
              <div className="bg-slate-950 p-5 rounded-xl border border-navy-700 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">TBS Server Status</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3 bg-slate-900 rounded border border-navy-800">
                    <p className="text-slate-500 text-[10px]">CELERY DAEMON</p>
                    <p className="text-emerald-400 font-bold mt-1">● RUNNING (8 tasks active)</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-navy-800">
                    <p className="text-slate-500 text-[10px]">REDIS BROKER</p>
                    <p className="text-emerald-400 font-bold mt-1">● ONLINE (0ms latency)</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-navy-800">
                    <p className="text-slate-500 text-[10px]">BACKUPS STORAGE</p>
                    <p className="text-teal-400 font-bold mt-1">✔ ENGAGED (Daily cron OK)</p>
                  </div>
                </div>
              </div>

              {/* MikroTik Hotspot Script Generator & Integration Guide */}
              <div className="bg-slate-950 p-6 rounded-xl border border-navy-700 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-navy-800">
                  <Terminal className="h-5 w-5 text-teal-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">MikroTik RouterOS Integration Generator</h3>
                    <p className="text-[10px] text-slate-400">Generate copy-paste RouterOS commands to set up the captive portal on physical MikroTiks</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Router Site</label>
                    <select 
                      value={selectedSiteForScript} 
                      onChange={(e) => setSelectedSiteForScript(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-navy-600 rounded text-slate-300 focus:outline-none focus:border-teal-400"
                    >
                      {state.sites.map(site => (
                        <option key={site.id} value={site.id}>{site.name} ({site.location})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hotspot Interface</label>
                    <input 
                      type="text" 
                      value={hotspotInterface}
                      onChange={(e) => setHotspotInterface(e.target.value)}
                      placeholder="e.g. ether2-hotspot"
                      className="w-full px-3 py-2 bg-slate-900 border border-navy-600 rounded text-slate-300 focus:outline-none focus:border-teal-400 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile/Server Name</label>
                    <input 
                      type="text" 
                      value={hotspotProfileName}
                      onChange={(e) => setHotspotProfileName(e.target.value)}
                      placeholder="Techaus_Hotspot"
                      className="w-full px-3 py-2 bg-slate-900 border border-navy-600 rounded text-slate-300 focus:outline-none focus:border-teal-400 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Local DNS Name</label>
                    <input 
                      type="text" 
                      value={serverDnsName}
                      onChange={(e) => setServerDnsName(e.target.value)}
                      placeholder="techaus.connect"
                      className="w-full px-3 py-2 bg-slate-900 border border-navy-600 rounded text-slate-300 focus:outline-none focus:border-teal-400 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RouterOS Script Output (v6 / v7 Compatible)</span>
                    <button 
                      onClick={() => {
                        const codeElem = document.getElementById('mikrotik-script-area');
                        if (codeElem) {
                          navigator.clipboard.writeText(codeElem.textContent || '');
                          setCopiedScript(true);
                          setTimeout(() => setCopiedScript(false), 2000);
                        }
                      }}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-navy-600 text-teal-400 rounded flex items-center gap-1.5 font-bold text-[10px] transition"
                    >
                      {copiedScript ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      {copiedScript ? 'Copied to Clipboard!' : 'Copy Script'}
                    </button>
                  </div>

                  <pre 
                    id="mikrotik-script-area"
                    className="p-4 bg-slate-950 border border-navy-800 rounded-xl font-mono text-[11px] text-teal-300 overflow-x-auto max-h-72 select-all whitespace-pre leading-relaxed"
                  >
{`# =========================================================
# TECHAUS CONNECT MIKROTIK HOTSPOT SETUP
# Target Router Site: ${state.sites.find(s => s.id === selectedSiteForScript)?.name || 'Bukedea Main Tower'}
# Location: ${state.sites.find(s => s.id === selectedSiteForScript)?.location || 'Bukedea'}
# Generated: ${new Date().toLocaleDateString()}
# Compatibility: RouterOS v6.x / v7.x
# =========================================================

# 1. Create a Hotspot User Profile with speed limits
/ip hotspot user profile
add name="Techaus_Standard" idle-timeout=none keepalive-timeout=2m shared-users=1

# 2. Add Hotspot Server Profile pointing to our captive portal
/ip hotspot profile
add name="${hotspotProfileName}_Profile" hotspot-address=10.5.50.1 dns-name="${serverDnsName}" \\
    login-by=http-chap,http-pap,cookie \\
    html-directory=flash/hotspot \\
    login-page-url="https://techaus-connect-wisp.run.app"

# 3. Create the Hotspot server on specified interface
/ip hotspot
add name="${hotspotProfileName}" interface="${hotspotInterface}" profile="${hotspotProfileName}_Profile" disabled=no

# 4. Configure Walled Garden for unauthenticated payment gateway redirection
/ip hotspot walled-garden
add action=allow comment="Allow Pesapal Gateway UI" dst-host="*.pesapal.com"
add action=allow comment="Allow Pesapal Payment API" dst-host="pay.pesapal.com"
add action=allow comment="Allow Pesapal Secure Checkout" dst-host="api.pesapal.com"
add action=allow comment="Allow MTN Uganda MoMo Webhooks" dst-host="*.mtn.co.ug"
add action=allow comment="Allow Airtel Money API Core" dst-host="*.airtel.co.ug"
add action=allow comment="Allow Airtel Money Web Portals" dst-host="*.airtelmoney.com"
add action=allow comment="Allow Techaus Connect Domain" dst-host="*techaus*"

# 5. Configure API Services for Remote Voucher Validation (RADIUS fallback)
/ip service
set api port=8728 disabled=no
set api-ssl port=8729 disabled=no certificate=none

/log info "Techaus Connect WISP hotspot profile setup successfully applied!"`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* F. SYSTEM AUDIT LOGS TAB */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white font-display">System Audit Logging</h2>
                <p className="text-xs text-slate-400">Reconciliation records and admin activity tracking</p>
              </div>

              <div className="bg-slate-950 border border-navy-700 rounded-xl overflow-hidden shadow-md">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-navy-700 sticky top-0">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Actor</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Action Type</th>
                        <th className="p-3">Audit Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-800 font-mono">
                      {state.logs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/40 transition">
                          <td className="p-3 text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</td>
                          <td className="p-3 text-slate-300 font-semibold">{log.actor}</td>
                          <td className="p-3">
                            <span className="px-1.5 py-0.5 bg-navy-800 rounded text-[9px] text-teal-400 font-bold">
                              {log.role}
                            </span>
                          </td>
                          <td className="p-3 text-white font-bold">{log.action}</td>
                          <td className="p-3 text-slate-400 leading-normal">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Wallet Topup Modal (Super Admin only) */}
      {selectedAgentForTopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-navy-800 border border-navy-600 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-4 relative">
            <button 
              onClick={() => setSelectedAgentForTopup(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 pb-2 border-b border-navy-700">
              <Wallet className="h-5 w-5 text-teal-400" />
              <h3 className="text-base font-bold text-white font-display">Approve Wallet Top-Up</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Top up prepaid credit for agent <strong>{selectedAgentForTopup.name}</strong>. Their current wallet balance is <strong className="text-white">{selectedAgentForTopup.walletBalance.toLocaleString()} UGX</strong>.
            </p>

            <form onSubmit={handleAgentTopup} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Top-up Amount (UGX)</label>
                <select 
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-navy-600 rounded px-2.5 py-2 text-white font-mono"
                >
                  <option value={10000}>10,000 UGX</option>
                  <option value={20000}>20,000 UGX</option>
                  <option value={50000}>50,000 UGX</option>
                  <option value={100000}>100,000 UGX</option>
                  <option value={250000}>250,000 UGX</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setSelectedAgentForTopup(null)}
                  className="px-3 py-1.5 bg-slate-900 border border-navy-600 rounded-lg text-slate-400"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-1.5 bg-teal-500 hover:bg-teal-600 text-navy-800 font-bold rounded-lg transition"
                >
                  Approve Topup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
