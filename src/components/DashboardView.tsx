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
  AlertTriangle,
  Sparkles,
  Award,
  Phone,
  Printer,
  FileSpreadsheet,
  Download,
  Copy,
  Terminal,
  Megaphone,
  Trophy,
  Crown,
  Gift,
  Medal,
  Calendar,
  CreditCard,
  Smartphone,
  GraduationCap,
  Tv,
  User
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
import { Voucher, Package, Agent, ActiveSession, RouterSite, SponsorAd } from '../types';
import { TBSLogo } from './TBSLogo';

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

  // Ad Analytics Calculations
  const adStats = useMemo(() => {
    const list = state.sponsorAds || [];
    const totalImpressions = list.reduce((acc, curr) => acc + (curr.impressions || 0), 0);
    const totalClicks = list.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
    const ctr = totalImpressions > 0 ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(1)) : 0.0;
    const activeCount = list.filter(a => a.active).length;
    return { totalImpressions, totalClicks, ctr, activeCount };
  }, [state.sponsorAds]);

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

  // Agent Bulk Stock Purchase States
  const [agentBulkTab, setAgentBulkTab] = useState<'single' | 'bulk'>('single');
  const [bulkQuantities, setBulkQuantities] = useState<Record<string, number>>({});
  const [agentBulkSuccessVouchers, setAgentBulkSuccessVouchers] = useState<Voucher[]>([]);
  const [agentBulkError, setAgentBulkError] = useState<string | null>(null);
  const [agentBulkPaymentMethod, setAgentBulkPaymentMethod] = useState<'Wallet' | 'MTN' | 'Airtel' | 'Pesapal'>('Wallet');
  const [agentBulkPaymentPhone, setAgentBulkPaymentPhone] = useState('');
  const [agentBulkPaymentStep, setAgentBulkPaymentStep] = useState<'form' | 'ussd' | 'processing' | 'pesapal_card' | 'success'>('form');
  const [agentBulkUssdPin, setAgentBulkUssdPin] = useState('');
  const [agentBulkCardNumber, setAgentBulkCardNumber] = useState('');
  const [agentBulkCardHolder, setAgentBulkCardHolder] = useState('');
  const [agentBulkCardExpiry, setAgentBulkCardExpiry] = useState('');
  const [agentBulkCardCvv, setAgentBulkCardCvv] = useState('');

  // System Seed reset
  const [resetSuccess, setResetSuccess] = useState(false);

  // Remote AP configuration states
  const [showAddApForm, setShowAddApForm] = useState(false);
  const [newApName, setNewApName] = useState('');
  const [newApLocation, setNewApLocation] = useState('');
  const [newApNotification, setNewApNotification] = useState<string | null>(null);

  // MikroTik script generator states
  const [selectedSiteForScript, setSelectedSiteForScript] = useState('site-bukedea');
  const [hotspotInterface, setHotspotInterface] = useState('ether2-hotspot');
  const [hotspotProfileName, setHotspotProfileName] = useState('WIFI_ZONE_Hotspot');

  // Ad Management form state
  const [showAdCreateModal, setShowAdCreateModal] = useState(false);
  const [editingAd, setEditingAd] = useState<SponsorAd | null>(null);
  const [adForm, setAdForm] = useState<Partial<SponsorAd>>({
    brand: '',
    title: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=80',
    ctaText: 'Learn More',
    tagline: '',
    themeColor: 'from-blue-500 to-indigo-600',
    active: true,
    impressions: 0,
    clicks: 0
  });
  const [serverDnsName, setServerDnsName] = useState('tbs.connect');
  const [copiedScript, setCopiedScript] = useState(false);

  // Agent Wallet Withdrawal States
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('15000');
  const [withdrawChannel, setWithdrawChannel] = useState<'MTN' | 'Airtel' | 'Bank'>('MTN');
  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [withdrawBankName, setWithdrawBankName] = useState('Centenary Bank');
  const [withdrawBankAccount, setWithdrawBankAccount] = useState('');
  const [withdrawAccountName, setWithdrawAccountName] = useState('');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);

  // Check if an agent is allowed to withdraw (once a week / 7 days rolling window)
  const getWithdrawalTimeRemaining = (agent: Agent) => {
    if (!agent.lastWithdrawalTime) return { canWithdraw: true, remainingText: '' };
    const lastTime = new Date(agent.lastWithdrawalTime).getTime();
    const nowTime = new Date().getTime();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const diff = nowTime - lastTime;
    if (diff >= oneWeekMs) {
      return { canWithdraw: true, remainingText: '' };
    }
    const remainingMs = oneWeekMs - diff;
    const remainingDays = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
    const remainingHours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const remainingMins = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
    
    let remainingText = '';
    if (remainingDays > 0) {
      remainingText += `${remainingDays}d `;
    }
    if (remainingHours > 0 || remainingDays > 0) {
      remainingText += `${remainingHours}h `;
    }
    remainingText += `${remainingMins}m`;
    
    return { canWithdraw: false, remainingText };
  };

  // Agent Leaderboard and Rewards States
  const [selectedLeaderboardMonth, setSelectedLeaderboardMonth] = useState('2026-07');
  const [bonusAmountInput, setBonusAmountInput] = useState('50000');
  const [rewardCelebration, setRewardCelebration] = useState<{agentName: string; amount: number} | null>(null);

  // Get active agent details if Agent role is active
  const activeAgent = useMemo(() => {
    return state.agents.find(a => a.id === currentAgentId) || state.agents[0];
  }, [state.agents, currentAgentId]);

  // Calculate dynamic agent leaderboard for the selected month
  const leaderboardData = useMemo(() => {
    const month = selectedLeaderboardMonth;
    
    // Initialize monthly sales mapping
    const salesMap: Record<string, number> = {};
    state.agents.forEach(a => {
      salesMap[a.id] = 0;
    });

    // Sum transactions for the selected month
    state.transactions.forEach(txn => {
      if (txn.agentId && txn.status === 'success' && txn.timestamp.startsWith(month)) {
        salesMap[txn.agentId] = (salesMap[txn.agentId] || 0) + txn.amountUGX;
      }
    });

    // Sort agents by sales descending
    const sorted = state.agents.map(agent => ({
      agent,
      sales: salesMap[agent.id] || 0,
    })).sort((a, b) => b.sales - a.sales);

    // Map ranks and top status
    return sorted.map((item, index) => ({
      ...item,
      rank: index + 1,
      isTop: index === 0 && item.sales >= 250000,
    }));
  }, [selectedLeaderboardMonth, state.agents, state.transactions]);

  // Handler to award performance bonus (Wallet credit + Audit log)
  const handleRewardAgent = (agentId: string) => {
    const amount = parseInt(bonusAmountInput) || 50000;
    const agentIndex = state.agents.findIndex(a => a.id === agentId);
    if (agentIndex === -1) return;

    const agent = state.agents[agentIndex];
    state.agents[agentIndex].walletBalance += amount;

    // Add Audit Log
    state.addLog(
      currentRole === 'Super Admin' ? 'Super Admin' : 'Operator',
      currentRole === 'Super Admin' ? 'Super Admin Console' : 'Operator Dashboard',
      'Performance Bonus Awarded',
      `Formally awarded a performance bonus of ${amount.toLocaleString()} UGX to top reseller ${agent.name} for the month of ${selectedLeaderboardMonth}. Balance credited to prepaid wallet.`
    );

    setRewardCelebration({
      agentName: agent.name,
      amount
    });

    state.save();
    onStateUpdate();

    setTimeout(() => {
      setRewardCelebration(null);
    }, 5000);
  };

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

  // Agent Wallet Withdrawal handler
  const handleAgentWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    setWithdrawSuccess(null);

    const amount = parseInt(withdrawAmount);
    if (isNaN(amount) || amount < 15000 || amount > 3000000) {
      setWithdrawError('Withdrawal amount must be between 15,000 UGX and 3,000,000 UGX.');
      return;
    }

    if (amount > activeAgent.walletBalance) {
      setWithdrawError(`Insufficient wallet balance. You currently have ${activeAgent.walletBalance.toLocaleString()} UGX available.`);
      return;
    }

    // Check 1 week timing rule
    const checkTimer = getWithdrawalTimeRemaining(activeAgent);
    if (!checkTimer.canWithdraw) {
      setWithdrawError(`Withdrawal locked: You can only withdraw once a week. Next withdrawal available in ${checkTimer.remainingText}.`);
      return;
    }

    // Check payment fields
    if (withdrawChannel === 'Bank') {
      if (!withdrawBankAccount.trim() || !withdrawAccountName.trim()) {
        setWithdrawError('Please enter your Bank Account Number and Account Holder Name.');
        return;
      }
    } else {
      if (!withdrawPhone.trim()) {
        setWithdrawError(`Please enter your registered mobile number for ${withdrawChannel === 'MTN' ? 'MTN MoMo' : 'Airtel Money'}.`);
        return;
      }
    }

    // Success! Update Agent and Deduct Balance
    const agentIndex = state.agents.findIndex(a => a.id === activeAgent.id);
    if (agentIndex !== -1) {
      state.agents[agentIndex].walletBalance -= amount;
      state.agents[agentIndex].lastWithdrawalTime = new Date().toISOString();
      
      const destination = withdrawChannel === 'Bank' 
        ? `${withdrawBankName} A/C ${withdrawBankAccount} (${withdrawAccountName})`
        : `${withdrawChannel === 'MTN' ? 'MTN MoMo' : 'Airtel Money'} on ${withdrawPhone}`;

      state.addLog(
        'Agent',
        activeAgent.name,
        'Wallet Payout Completed',
        `Withdrew ${amount.toLocaleString()} UGX to ${destination}. Prepaid balance is now ${state.agents[agentIndex].walletBalance.toLocaleString()} UGX.`
      );

      state.save();
      onStateUpdate();
      setWithdrawSuccess(`Success! ${amount.toLocaleString()} UGX has been successfully withdrawn to your ${withdrawChannel === 'Bank' ? 'Bank Account' : 'Mobile Wallet'} (${withdrawChannel === 'Bank' ? withdrawBankAccount : withdrawPhone}).`);
      
      // Keep state clean after a delay
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawSuccess(null);
      }, 4000);
    } else {
      setWithdrawError('Error: Could not find active agent session record.');
    }
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

  // Toggle Ad Campaign Active Status
  const handleToggleAdActive = (adId: string) => {
    const adIndex = (state.sponsorAds || []).findIndex(a => a.id === adId);
    if (adIndex === -1) return;
    const oldStatus = state.sponsorAds[adIndex].active;
    state.sponsorAds[adIndex].active = !oldStatus;
    state.addLog(
      'Super Admin',
      'Ad Campaign Dashboard',
      'Toggle Campaign Status',
      `Toggled campaign active status for ${state.sponsorAds[adIndex].brand} from ${oldStatus ? "Active" : "Inactive"} to ${!oldStatus ? "Active" : "Inactive"}.`
    );
    state.save();
    onStateUpdate();
  };

  // Delete Ad Campaign
  const handleDeleteAd = (adId: string) => {
    const ad = (state.sponsorAds || []).find(a => a.id === adId);
    if (!ad) return;
    if (confirm(`Are you sure you want to delete the sponsor campaign for "${ad.brand}"?`)) {
      state.sponsorAds = (state.sponsorAds || []).filter(a => a.id !== adId);
      state.addLog(
        'Super Admin',
        'Ad Campaign Dashboard',
        'Delete Campaign',
        `Deleted campaign for "${ad.brand}": "${ad.title}"`
      );
      state.save();
      onStateUpdate();
    }
  };

  // Save Ad Campaign Form
  const handleSaveAdCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adForm.brand || !adForm.title || !adForm.description) {
      alert("Please fill in all required fields (Brand, Title, and Description).");
      return;
    }

    if (editingAd) {
      // Edit existing
      const adIndex = (state.sponsorAds || []).findIndex(a => a.id === editingAd.id);
      if (adIndex !== -1) {
        state.sponsorAds[adIndex] = {
          ...state.sponsorAds[adIndex],
          brand: adForm.brand,
          title: adForm.title,
          description: adForm.description,
          imageUrl: adForm.imageUrl || 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=80',
          ctaText: adForm.ctaText || 'Learn More',
          tagline: adForm.tagline || '',
          themeColor: adForm.themeColor || 'from-blue-500 to-indigo-600',
        };
        state.addLog(
          'Super Admin',
          'Ad Campaign Dashboard',
          'Edit Campaign',
          `Modified advertisement details for ${adForm.brand}.`
        );
      }
    } else {
      // Create new
      const newAd: SponsorAd = {
        id: "ad-" + Date.now(),
        brand: adForm.brand,
        title: adForm.title,
        description: adForm.description,
        imageUrl: adForm.imageUrl || 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=80',
        ctaText: adForm.ctaText || 'Learn More',
        tagline: adForm.tagline || '',
        themeColor: adForm.themeColor || 'from-blue-500 to-indigo-600',
        active: true,
        impressions: 0,
        clicks: 0
      };
      state.sponsorAds = [...(state.sponsorAds || []), newAd];
      state.addLog(
        'Super Admin',
        'Ad Campaign Dashboard',
        'Create Campaign',
        `Launched a new advertisement campaign for "${adForm.brand}": "${adForm.title}"`
      );
    }

    // Reset and close
    setShowAdCreateModal(false);
    setEditingAd(null);
    setAdForm({
      brand: '',
      title: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=80',
      ctaText: 'Learn More',
      tagline: '',
      themeColor: 'from-blue-500 to-indigo-600',
      active: true,
      impressions: 0,
      clicks: 0
    });
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

  // Compute live allocation for custom chosen quantities
  const agentBulkAllocation = useMemo(() => {
    const items = state.packages.map(p => {
      const count = bulkQuantities[p.id] || 0;
      return {
        packageId: p.id,
        name: p.name,
        count,
        price: p.priceUGX
      };
    }).filter(i => i.count > 0);

    const totalCost = items.reduce((sum, item) => sum + (item.count * item.price), 0);

    return {
      name: 'Custom Stock Choice',
      totalCostUGX: totalCost,
      items
    };
  }, [bulkQuantities, state.packages]);

  // Helper to generate bulk vouchers and record successful payment
  const completeBulkPurchaseTransaction = (paymentMethod: 'Wallet' | 'MTN' | 'Airtel' | 'Pesapal', paymentDetail: string) => {
    const allocation = agentBulkAllocation;
    if (!allocation || allocation.items.length === 0 || allocation.totalCostUGX <= 0) return;

    const agentIndex = state.agents.findIndex(a => a.id === activeAgent.id);
    if (agentIndex === -1) return;
    const agent = state.agents[agentIndex];

    // Generate the vouchers
    const newVouchers: Voucher[] = [];
    allocation.items.forEach(item => {
      for (let i = 0; i < item.count; i++) {
        newVouchers.push({
          code: generateVoucherCode(),
          packageId: item.packageId,
          status: 'unused',
          activationTime: null,
          expiryTime: null,
          boundMACs: [],
          phone: null,
          agentId: agent.id,
          createdTime: new Date().toISOString(),
          commissionDeferred: true // Marked as deferred commission
        });
      }
    });

    state.vouchers = [...newVouchers, ...state.vouchers];

    // Record sales volume
    state.agents[agentIndex].totalSalesUGX += allocation.totalCostUGX;

    // Record transaction
    state.transactions.push({
      id: "txn-" + Math.floor(Math.random() * 90000 + 10000),
      phone: paymentDetail,
      amountUGX: allocation.totalCostUGX,
      packageId: "bulk-deal",
      voucherCode: `${newVouchers.length} Vouchers Batch`,
      type: 'agent',
      status: 'success',
      timestamp: new Date().toISOString(),
      agentId: agent.id,
      paymentMethod: paymentMethod === 'Wallet' ? 'Wallet' : paymentMethod
    });

    // Write audit log
    state.addLog(
      'Agent',
      `${agent.name} (${agent.id})`,
      'Bulk Stock Purchase',
      `Stocked customized bulk vouchers. Total cost: ${allocation.totalCostUGX.toLocaleString()} UGX. Payment method: ${paymentMethod} (${paymentDetail}). Vouchers generated: ${newVouchers.length}. Commission is deferred and will automatically remit to wallet after successful client sales.`
    );

    // Save and update UI
    setAgentBulkSuccessVouchers(newVouchers);
    setBulkQuantities({}); // Reset quantities
    setAgentBulkPaymentPhone('');
    setAgentBulkUssdPin('');
    setAgentBulkCardNumber('');
    setAgentBulkCardHolder('');
    setAgentBulkCardExpiry('');
    setAgentBulkCardCvv('');
    setAgentBulkPaymentStep('form');
    state.save();
    onStateUpdate();
  };

  // Execute bulk stocking purchase with 10% commission deferred to actual client redemption
  const handleAgentBulkPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setAgentBulkError(null);
    setAgentBulkSuccessVouchers([]);

    const allocation = agentBulkAllocation;
    if (!allocation || allocation.items.length === 0 || allocation.totalCostUGX <= 0) {
      setAgentBulkError("Please choose the quantity for at least one plan to buy.");
      return;
    }

    const agentIndex = state.agents.findIndex(a => a.id === activeAgent.id);
    if (agentIndex === -1) return;
    const agent = state.agents[agentIndex];

    if (agentBulkPaymentMethod === 'Wallet') {
      if (agent.walletBalance < allocation.totalCostUGX) {
        setAgentBulkError(`Insufficient wallet balance. Total cost is ${allocation.totalCostUGX.toLocaleString()} UGX, but your current balance is ${agent.walletBalance.toLocaleString()} UGX. Please contact an Admin or choose a different payment option.`);
        return;
      }
      // Deduct full wholesale cost (no instant refund of 10%)
      state.agents[agentIndex].walletBalance -= allocation.totalCostUGX;
      completeBulkPurchaseTransaction('Wallet', 'Wallet Balance');
    } else if (agentBulkPaymentMethod === 'MTN' || agentBulkPaymentMethod === 'Airtel') {
      if (!agentBulkPaymentPhone.match(/^(07[0-9]{8})$/) && !agentBulkPaymentPhone.match(/^(2567[0-9]{8})$/)) {
        setAgentBulkError("Please enter a valid 10-digit Uganda phone number (e.g., 0772123456).");
        return;
      }
      // Move to USSD PIN code entry step
      setAgentBulkPaymentStep('ussd');
    } else if (agentBulkPaymentMethod === 'Pesapal') {
      // Move to Pesapal secure form
      setAgentBulkPaymentStep('pesapal_card');
    }
  };

  const handleAgentBulkUssdPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAgentBulkError(null);
    if (agentBulkUssdPin.length < 4) {
      setAgentBulkError("Please enter your 4 or 5-digit Mobile Money PIN.");
      return;
    }
    setAgentBulkPaymentStep('processing');
    setTimeout(() => {
      completeBulkPurchaseTransaction(agentBulkPaymentMethod, agentBulkPaymentPhone);
    }, 2000);
  };

  const handleAgentBulkPesapalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAgentBulkError(null);
    if (agentBulkCardNumber.replace(/\s/g, '').length < 16) {
      setAgentBulkError("Please enter a valid 16-digit Card Number.");
      return;
    }
    if (!agentBulkCardExpiry.includes('/')) {
      setAgentBulkError("Please enter Expiry in MM/YY format.");
      return;
    }
    if (agentBulkCardCvv.length < 3) {
      setAgentBulkError("Please enter a valid CVV.");
      return;
    }
    setAgentBulkPaymentStep('processing');
    setTimeout(() => {
      completeBulkPurchaseTransaction('Pesapal', 'Card Payment via Pesapal');
    }, 2000);
  };

  // Remote AP Add handler
  const handleAddAp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApName.trim() || !newApLocation.trim()) {
      setNewApNotification("Error: Please provide both Name and Location for the new AP.");
      return;
    }

    // Generate automatic IP address assignment (e.g. 10.150.X.1)
    let nextSubnet = 18; // Default fallback if no match
    try {
      const ipSubnets = state.sites
        .map(s => s.ipAddress)
        .filter((ip): ip is string => typeof ip === 'string' && ip.startsWith("10.150."))
        .map(ip => {
          const parts = ip.split('.');
          return parseInt(parts[2], 10);
        })
        .filter(num => !isNaN(num));
      
      if (ipSubnets.length > 0) {
        nextSubnet = Math.max(...ipSubnets) + 1;
      }
    } catch (err) {
      console.error("Error computing next subnet IP:", err);
    }

    const assignedIp = `10.150.${nextSubnet}.1`;
    const newApId = `site-${newApName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;

    const newAp: RouterSite = {
      id: newApId,
      name: newApName.trim(),
      location: newApLocation.trim(),
      status: 'online',
      cpuUsage: 5 + Math.floor(Math.random() * 10),
      ramUsage: 20 + Math.floor(Math.random() * 20),
      activeUsers: 0,
      latencyMs: 12 + Math.floor(Math.random() * 15),
      ipAddress: assignedIp
    };

    // Add site to state and save
    state.sites.push(newAp);
    state.addLog(
      'Super Admin', 
      'Super Admin', 
      'Remote AP Connected', 
      `Remotely added new Access Point: "${newAp.name}" in ${newAp.location}. IP Address ${assignedIp} was automatically assigned.`
    );

    // Clear fields and show success
    setNewApName('');
    setNewApLocation('');
    setNewApNotification(`Success! ${newAp.name} has been remotely provisioned. Automatically assigned IP: ${assignedIp}`);
    
    // Save state
    state.save();
    onStateUpdate();

    // Reset notification after 6 seconds
    setTimeout(() => {
      setNewApNotification(null);
    }, 6000);
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
      const matchRole = currentRole !== 'Agent' || v.agentId === activeAgent.id;
      return matchSearch && matchStatus && matchPkg && matchRole;
    });
  }, [state.vouchers, voucherSearch, voucherFilterStatus, voucherFilterPackage, currentRole, activeAgent.id]);

  // Sessions Filtered
  const filteredSessions = useMemo(() => {
    return state.sessions.filter(s => {
      return s.mac.toLowerCase().includes(sessionSearch.toLowerCase()) || 
             s.voucherCode.toLowerCase().includes(sessionSearch.toLowerCase()) ||
             s.ipAddress.includes(sessionSearch) ||
             (s.deviceModel && s.deviceModel.toLowerCase().includes(sessionSearch.toLowerCase()));
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
    const content = `============================================================
WIFI ZONE LTD
Plot 14, Kampala Road, Kampala, Uganda
Tel: +256 772 900 801 | Email: billing@wifizone.co.ug
Web: www.wifizone.co.ug
------------------------------------------------------------
WIFI ZONE BILLING SYSTEM - EXPORT REPORT
Generated: ${new Date().toLocaleString()}
Format: ${format}
============================================================

SUMMARY STATS:
--------------
REVENUE TOTAL: ${revenueStats.totalRev.toLocaleString()} UGX
ACTIVE SESSIONS: ${state.sessions.length}
TOTAL VOUCHERS: ${state.vouchers.length}
============================================================
`;
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = `tbs_connect_report_${Date.now()}.${format.toLowerCase()}`;
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Modern Radiant Ambient Glow Background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* 1. Dashboard Top Header */}
      <header className="sticky top-0 z-40 bg-navy-800 border-b border-navy-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <TBSLogo />
            <span className="px-2 py-0.5 text-[10px] bg-teal-500/20 text-teal-300 font-bold rounded-full border border-teal-500/30">Admin Central</span>
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
              href="/tbs-connect-wisp.zip"
              download="tbs-connect-wisp.zip"
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
                onClick={() => setActiveTab('ads')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'ads' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Megaphone className="h-4 w-4 text-purple-400 animate-pulse" />
                Ad Campaigns
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
                onClick={() => setActiveTab('ads')} 
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'ads' ? 'bg-navy-700 text-teal-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Megaphone className="h-4 w-4 text-purple-400 animate-pulse" />
                Ad Campaigns
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
                  <div className="bg-slate-950 p-4 rounded-xl border border-navy-700 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase">
                        <span>Available Balance</span>
                        <Wallet className="h-4 w-4 text-emerald-400" />
                      </div>
                      <p className="text-xl font-black text-emerald-400 font-mono mt-2">{activeAgent.walletBalance.toLocaleString()} <span className="text-xs text-slate-400">UGX</span></p>
                      <p className="text-[10px] text-slate-500 mt-1">Prepaid balance for generating cash vouchers</p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-navy-800/80">
                      <button
                        type="button"
                        onClick={() => {
                          setShowWithdrawModal(true);
                          setWithdrawAmount(Math.max(15000, Math.min(3000000, activeAgent.walletBalance)).toString());
                          setWithdrawError(null);
                          setWithdrawSuccess(null);
                        }}
                        className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 hover:border-emerald-400 text-emerald-300 hover:text-navy-950 rounded-lg text-[10px] font-black uppercase tracking-wider transition duration-150 flex items-center justify-center gap-1.5"
                      >
                        <Download className="h-3 w-3" />
                        Withdraw Funds
                      </button>
                    </div>
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

              {/* Agent Monthly Leaderboard and Rewards Center */}
              <div className="bg-slate-950 rounded-xl border border-navy-700/80 p-5 shadow-lg relative overflow-hidden">
                {/* Background decorative glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

                {/* Banner / Celebration Modal inside */}
                {rewardCelebration && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6"
                  >
                    <div className="bg-teal-500/10 p-4 rounded-full text-teal-400 mb-3 animate-bounce">
                      <Sparkles className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-extrabold text-white font-display">🎉 Performance Recognized!</h3>
                    <p className="text-sm text-slate-300 mt-2 max-w-md">
                      Successfully awarded a performance bonus of <strong className="text-teal-400">{rewardCelebration.amount.toLocaleString()} UGX</strong> to top agent <strong className="text-white">{rewardCelebration.agentName}</strong>.
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Their wallet balance has been credited and a formal record was logged to system audits.</p>
                    <button 
                      onClick={() => setRewardCelebration(null)}
                      className="mt-4 px-4 py-1.5 bg-teal-500 hover:bg-teal-600 text-navy-955 font-bold text-xs rounded-lg transition"
                    >
                      Dismiss Notification
                    </button>
                  </motion.div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-navy-800/80">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-yellow-500/15 text-yellow-500 rounded-xl border border-yellow-500/25">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white font-display flex items-center gap-2">
                        Monthly Reseller Leaderboard & Awards
                        <span className="px-2 py-0.5 bg-teal-500/10 text-teal-300 rounded font-bold text-[9px] uppercase tracking-wider">
                          Auto-Commission Active
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Automated commission boost (25%) awarded to the #1 top monthly sales performer</p>
                    </div>
                  </div>

                  {/* Month Selection */}
                  <div className="flex items-center gap-2 self-start lg:self-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Month:</span>
                    <select 
                      value={selectedLeaderboardMonth}
                      onChange={(e) => setSelectedLeaderboardMonth(e.target.value)}
                      className="bg-slate-900 border border-navy-700/80 text-white rounded-lg text-xs font-bold px-3 py-1.5 focus:outline-none focus:border-teal-500 transition"
                    >
                      <option value="2026-07">July 2026 (Current)</option>
                      <option value="2026-06">June 2026</option>
                      <option value="2026-05">May 2026</option>
                    </select>
                  </div>
                </div>

                {/* Main Content by Role */}
                {currentRole !== 'Agent' ? (
                  /* Super Admin / Operator View: Display Top 3 Performers with Podium & Reward controls */
                  <div className="mt-5 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {leaderboardData.slice(0, 3).map((item, idx) => {
                        const isWinner = item.rank === 1 && item.sales >= 250000;
                        const isHighestButUnderThreshold = item.rank === 1 && item.sales < 250000 && item.sales > 0;
                        const progressPercent = Math.min(100, Math.round((item.sales / 250000) * 100));

                        return (
                          <div 
                            key={item.agent.id} 
                            className={`rounded-xl border p-4.5 flex flex-col justify-between transition-all duration-300 ${
                              isWinner 
                                ? 'bg-gradient-to-b from-yellow-500/10 to-transparent border-yellow-500/45 shadow-md shadow-yellow-500/5 ring-1 ring-yellow-500/25' 
                                : isHighestButUnderThreshold
                                  ? 'bg-gradient-to-b from-rose-500/5 to-transparent border-rose-500/25'
                                  : item.rank === 2 
                                    ? 'bg-slate-900/40 border-slate-700/50' 
                                    : 'bg-slate-900/20 border-slate-800/40'
                            }`}
                          >
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                  {item.rank === 1 ? (
                                    <div className="p-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg">
                                      <Crown className="h-4 w-4" />
                                    </div>
                                  ) : item.rank === 2 ? (
                                    <div className="p-1.5 bg-slate-400/20 text-slate-300 rounded-lg">
                                      <Medal className="h-4 w-4" />
                                    </div>
                                  ) : (
                                    <div className="p-1.5 bg-amber-700/20 text-amber-600 rounded-lg">
                                      <Medal className="h-4 w-4" />
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rank #{item.rank}</span>
                                    <h4 className="text-sm font-extrabold text-white mt-0.5">{item.agent.name}</h4>
                                  </div>
                                </div>
                                
                                {isWinner && (
                                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded font-black text-[9px] uppercase tracking-wider border border-yellow-500/20 animate-pulse">
                                    🏆 Champion (25% Rate)
                                  </span>
                                )}

                                {isHighestButUnderThreshold && (
                                  <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded font-black text-[9px] uppercase tracking-wider border border-rose-500/20">
                                    ⚠️ Under Threshold (10%)
                                  </span>
                                )}
                              </div>

                              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pl-1">
                                <Globe className="h-3.5 w-3.5 text-slate-500" />
                                {item.agent.location}
                              </p>

                              <div className="mt-4 bg-slate-900/80 p-3 rounded-lg border border-navy-800/80 space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-500">Monthly Sales:</span>
                                  <span className="font-bold text-white font-mono">{item.sales.toLocaleString()} UGX</span>
                                </div>

                                {item.rank === 1 && (
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-[10px]">
                                      <span className="text-slate-500">Quota (250K UGX limit):</span>
                                      <span className={`font-bold ${isWinner ? 'text-yellow-400' : 'text-rose-400'}`}>{progressPercent}%</span>
                                    </div>
                                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-navy-800/50">
                                      <div 
                                        className={`h-full rounded-full ${isWinner ? 'bg-yellow-400' : 'bg-rose-400'}`} 
                                        style={{ width: `${progressPercent}%` }} 
                                      />
                                    </div>
                                  </div>
                                )}

                                <div className="flex justify-between text-xs border-t border-navy-800/60 pt-1.5">
                                  <span className="text-slate-500">Commission Rate:</span>
                                  <span className={`font-bold font-mono ${isWinner ? 'text-yellow-400' : 'text-teal-400'}`}>
                                    {isWinner ? '25%' : `${item.agent.commissionPercent}%`}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-500">Wallet Balance:</span>
                                  <span className="font-medium text-emerald-400 font-mono">{item.agent.walletBalance.toLocaleString()} UGX</span>
                                </div>
                              </div>
                            </div>

                            {/* Reward Action Section */}
                            <div className="mt-4 pt-3.5 border-t border-navy-800/60 flex flex-col gap-2">
                              {item.rank === 1 && item.sales > 0 ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-1">
                                    <input 
                                      type="number" 
                                      value={bonusAmountInput} 
                                      onChange={(e) => setBonusAmountInput(e.target.value)}
                                      className="w-full bg-slate-900 border border-navy-700 rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                                      placeholder="Bonus UGX"
                                    />
                                    <span className="text-[10px] text-slate-500 font-bold shrink-0">UGX</span>
                                  </div>
                                  <button
                                    onClick={() => handleRewardAgent(item.agent.id)}
                                    className="w-full py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-navy-950 font-black text-[10px] uppercase tracking-wider rounded-lg transition shadow-md flex items-center justify-center gap-1.5"
                                  >
                                    <Gift className="h-3.5 w-3.5" />
                                    Reward & Recognize
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    // Set topup amount input and focus topup
                                    setSelectedAgentForTopup(item.agent);
                                    setTopupAmount(25000);
                                  }}
                                  className="w-full py-1.5 bg-slate-905 hover:bg-slate-800 text-slate-300 font-bold text-[10px] uppercase tracking-wider rounded-lg border border-navy-800 transition text-center"
                                >
                                  Top Up Wallet
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="bg-navy-900/60 p-3 rounded-lg border border-navy-800/80 flex items-start gap-2.5 text-xs text-slate-300">
                      <Sparkles className="h-4.5 w-4.5 text-yellow-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-white">How this is automated:</p>
                        <p className="text-slate-400 mt-0.5 leading-relaxed">
                          The system aggregates transaction history for each calendar month. The highest-selling agent in that month instantly gains a 25% commission rate (up from standard 10% or 12%) on their billing activities, <strong>provided they meet a compulsory condition of monthly sales totalling 250,000 Uganda Shillings (UGX)</strong>. If they are the top reseller but fail to reach 250,000 UGX, the rate remains at their standard baseline. Admin and Operator can distribute custom financial bonuses directly into the winners' reseller wallets right from this performance dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Agent View: Dynamic Race Status, Standings and Motivation Panel */
                  <div className="mt-5 space-y-5">
                    {(() => {
                      const myIndex = leaderboardData.findIndex(item => item.agent.id === activeAgent.id);
                      if (myIndex === -1) return null;
                      const myItem = leaderboardData[myIndex];
                      const topItem = leaderboardData[0];
                      const isMeFirst = myItem.rank === 1 && myItem.sales > 0;
                      const leaderDiff = topItem.sales - myItem.sales;

                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                          {/* Left Column: Personal Race Standing & Analytics */}
                          <div className="lg:col-span-7 bg-slate-900/40 p-4.5 rounded-xl border border-navy-800/60 flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Race Standing ({selectedLeaderboardMonth === '2026-07' ? 'Current Month' : 'Selected Month'})</p>
                                  <h4 className="text-lg font-black text-white font-display mt-0.5">
                                    {isMeFirst ? '👑 You are leading the pack!' : `You are ranked #${myItem.rank} on the leaderboard`}
                                  </h4>
                                </div>
                                <div className="px-3 py-1.5 bg-slate-950 rounded-xl border border-navy-800/80 text-center font-mono shrink-0">
                                  <p className="text-[9px] text-slate-500 uppercase font-bold">My Rank</p>
                                  <p className="text-base font-black text-teal-400">#{myItem.rank}</p>
                                </div>
                              </div>

                              {/* Progress visual or comparison */}
                              <div className="space-y-1.5 mt-3">
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">My Sales:</span>
                                  <span className="font-bold text-white font-mono">{myItem.sales.toLocaleString()} UGX</span>
                                </div>
                                
                                {!isMeFirst && topItem.sales > 0 && (
                                  <div className="space-y-1.5">
                                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-navy-800">
                                      <div 
                                        className="bg-teal-500 h-full rounded-full transition-all duration-500" 
                                        style={{ width: `${Math.min(100, (myItem.sales / topItem.sales) * 100)}%` }}
                                      />
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                      <span className="text-slate-500">Leader ({topItem.agent.name}):</span>
                                      <span className="text-teal-400 font-mono font-bold">{topItem.sales.toLocaleString()} UGX</span>
                                    </div>
                                    <div className="bg-teal-500/5 p-2.5 rounded-lg border border-teal-500/10 text-[11px] text-teal-300 flex items-center gap-1.5">
                                      <TrendingUp className="h-4 w-4 text-teal-400 shrink-0" />
                                      <span>Sell another <strong>{leaderDiff.toLocaleString()} UGX</strong> to overtake the lead and win 25% commission!</span>
                                    </div>
                                  </div>
                                )}

                                {isMeFirst && myItem.sales >= 250000 && (
                                  <div className="bg-yellow-500/5 p-3 rounded-lg border border-yellow-500/10 text-xs text-yellow-300 space-y-1">
                                    <div className="flex items-center gap-1.5 font-bold">
                                      <Crown className="h-4 w-4 text-yellow-400 shrink-0" />
                                      <span>Commission Boost Active (25%!)</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">
                                      Incredible job! You are currently the #1 performer and have met the compulsory monthly threshold. The system has automatically upgraded your commission level to <strong>25%</strong> for all your transactions!
                                    </p>
                                  </div>
                                )}

                                {isMeFirst && myItem.sales < 250000 && (
                                  <div className="bg-rose-500/5 p-3 rounded-lg border border-rose-500/10 text-xs text-rose-300 space-y-2">
                                    <div className="flex items-center gap-1.5 font-bold">
                                      <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                                      <span>Commission Boost Locked (Under 250K UGX)</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">
                                      You are in 1st Place! However, you must meet the compulsory monthly sales threshold of <strong>250,000 UGX</strong> to activate the 25% commission rate boost.
                                    </p>
                                    <div className="bg-slate-950 p-2 rounded border border-navy-800 text-[10px] space-y-1">
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Remaining Sales:</span>
                                        <span className="font-bold text-rose-400 font-mono">{(250000 - myItem.sales).toLocaleString()} UGX</span>
                                      </div>
                                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                        <div 
                                          className="bg-rose-500 h-full rounded-full" 
                                          style={{ width: `${Math.round((myItem.sales / 250000) * 100)}%` }} 
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="border-t border-navy-800/60 pt-3 mt-4 text-[10px] text-slate-500 leading-relaxed">
                              💡 Automated rules: Monthly sales are calculated from the 1st of each calendar month. The leaderboard winner gains 25% commission rate automatically, <strong>provided they meet the compulsory condition of 250,000 UGX in monthly sales</strong>. Otherwise, they receive their base rate. Other agents receive base commissions.
                            </div>
                          </div>

                          {/* Right Column: Mini leaderboard grid (Top 3 standings) */}
                          <div className="lg:col-span-5 bg-slate-900/20 p-4 rounded-xl border border-navy-800/40 space-y-3 flex flex-col justify-between">
                            <div>
                              <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">Reseller Standings List</h5>
                              <div className="space-y-2">
                                {leaderboardData.slice(0, 3).map((item, idx) => {
                                  const isMe = item.agent.id === activeAgent.id;
                                  return (
                                    <div 
                                      key={item.agent.id} 
                                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition ${
                                        isMe 
                                          ? 'bg-teal-500/10 border-teal-500/20 text-white' 
                                          : 'bg-slate-950/40 border-navy-800/40 text-slate-300'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 truncate">
                                        <span className={`h-5 w-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                                          item.rank === 1 
                                            ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25' 
                                            : 'bg-slate-900 text-slate-400'
                                        }`}>
                                          #{item.rank}
                                        </span>
                                        <div className="truncate">
                                          <p className="font-bold truncate flex items-center gap-1.5">
                                            {item.agent.name}
                                            {isMe && <span className="px-1.5 py-0.2 bg-teal-500 text-navy-950 rounded-[4px] font-black text-[8px] uppercase">You</span>}
                                          </p>
                                          <p className="text-[9px] text-slate-500 truncate">{item.agent.location}</p>
                                        </div>
                                      </div>
                                      <span className="font-mono font-bold text-slate-300 shrink-0">{item.sales.toLocaleString()} UGX</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="bg-slate-950 p-2.5 rounded-lg border border-navy-800/50 text-[10px] text-slate-400 mt-2 flex items-center gap-2">
                              <Award className="h-4 w-4 text-teal-400 shrink-0" />
                              <span>Your default base commission: <strong>{activeAgent.id === 'agent-3' ? '12%' : '10%'}</strong>. Overtake to unlock 25%!</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
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

              {/* Super Admin Smart Plan Allocations */}
              {currentRole === 'Super Admin' && (
                <div className="bg-slate-950 p-5 rounded-xl border border-navy-700 space-y-4">
                  <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-teal-400" />
                      <div>
                        <h3 className="text-sm font-black text-white font-display">Smart Advisor Plan Allocations</h3>
                        <p className="text-[11px] text-slate-400">Map the client portal's Smart Plan categories to any billing packages in real-time.</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded text-[10px] font-bold font-mono uppercase">Super Admin Panel</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(state.smartPlans || []).map((plan) => {
                      // Determine icon for visualization
                      let PlanIcon = User;
                      let iconColorClass = "text-slate-400 bg-navy-900";
                      if (plan.key === 'browse') {
                        PlanIcon = Smartphone;
                        iconColorClass = "text-sky-400 bg-sky-500/10 border-sky-500/20";
                      } else if (plan.key === 'study') {
                        PlanIcon = GraduationCap;
                        iconColorClass = "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
                      } else if (plan.key === 'video') {
                        PlanIcon = Tv;
                        iconColorClass = "text-rose-400 bg-rose-500/10 border-rose-500/20";
                      } else if (plan.key === 'household') {
                        PlanIcon = User;
                        iconColorClass = "text-teal-400 bg-teal-500/10 border-teal-500/20";
                      }

                      return (
                        <div key={plan.key} className="bg-slate-900/40 border border-navy-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-navy-700 transition">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg border ${iconColorClass}`}>
                              <PlanIcon className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-bold text-white">{plan.label}</h4>
                              <p className="text-[10px] text-slate-400 leading-normal">{plan.desc}</p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-navy-800/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">Allocated Package:</span>
                            <select
                              value={plan.targetPkg}
                              onChange={(e) => {
                                const newPkgId = e.target.value;
                                const planIndex = state.smartPlans.findIndex(p => p.key === plan.key);
                                if (planIndex !== -1) {
                                  const oldPkgId = state.smartPlans[planIndex].targetPkg;
                                  const oldPkg = state.packages.find(p => p.id === oldPkgId);
                                  const newPkg = state.packages.find(p => p.id === newPkgId);
                                  
                                  state.smartPlans[planIndex].targetPkg = newPkgId;
                                  state.addLog(
                                    'Super Admin',
                                    'Super Admin Console',
                                    'Smart Plan Allocation Changed',
                                    `Reallocated Smart Plan "${plan.label}" target package from ${oldPkg ? oldPkg.name : oldPkgId} to ${newPkg ? newPkg.name : newPkgId}.`
                                  );
                                  state.save();
                                  onStateUpdate();
                                }
                              }}
                              className="bg-slate-950 text-white text-[11px] font-mono border border-navy-700 rounded px-2.5 py-1.5 focus:border-teal-500 focus:outline-none max-w-full sm:max-w-[200px]"
                            >
                              {state.packages.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                  {pkg.name} ({pkg.priceUGX.toLocaleString()} UGX)
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
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
                  
                  {/* Left Column: Sell Form / Bulk Stock Form */}
                  <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-navy-700 space-y-5">
                    
                    {/* Sub-tab selection */}
                    <div className="flex bg-slate-900 p-1 rounded-xl border border-navy-800">
                      <button 
                        type="button"
                        onClick={() => {
                          setAgentBulkTab('single');
                          setSellError(null);
                        }}
                        className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${agentBulkTab === 'single' ? 'bg-teal-500 text-navy-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        Single Retail Sale
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setAgentBulkTab('bulk');
                          setAgentBulkError(null);
                        }}
                        className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${agentBulkTab === 'bulk' ? 'bg-teal-500 text-navy-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        Bulk Stock Purchase
                      </button>
                    </div>

                    {agentBulkTab === 'single' ? (
                      /* SINGLE VOUCHER GENERATION */
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4.5 w-4.5 text-teal-400" />
                          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-display">Generate New Customer Voucher</h2>
                        </div>
                        
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
                              className="w-full px-3 py-2.5 bg-slate-900 border border-navy-600 rounded-lg text-xs text-white font-bold focus:ring-1 focus:ring-teal-500 focus:outline-none"
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
                            className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-navy-800 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                            id="agent-generate-voucher-btn"
                          >
                            <Plus className="h-4 w-4" />
                            Generate Cash Voucher
                          </button>
                        </form>
                      </div>
                    ) : (
                      /* BULK STOCK PURCHASE */
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4.5 w-4.5 text-yellow-400" />
                          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-display">Bulk Voucher Stocking Bundle</h2>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Purchase voucher codes in bulk to hold in your stock. Choose exact quantities for each plan according to your sales report. 
                          <span className="text-purple-300 font-bold block mt-1">✓ 10% commission will automatically remit to your wallet after a coupon has been successfully sold &amp; activated by a customer.</span>
                        </p>

                        {agentBulkError && (
                          <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-lg flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />
                            <span>{agentBulkError}</span>
                          </div>
                        )}

                        {agentBulkPaymentStep === 'form' && (
                          <form onSubmit={handleAgentBulkPurchase} className="space-y-4">
                            
                            {/* Quantities selector per package */}
                            <div className="space-y-3 bg-slate-900/40 p-3.5 border border-navy-800 rounded-xl">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Set Stock Quantities</label>
                              <div className="space-y-2">
                                {state.packages.map(p => {
                                  const qty = bulkQuantities[p.id] || 0;
                                  const subtotal = qty * p.priceUGX;
                                  return (
                                    <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-navy-850 hover:border-navy-750 transition-all gap-3 sm:gap-4">
                                      <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm sm:text-xs text-white truncate">{p.name}</div>
                                        <div className="text-[11px] sm:text-[10px] text-slate-400 font-medium font-mono mt-0.5">{p.speed} • {p.priceUGX.toLocaleString()} UGX</div>
                                      </div>
                                      
                                      <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 border-t border-navy-850 sm:border-t-0 sm:pt-0 shrink-0">
                                        <div className="flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setBulkQuantities(prev => ({
                                                ...prev,
                                                [p.id]: Math.max(0, (prev[p.id] || 0) - 1)
                                              }));
                                            }}
                                            className="w-8 h-8 sm:w-7 sm:h-7 bg-navy-800 hover:bg-navy-700 text-slate-300 font-bold rounded-lg flex items-center justify-center text-xs transition cursor-pointer select-none"
                                          >
                                            -
                                          </button>
                                          
                                          <input
                                            type="number"
                                            min="0"
                                            max="200"
                                            value={qty || ''}
                                            placeholder="0"
                                            onChange={(e) => {
                                              const val = Math.max(0, parseInt(e.target.value) || 0);
                                              setBulkQuantities(prev => ({
                                                ...prev,
                                                [p.id]: val
                                              }));
                                            }}
                                            className="w-12 h-8 sm:h-7 bg-slate-900 border border-navy-700 rounded-lg text-center font-mono text-xs text-teal-400 font-bold focus:outline-none focus:border-teal-500"
                                          />
                                          
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setBulkQuantities(prev => ({
                                                ...prev,
                                                [p.id]: (prev[p.id] || 0) + 1
                                              }));
                                            }}
                                            className="w-8 h-8 sm:w-7 sm:h-7 bg-navy-800 hover:bg-navy-700 text-slate-300 font-bold rounded-lg flex items-center justify-center text-xs transition cursor-pointer select-none"
                                          >
                                            +
                                          </button>
                                        </div>

                                        <div className="w-24 sm:w-20 text-right font-mono text-xs font-bold text-slate-200">
                                          {subtotal > 0 ? `${subtotal.toLocaleString()} UGX` : '—'}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Payment Method Selector */}
                            {agentBulkAllocation && agentBulkAllocation.totalCostUGX > 0 && (
                              <div className="space-y-3 bg-slate-900/40 p-3.5 border border-navy-800 rounded-xl">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Choose Payment Method</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {/* Wallet */}
                                  <button
                                    type="button"
                                    onClick={() => setAgentBulkPaymentMethod('Wallet')}
                                    className={`p-2.5 rounded-xl border text-left transition-all relative ${
                                      agentBulkPaymentMethod === 'Wallet'
                                        ? 'bg-teal-500/10 border-teal-500 text-white'
                                        : 'bg-slate-950/40 border-navy-850 text-slate-400 hover:border-navy-750'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Wallet className={`h-4 w-4 ${agentBulkPaymentMethod === 'Wallet' ? 'text-teal-400' : 'text-slate-500'}`} />
                                      <span className="text-xs font-bold">Wallet Balance</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-1 font-mono">
                                      Bal: {activeAgent.walletBalance.toLocaleString()} UGX
                                    </div>
                                  </button>

                                  {/* MTN MoMo */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAgentBulkPaymentMethod('MTN');
                                      if (!agentBulkPaymentPhone) setAgentBulkPaymentPhone('0770000000');
                                    }}
                                    className={`p-2.5 rounded-xl border text-left transition-all relative ${
                                      agentBulkPaymentMethod === 'MTN'
                                        ? 'bg-yellow-500/10 border-yellow-500 text-white'
                                        : 'bg-slate-950/40 border-navy-850 text-slate-400 hover:border-navy-750'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Phone className={`h-4 w-4 ${agentBulkPaymentMethod === 'MTN' ? 'text-yellow-400' : 'text-slate-500'}`} />
                                      <span className="text-xs font-bold">MTN MoMo</span>
                                    </div>
                                    <div className="text-[10px] text-yellow-500/80 mt-1 font-semibold">
                                      Instant push payment
                                    </div>
                                  </button>

                                  {/* Airtel Money */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAgentBulkPaymentMethod('Airtel');
                                      if (!agentBulkPaymentPhone) setAgentBulkPaymentPhone('0700000000');
                                    }}
                                    className={`p-2.5 rounded-xl border text-left transition-all relative ${
                                      agentBulkPaymentMethod === 'Airtel'
                                        ? 'bg-red-500/10 border-red-500 text-white'
                                        : 'bg-slate-950/40 border-navy-850 text-slate-400 hover:border-navy-750'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Phone className={`h-4 w-4 ${agentBulkPaymentMethod === 'Airtel' ? 'text-red-400' : 'text-slate-500'}`} />
                                      <span className="text-xs font-bold">Airtel Money</span>
                                    </div>
                                    <div className="text-[10px] text-red-400/80 mt-1 font-semibold">
                                      Instant push payment
                                    </div>
                                  </button>

                                  {/* Pesapal */}
                                  <button
                                    type="button"
                                    onClick={() => setAgentBulkPaymentMethod('Pesapal')}
                                    className={`p-2.5 rounded-xl border text-left transition-all relative ${
                                      agentBulkPaymentMethod === 'Pesapal'
                                        ? 'bg-purple-500/10 border-purple-500 text-white'
                                        : 'bg-slate-950/40 border-navy-850 text-slate-400 hover:border-navy-750'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Database className={`h-4 w-4 ${agentBulkPaymentMethod === 'Pesapal' ? 'text-purple-400' : 'text-slate-500'}`} />
                                      <span className="text-xs font-bold">Bank via Pesapal</span>
                                    </div>
                                    <div className="text-[10px] text-purple-400/80 mt-1 font-semibold">
                                      Debit / Credit card
                                    </div>
                                  </button>
                                </div>

                                {/* Phone number entry for MoMo */}
                                {(agentBulkPaymentMethod === 'MTN' || agentBulkPaymentMethod === 'Airtel') && (
                                  <div className="space-y-1.5 pt-2 border-t border-navy-850">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Mobile Money Phone Number</label>
                                    <input
                                      type="tel"
                                      placeholder="0772123456"
                                      value={agentBulkPaymentPhone}
                                      onChange={(e) => setAgentBulkPaymentPhone(e.target.value)}
                                      className="w-full px-3 py-2 bg-slate-950 border border-navy-700 rounded-lg text-xs text-white focus:outline-none focus:border-teal-500 font-mono font-bold"
                                    />
                                    <p className="text-[10px] text-slate-500 leading-normal">
                                      Please enter your registered 10-digit mobile number. A simulated push PIN dialog prompt will display to approve the {agentBulkAllocation.totalCostUGX.toLocaleString()} UGX.
                                    </p>
                                  </div>
                                )}

                                {agentBulkPaymentMethod === 'Pesapal' && (
                                  <div className="pt-2 border-t border-navy-850 text-[10px] text-slate-500 leading-normal">
                                    You will proceed to our simulated secure bank interface hosted through Pesapal integrations. Supporting all Ugandan card issuers and local bank accounts.
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Display Calculations */}
                            {agentBulkAllocation && agentBulkAllocation.totalCostUGX > 0 && (
                              <div className="bg-slate-900/60 p-3 rounded-xl border border-navy-700/50 space-y-2 text-xs">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400">Total Voucher Stock Price:</span>
                                  <span className="font-mono font-bold text-white">{agentBulkAllocation.totalCostUGX.toLocaleString()} UGX</span>
                                </div>
                                <div className="flex justify-between items-center text-teal-400 font-semibold text-[11px]">
                                  <span>Payment Mode Selected:</span>
                                  <span className="font-mono bg-navy-800 px-2 py-0.5 rounded text-white text-[10px] font-bold">{agentBulkPaymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center text-purple-400">
                                  <span className="flex items-center gap-1 font-semibold">
                                    <Sparkles className="h-3 w-3 text-yellow-400" />
                                    Deferred Reseller Commission (10%):
                                  </span>
                                  <span className="font-mono font-black">+ {Math.round(agentBulkAllocation.totalCostUGX * 0.10).toLocaleString()} UGX</span>
                                </div>
                                
                                {agentBulkPaymentMethod === 'Wallet' && (
                                  <div className="flex justify-between items-center text-xs text-slate-400">
                                    <span>Agent Current Wallet Balance:</span>
                                    <span className={`font-mono font-bold ${activeAgent.walletBalance < agentBulkAllocation.totalCostUGX ? 'text-red-400' : 'text-slate-300'}`}>
                                      {activeAgent.walletBalance.toLocaleString()} UGX
                                    </span>
                                  </div>
                                )}
                                
                                <div className="flex justify-between border-t border-navy-700/60 pt-2 text-purple-300 font-bold">
                                  <span>Net Investment After Sales:</span>
                                  <span className="font-mono">{(agentBulkAllocation.totalCostUGX - Math.round(agentBulkAllocation.totalCostUGX * 0.10)).toLocaleString()} UGX</span>
                                </div>
                              </div>
                            )}

                            <button 
                              type="submit"
                              disabled={
                                agentBulkAllocation.totalCostUGX <= 0 || 
                                (agentBulkPaymentMethod === 'Wallet' && activeAgent.walletBalance < agentBulkAllocation.totalCostUGX)
                              }
                              className={`w-full py-3 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 ${
                                agentBulkAllocation.totalCostUGX > 0 && (agentBulkPaymentMethod !== 'Wallet' || activeAgent.walletBalance >= agentBulkAllocation.totalCostUGX)
                                  ? 'bg-teal-500 hover:bg-teal-600 text-navy-800 cursor-pointer' 
                                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              <Sparkles className="h-4 w-4" />
                              {agentBulkPaymentMethod === 'Wallet' && "Purchase with Wallet Balance"}
                              {(agentBulkPaymentMethod === 'MTN' || agentBulkPaymentMethod === 'Airtel') && `Pay via ${agentBulkPaymentMethod} Mobile Money`}
                              {agentBulkPaymentMethod === 'Pesapal' && "Secure Checkout via Pesapal"}
                            </button>
                          </form>
                        )}

                        {/* Interactive Mobile USSD PIN simulation panel */}
                        {agentBulkPaymentStep === 'ussd' && (
                          <motion.div 
                            initial={{ scale: 0.98, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-slate-900 border border-yellow-500/40 p-5 rounded-2xl space-y-4 max-w-md mx-auto"
                          >
                            <div className="text-center">
                              <div className="inline-flex p-3 bg-yellow-500/10 text-yellow-400 rounded-full mb-2">
                                <Phone className="h-6 w-6 animate-bounce" />
                              </div>
                              <h3 className="text-sm font-black text-white tracking-wide uppercase">
                                {agentBulkPaymentMethod === 'MTN' ? 'MTN MoMo Gateway' : 'Airtel Money Portal'}
                              </h3>
                              <p className="text-[11px] text-slate-400 mt-0.5">Secure Carrier Authorization Push</p>
                            </div>

                            <div className="bg-slate-950 p-3.5 rounded-xl text-center space-y-1 text-xs border border-navy-850">
                              <p className="text-slate-400">Total Purchase Authorization Request</p>
                              <p className="text-lg font-mono font-black text-white">{agentBulkAllocation.totalCostUGX.toLocaleString()} UGX</p>
                              <p className="text-[10px] text-slate-500 mt-1">Recipient: <span className="text-slate-300">WIFI ZONE Bulk Stock</span></p>
                              <p className="text-[10px] text-slate-500">Phone Account: <span className="text-slate-300 font-mono">{agentBulkPaymentPhone}</span></p>
                            </div>

                            <form onSubmit={handleAgentBulkUssdPinSubmit} className="space-y-3.5">
                              <div className="space-y-1.5">
                                <label className="text-[10px] text-center font-bold text-slate-300 uppercase tracking-wider block">
                                  Enter your Mobile Money PIN
                                </label>
                                <input
                                  type="password"
                                  maxLength={5}
                                  placeholder="••••"
                                  value={agentBulkUssdPin}
                                  onChange={(e) => setAgentBulkUssdPin(e.target.value.replace(/[^0-9]/g, ''))}
                                  className="w-32 mx-auto text-center px-3 py-2 bg-slate-950 border-2 border-navy-700 rounded-xl text-lg font-mono font-bold tracking-widest text-teal-400 focus:outline-none focus:border-yellow-500 block"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2.5 pt-2">
                                <button
                                  type="button"
                                  onClick={() => setAgentBulkPaymentStep('form')}
                                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer transition-all"
                                >
                                  Cancel Payment
                                </button>
                                <button
                                  type="submit"
                                  className="py-2.5 bg-yellow-500 hover:bg-yellow-600 text-navy-950 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1 shadow-md shadow-yellow-500/10"
                                >
                                  <Check className="h-4 w-4" />
                                  Approve &amp; Pay
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        )}

                        {/* Interactive Pesapal Card Checkout Simulator */}
                        {agentBulkPaymentStep === 'pesapal_card' && (
                          <motion.div
                            initial={{ scale: 0.98, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-slate-900 border border-purple-500/40 p-5 rounded-2xl space-y-4 max-w-md mx-auto"
                          >
                            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                              <div>
                                <h3 className="text-xs font-black text-white tracking-wide uppercase">PESAPAL SECURE GATEWAY</h3>
                                <p className="text-[9px] text-purple-400 font-medium">128-Bit SSL Encrypted Credit/Debit Auth</p>
                              </div>
                              <div className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-[9px] font-bold">
                                SECURE LOCK
                              </div>
                            </div>

                            <div className="bg-slate-950 p-3 rounded-xl space-y-1.5 text-xs border border-navy-850">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Order:</span>
                                <span className="text-white font-semibold">Bulk Stocking Batch</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Grand Total:</span>
                                <span className="text-purple-400 font-mono font-bold">{agentBulkAllocation.totalCostUGX.toLocaleString()} UGX</span>
                              </div>
                            </div>

                            <form onSubmit={handleAgentBulkPesapalSubmit} className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase block">Cardholder Name</label>
                                <input
                                  type="text"
                                  placeholder="John Doe"
                                  required
                                  value={agentBulkCardHolder}
                                  onChange={(e) => setAgentBulkCardHolder(e.target.value)}
                                  className="w-full px-3 py-2 bg-slate-950 border border-navy-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase block">Debit / Credit Card Number</label>
                                <input
                                  type="text"
                                  maxLength={19}
                                  placeholder="4000 1234 5678 9010"
                                  required
                                  value={agentBulkCardNumber}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                                    setAgentBulkCardNumber(formatted);
                                  }}
                                  className="w-full px-3 py-2 bg-slate-950 border border-navy-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500 font-mono font-bold"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2.5">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Expiry (MM/YY)</label>
                                  <input
                                    type="text"
                                    placeholder="12/28"
                                    maxLength={5}
                                    required
                                    value={agentBulkCardExpiry}
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/[^0-9]/g, '');
                                      if (val.length >= 2) {
                                        setAgentBulkCardExpiry(val.slice(0, 2) + '/' + val.slice(2, 4));
                                      } else {
                                        setAgentBulkCardExpiry(val);
                                      }
                                    }}
                                    className="w-full px-3 py-2 bg-slate-950 border border-navy-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500 font-mono font-bold text-center"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase block">CVV</label>
                                  <input
                                    type="password"
                                    placeholder="•••"
                                    maxLength={3}
                                    required
                                    value={agentBulkCardCvv}
                                    onChange={(e) => setAgentBulkCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="w-full px-3 py-2 bg-slate-950 border border-navy-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500 font-mono font-bold text-center"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => setAgentBulkPaymentStep('form')}
                                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer transition-all"
                                >
                                  Cancel Payment
                                </button>
                                <button
                                  type="submit"
                                  className="py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1 shadow-md shadow-purple-500/10"
                                >
                                  <Check className="h-4 w-4" />
                                  Confirm Secure Pay
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        )}

                        {/* Interactive loading spinner overlay screen */}
                        {agentBulkPaymentStep === 'processing' && (
                          <div className="bg-slate-900 border border-navy-800 p-8 rounded-2xl flex flex-col items-center justify-center space-y-4 text-center min-h-[300px]">
                            <RefreshCw className="h-10 w-10 text-teal-400 animate-spin" />
                            <div className="space-y-1">
                              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Gateway Authorization</h3>
                              <p className="text-xs text-slate-400 animate-pulse">Contacting carrier node &amp; validating security protocols...</p>
                            </div>
                            <div className="max-w-xs bg-slate-950 p-2.5 border border-navy-900 rounded-lg text-[10px] text-slate-500 font-mono leading-relaxed">
                              DURING THIS DEMO STAGE: Standard merchant callback response simulated. Creating secure un-redeemed vouchers &amp; logging transactions.
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Printable / Copyable Invoice & Vouchers Receipt */}
                  <div className="lg:col-span-6 flex flex-col justify-center items-center">
                    {agentBulkTab === 'single' ? (
                      soldVoucherDetail ? (
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-white text-slate-900 p-6 rounded-2xl w-full max-w-sm border-2 border-dashed border-slate-300 shadow-2xl relative"
                        >
                          {/* Cut corner visual effects */}
                          <div className="absolute top-1/2 -left-3 w-6 h-6 bg-navy-900 rounded-full" />
                          <div className="absolute top-1/2 -right-3 w-6 h-6 bg-navy-900 rounded-full" />

                          <div className="text-center pb-4 border-b-2 border-dashed border-slate-200 flex flex-col items-center">
                            <TBSLogo isLightBg={true} textColor="text-slate-900" iconSize={36} className="mb-2" />
                            <h3 className="text-base font-bold tracking-tight uppercase text-slate-800">WIFI ZONE</h3>
                            <p className="text-[9px] text-slate-500 font-semibold font-display">Internet that works when you need it.</p>
                            <p className="text-[8px] text-slate-400 font-mono mt-0.5">Plot 14, Kampala Road, Uganda | support@wifizone.co.ug</p>
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

                          <div className="text-center pt-4 border-t-2 border-dashed border-slate-200 text-[10px] text-slate-500 leading-relaxed font-sans">
                            <p className="font-bold">Authorized Agent Receipt</p>
                            <p>{activeAgent.name} • {activeAgent.location} Storefront</p>
                            <div className="flex items-center justify-center gap-1.5 mt-2">
                              <button 
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(soldVoucherDetail.code);
                                  alert("Voucher code copied!");
                                }}
                                className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold cursor-pointer"
                              >
                                Copy Code
                              </button>
                              <button 
                                type="button"
                                onClick={() => window.print()}
                                className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold flex items-center gap-1 cursor-pointer"
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
                      )
                    ) : (
                      /* BULK INVENTORY RECEIPT VISUALIZER */
                      agentBulkSuccessVouchers.length > 0 ? (
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-white text-slate-900 p-6 rounded-2xl w-full border-2 border-dashed border-slate-300 shadow-2xl relative flex flex-col max-h-[580px]"
                        >
                          <div className="text-center pb-4 border-b-2 border-dashed border-slate-200 shrink-0">
                            <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 font-bold text-[9px] rounded-full uppercase tracking-wider inline-block mb-1.5">Stocking Invoice</span>
                            <h3 className="text-base font-bold tracking-tight uppercase">WIFI ZONE Bulk Stock Sheet</h3>
                            <p className="text-[9px] text-slate-500 font-semibold font-display">Generated {agentBulkSuccessVouchers.length} physical vouchers successfully!</p>
                          </div>

                          <div className="py-4 flex-1 overflow-y-auto min-h-0 space-y-4">
                            <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-xs space-y-1">
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-semibold">Reseller Name:</span>
                                <span className="font-bold text-slate-800">{activeAgent.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-semibold">Location:</span>
                                <span className="font-bold text-slate-800">{activeAgent.location}</span>
                              </div>
                              <div className="flex justify-between text-purple-600 font-bold">
                                <span>Deferred Commission (10%):</span>
                                <span>{(agentBulkSuccessVouchers.reduce((acc, v) => acc + (state.packages.find(p => p.id === v.packageId)?.priceUGX || 0), 0) * (activeAgent.commissionPercent || 10) / 100).toLocaleString()} UGX</span>
                              </div>
                            </div>

                            <div className="text-[10px] text-purple-700 bg-purple-50 border border-purple-100 p-2.5 rounded-lg leading-normal font-medium">
                              ✓ Your 10% commission is deferred. Vouchers will generate and activate when customers connect. Wallet balances credit automatically as soon as each coupon is successfully sold.
                            </div>

                            <div className="space-y-1.5">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Generated Voucher Stock Inventory</p>
                              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                {agentBulkSuccessVouchers.map((v, idx) => {
                                  const p = state.packages.find(pkg => pkg.id === v.packageId);
                                  return (
                                    <div key={v.code} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200/50 text-xs">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-400 font-bold font-mono">#{idx+1}</span>
                                        <div>
                                          <p className="font-mono font-black text-slate-900 tracking-wider text-sm">{v.code}</p>
                                          <p className="text-[9px] text-slate-500 font-medium">{p?.name} • {p?.speed}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-mono font-bold text-slate-600">{(p?.priceUGX || 0).toLocaleString()} UGX</span>
                                        <button 
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText(v.code);
                                            alert(`Copied code: ${v.code}`);
                                          }}
                                          className="p-1 bg-white hover:bg-slate-200 rounded border border-slate-200 text-slate-700 transition cursor-pointer"
                                          title="Copy code"
                                        >
                                          <Copy className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="text-center pt-4 border-t-2 border-dashed border-slate-200 text-[10px] text-slate-500 leading-relaxed shrink-0">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                type="button"
                                onClick={() => {
                                  const listStr = agentBulkSuccessVouchers.map(v => `${v.code} - ${state.packages.find(p => p.id === v.packageId)?.name || 'Hotspot'}`).join('\n');
                                  navigator.clipboard.writeText(listStr);
                                  alert("All voucher codes copied to clipboard!");
                                }}
                                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold flex items-center gap-1 transition cursor-pointer text-xs"
                              >
                                <Copy className="h-3 w-3" />
                                Copy All codes
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  const listStr = `============================================================
WIFI ZONE LTD
Plot 14, Kampala Road, Kampala, Uganda
Tel: +256 772 900 801 | Email: billing@wifizone.co.ug
Web: www.wifizone.co.ug
------------------------------------------------------------
WIFI ZONE RESELLER STOCK SHEET
Batch Date: ${new Date().toLocaleDateString()}
Reseller: ${activeAgent.name} (${activeAgent.location})
============================================================

` + agentBulkSuccessVouchers.map((v, idx) => `${idx+1}. Code: ${v.code} | Package: ${state.packages.find(p => p.id === v.packageId)?.name || 'Hotspot'} | Price: ${(state.packages.find(p => p.id === v.packageId)?.priceUGX || 0).toLocaleString()} UGX`).join('\n');
                                  const blob = new Blob([listStr], { type: 'text/plain' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `Vouchers_Stock_Batch_${new Date().toISOString().split('T')[0]}.txt`;
                                  a.click();
                                }}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center gap-1 transition cursor-pointer text-xs"
                              >
                                <Download className="h-3 w-3" />
                                Save as TXT
                              </button>
                              <button 
                                type="button"
                                onClick={() => window.print()}
                                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer text-xs"
                              >
                                <Printer className="h-3 w-3" />
                                Print Sheet
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-center p-8 bg-slate-950 rounded-xl border border-navy-700/50 w-full max-w-sm text-slate-400">
                          <Sparkles className="h-12 w-12 mx-auto text-slate-600 mb-3 animate-pulse" />
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Ready to stock bulk?</h3>
                          <p className="text-xs text-slate-500 mt-1">Configure your stock budget on the left to review the automatically assigned vouchers distribution, then buy.</p>
                        </div>
                      )
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
                                  <td className="p-3 font-medium text-slate-200">
                                    <div className="font-semibold">{pkg?.name || 'Unknown'}</div>
                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                      {pkg?.speed} • {pkg?.priceUGX.toLocaleString()} UGX
                                    </div>
                                  </td>
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
                      <th className="p-3">Device / MAC Address</th>
                      <th className="p-3">DHCP IP Lease</th>
                      <th className="p-3">Voucher Used</th>
                      <th className="p-3">Status / Speed</th>
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
                          <td className="p-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-white flex items-center gap-1.5">
                                <Smartphone className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                                {s.deviceModel || 'Unknown Device'}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400 font-medium select-all">{s.mac}</span>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-slate-300">{s.ipAddress}</td>
                          <td className="p-3 font-mono">
                            {s.status === 'pre-auth' ? (
                              <span className="text-slate-500 italic">No Coupon Linked</span>
                            ) : (
                              <span className="text-teal-400 font-bold">{s.voucherCode}</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col gap-1">
                              {s.status === 'pre-auth' ? (
                                <span className="inline-flex items-center w-max px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 font-mono rounded text-[9px] font-extrabold border border-yellow-500/20 uppercase tracking-wider">
                                  Pre-Auth Lease
                                </span>
                              ) : (
                                <span className="inline-flex items-center w-max px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 font-mono rounded text-[9px] font-extrabold border border-emerald-500/20 uppercase tracking-wider">
                                  Authorized
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 font-mono">
                                {s.speed}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-slate-300 font-medium">
                            {s.status === 'pre-auth' ? (
                              <span className="text-slate-400 text-[10px]">Awaiting coupon/ads</span>
                            ) : s.voucherCode === "FREE-TRIAL-TEMP" ? (
                              'Free Trial Loop'
                            ) : (
                              'Standard Plan clock'
                            )}
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

                    <div className="pt-4 mt-4 border-t border-navy-800 flex items-center justify-between gap-2">
                      <div className="text-[10px] text-slate-500">
                        {agent.lastWithdrawalTime ? (
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-500 font-bold uppercase">Last Withdraw:</span>
                            <span className="font-mono text-amber-400 font-semibold">{new Date(agent.lastWithdrawalTime).toLocaleDateString()}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const agentIndex = state.agents.findIndex(a => a.id === agent.id);
                                if (agentIndex !== -1) {
                                  delete state.agents[agentIndex].lastWithdrawalTime;
                                  state.addLog(
                                    'Super Admin',
                                    'Super Admin Console',
                                    'Agent Withdrawal Cooldown Reset',
                                    `Reset weekly withdrawal restriction for ${agent.name}.`
                                  );
                                  state.save();
                                  onStateUpdate();
                                }
                              }}
                              className="text-[9px] text-rose-400 hover:text-rose-300 hover:underline mt-0.5 text-left font-bold"
                            >
                              Reset Cooldown
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-500 font-bold uppercase">Withdraw Status:</span>
                            <span className="text-emerald-400 font-semibold text-[10px]">Ready</span>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedAgentForTopup(agent);
                          setTopupAmount(50000);
                        }}
                        className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-navy-800 font-bold text-[10px] rounded-lg transition shrink-0"
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-950 p-5 rounded-xl border border-navy-700">
                <div>
                  <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                    <Activity className="h-5 w-5 text-teal-400" />
                    RouterOS Hotspot Status & APs
                  </h2>
                  <p className="text-xs text-slate-400">Remote MikroTik Router connection status, auto IP assignment, and AP fleet provisioning</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddApForm(!showAddApForm)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-slate-950 text-xs font-black rounded-lg shadow-lg hover:shadow-teal-500/20 transition-all flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Remote Provision AP
                </button>
              </div>

              {/* REMOTE AP PROVISIONING FORM */}
              {showAddApForm && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-950 p-6 rounded-xl border border-teal-500/30 shadow-xl space-y-4"
                >
                  <div className="pb-3 border-b border-navy-800 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-teal-400 font-display flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Provision New Access Point (AP) Remotely
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">Dynamic IP Assignment Enabled</span>
                  </div>

                  {newApNotification && (
                    <div className={`p-3 rounded text-xs font-bold ${newApNotification.startsWith('Error') ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'}`}>
                      {newApNotification}
                    </div>
                  )}

                  <form onSubmit={handleAddAp} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access Point Name</label>
                      <input 
                        type="text" 
                        value={newApName}
                        onChange={(e) => setNewApName(e.target.value)}
                        placeholder="e.g. Soroti Main Tower AP"
                        className="w-full px-3 py-2 bg-slate-900 border border-navy-600 rounded text-slate-300 focus:outline-none focus:border-teal-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AP Geographic Location</label>
                      <input 
                        type="text" 
                        value={newApLocation}
                        onChange={(e) => setNewApLocation(e.target.value)}
                        placeholder="e.g. Soroti"
                        className="w-full px-3 py-2 bg-slate-900 border border-navy-600 rounded text-slate-300 focus:outline-none focus:border-teal-400"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between p-3 bg-teal-950/20 border border-teal-500/10 rounded-lg text-slate-300">
                      <div className="space-y-0.5">
                        <p className="font-bold text-teal-400">Automatic IP Assignment & DHCP Static Lease</p>
                        <p className="text-[11px] text-slate-400">The WIFI ZONE system automatically claims the next available IP address subnet block and generates a WireGuard tunnel profile for remote pairing.</p>
                      </div>
                      <div className="shrink-0 font-mono font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/20">
                        AUTO-DHCP
                      </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddApForm(false);
                          setNewApNotification(null);
                        }}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold rounded-lg transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-navy-800 font-bold rounded-lg transition"
                      >
                        Remotely Connect & Provision
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.sites.map((site) => (
                  <div key={site.id} className="bg-slate-950 rounded-xl border border-navy-700 p-4 shadow-md flex items-center justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">{site.name}</h3>
                        <span className={`h-2.5 w-2.5 rounded-full ${site.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                      </div>
                      <div className="flex flex-col gap-0.5 text-xs">
                        <p className="text-slate-400">Location: {site.location}</p>
                        {site.ipAddress && (
                          <p className="text-[10px] text-teal-400 font-mono">Static IP: <span className="font-bold text-slate-200">{site.ipAddress}</span></p>
                        )}
                      </div>
                      
                      {site.status === 'online' && (
                        <div className="flex gap-4 text-[10px] text-slate-500 font-mono pt-1">
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
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">WIFI ZONE Server Status</h3>
                
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
                      placeholder="WIFI_ZONE_Hotspot"
                      className="w-full px-3 py-2 bg-slate-900 border border-navy-600 rounded text-slate-300 focus:outline-none focus:border-teal-400 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Local DNS Name</label>
                    <input 
                      type="text" 
                      value={serverDnsName}
                      onChange={(e) => setServerDnsName(e.target.value)}
                      placeholder="tbs.connect"
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
# WIFI ZONE MIKROTIK HOTSPOT SETUP
# Target Router Site: ${state.sites.find(s => s.id === selectedSiteForScript)?.name || 'Bukedea Main Tower'}
# Location: ${state.sites.find(s => s.id === selectedSiteForScript)?.location || 'Bukedea'}
# Assigned Tunnel IP: ${state.sites.find(s => s.id === selectedSiteForScript)?.ipAddress || '10.150.12.1'}
# Generated: ${new Date().toLocaleDateString()}
# Compatibility: RouterOS v6.x / v7.x
# =========================================================

# 1. Create a Hotspot User Profile with speed limits
/ip hotspot user profile
add name="WIFI_ZONE_Standard" idle-timeout=none keepalive-timeout=2m shared-users=1

# 2. Add Hotspot Server Profile pointing to our captive portal
/ip hotspot profile
add name="${hotspotProfileName}_Profile" hotspot-address=${state.sites.find(s => s.id === selectedSiteForScript)?.ipAddress || '10.150.12.1'} dns-name="${serverDnsName}" \\
    login-by=http-chap,http-pap,cookie \\
    html-directory=flash/hotspot \\
    login-page-url="https://wifizone-captive.run.app"

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
add action=allow comment="Allow WIFI ZONE Domain" dst-host="*wifizone*"

# 5. Configure API Services for Remote Voucher Validation (RADIUS fallback)
/ip service
set api port=8728 disabled=no
set api-ssl port=8729 disabled=no certificate=none

/log info "WIFI ZONE WISP hotspot profile setup successfully applied!"`}
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
                      {state.logs
                        .filter(log => currentRole !== 'Agent' || log.actor.includes(activeAgent.name) || log.details.includes(activeAgent.id) || log.details.includes(activeAgent.name))
                        .map((log) => (
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

          {/* G. SPONSOR AD CAMPAIGNS TAB */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Sponsor Ad Management</h2>
                  <p className="text-xs text-slate-400">Deploy, pause, and analyze real-time click-through analytics for captive portal advertisements</p>
                </div>
                {(currentRole === 'Super Admin' || currentRole === 'Operator') && (
                  <button
                    onClick={() => {
                      setEditingAd(null);
                      setAdForm({
                        brand: '',
                        title: '',
                        description: '',
                        imageUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=80',
                        ctaText: 'Explore Offer',
                        tagline: '',
                        themeColor: 'from-blue-500 to-indigo-600',
                        active: true,
                        impressions: 0,
                        clicks: 0
                      });
                      setShowAdCreateModal(true);
                    }}
                    className="self-start sm:self-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-purple-500/10 border border-purple-500/30"
                  >
                    <Plus className="h-4 w-4" />
                    New Sponsor Campaign
                  </button>
                )}
              </div>

              {/* Analytics Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950/50 border border-navy-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Ad Impressions</p>
                    <p className="text-xl font-extrabold text-white font-mono">{adStats.totalImpressions.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-slate-950/50 border border-navy-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Click-Throughs</p>
                    <p className="text-xl font-extrabold text-teal-400 font-mono">{adStats.totalClicks.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20">
                    <Check className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-slate-950/50 border border-navy-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Click-Through Rate (CTR)</p>
                    <p className="text-xl font-extrabold text-purple-400 font-mono">{adStats.ctr}%</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-slate-950/50 border border-navy-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Campaigns</p>
                    <p className="text-xl font-extrabold text-white font-mono">{adStats.activeCount} / {(state.sponsorAds || []).length}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <Globe className="h-5 w-5 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Sponsor ad table/grid list */}
              <div className="bg-slate-950/40 border border-navy-800 rounded-2xl overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-950 text-slate-400 font-bold border-b border-navy-850">
                      <tr>
                        <th className="p-4">Sponsor Brand</th>
                        <th className="p-4">Campaign Banner & Offer Info</th>
                        <th className="p-4 text-center">Impressions</th>
                        <th className="p-4 text-center">Clicks</th>
                        <th className="p-4 text-center">CTR %</th>
                        <th className="p-4 text-center">Status</th>
                        {(currentRole === 'Super Admin' || currentRole === 'Operator') && (
                          <th className="p-4 text-right">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-900">
                      {((state.sponsorAds || []).length === 0) ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500">
                            No campaigns have been registered. Create a campaign to start serving sponsor ads.
                          </td>
                        </tr>
                      ) : (
                        (state.sponsorAds || []).map((ad) => {
                          const ctrPct = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : "0.0";
                          return (
                            <tr key={ad.id} className="hover:bg-slate-900/30 transition">
                              {/* Brand & Theme */}
                              <td className="p-4 whitespace-nowrap">
                                <div className="flex items-center gap-2.5">
                                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${ad.themeColor} flex items-center justify-center text-white font-black text-sm uppercase shadow-md shadow-black/20 shrink-0`}>
                                    {ad.brand.substring(0, 2)}
                                  </div>
                                  <div>
                                    <div className="font-bold text-white">{ad.brand}</div>
                                    <div className="text-[10px] text-slate-400">{ad.tagline || "Hotspot Sponsor"}</div>
                                  </div>
                                </div>
                              </td>

                              {/* Title, Banner preview, description */}
                              <td className="p-4 max-w-sm">
                                <div className="space-y-1.5">
                                  <div className="font-bold text-slate-200 line-clamp-1">{ad.title}</div>
                                  <div className="text-[11px] text-slate-400 line-clamp-2 leading-normal">{ad.description}</div>
                                  <div className="text-[10px] font-semibold text-teal-400 flex items-center gap-1">
                                    <span className="text-slate-500">CTA:</span> "{ad.ctaText}"
                                  </div>
                                </div>
                              </td>

                              {/* Impressions */}
                              <td className="p-4 text-center font-mono font-medium text-slate-300">
                                {ad.impressions.toLocaleString()}
                              </td>

                              {/* Clicks */}
                              <td className="p-4 text-center font-mono font-medium text-teal-400">
                                {ad.clicks.toLocaleString()}
                              </td>

                              {/* CTR % */}
                              <td className="p-4 text-center font-mono font-semibold text-purple-400">
                                {ctrPct}%
                              </td>

                              {/* Status Toggle */}
                              <td className="p-4 text-center whitespace-nowrap">
                                <button
                                  disabled={currentRole === 'Agent'}
                                  onClick={() => handleToggleAdActive(ad.id)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all tracking-wider ${
                                    ad.active 
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20" 
                                      : "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                                  }`}
                                >
                                  {ad.active ? "Active" : "Paused"}
                                </button>
                              </td>

                              {/* Actions */}
                              {(currentRole === 'Super Admin' || currentRole === 'Operator') && (
                                <td className="p-4 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => {
                                        setEditingAd(ad);
                                        setAdForm({ ...ad });
                                        setShowAdCreateModal(true);
                                      }}
                                      className="p-1.5 bg-slate-900 border border-navy-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 transition"
                                      title="Edit Campaign"
                                    >
                                      <Settings className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAd(ad.id)}
                                      className="p-1.5 bg-slate-900 border border-navy-700 rounded-lg text-rose-500 hover:bg-rose-950/30 hover:text-rose-400 hover:border-rose-900/50 transition"
                                      title="Delete Campaign"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </td>
                              )}
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

      {/* Agent Wallet Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-navy-800 border border-navy-600 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 relative">
            <button 
              onClick={() => {
                setShowWithdrawModal(false);
                setWithdrawError(null);
                setWithdrawSuccess(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 pb-2 border-b border-navy-700">
              <Download className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white font-display">Reseller Wallet Withdrawal</h3>
            </div>

            {withdrawSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Withdrawal Successful</h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                  {withdrawSuccess}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">Funds will be processed to your payout destination instantly.</p>
              </div>
            ) : (
              <form onSubmit={handleAgentWithdrawal} className="space-y-4 text-xs">
                {withdrawError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg flex items-start gap-2 text-rose-300">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="leading-normal">{withdrawError}</span>
                  </div>
                )}

                {/* Timing restriction block */}
                {!getWithdrawalTimeRemaining(activeAgent).canWithdraw && (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg flex items-start gap-2 text-amber-300">
                    <Calendar className="h-4 w-4 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <p className="font-bold">Once-a-Week Constraint Active</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                        You have already withdrawn this week. Next payout is locked for <strong>{getWithdrawalTimeRemaining(activeAgent).remainingText}</strong>.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-navy-800">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Wallet Balance:</span>
                    <span className="font-mono text-emerald-400 font-bold">{activeAgent.walletBalance.toLocaleString()} UGX</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Limit:</span>
                    <span className="text-slate-400">15K – 3M UGX</span>
                  </div>
                </div>

                {/* Channel select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payout Destination Channel</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { key: 'MTN', label: 'MTN MoMo', icon: Phone },
                      { key: 'Airtel', label: 'Airtel Money', icon: Phone },
                      { key: 'Bank', label: 'Bank Payout', icon: CreditCard }
                    ].map((chan) => {
                      const isSelected = withdrawChannel === chan.key;
                      const CIcon = chan.icon;
                      return (
                        <button
                          key={chan.key}
                          type="button"
                          onClick={() => setWithdrawChannel(chan.key as 'MTN' | 'Airtel' | 'Bank')}
                          className={`p-2 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition ${
                            isSelected
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                              : 'bg-slate-950/40 border-navy-800 text-slate-400 hover:border-navy-700'
                          }`}
                        >
                          <CIcon className="h-4 w-4" />
                          <span className="text-[9px]">{chan.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Amount input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount to Withdraw (UGX)</label>
                    <button
                      type="button"
                      onClick={() => {
                        const maxVal = Math.min(3000000, activeAgent.walletBalance);
                        setWithdrawAmount(maxVal.toString());
                      }}
                      className="text-[10px] text-emerald-400 hover:underline"
                    >
                      Use Max Limit
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type="number"
                      required
                      min={15000}
                      max={3000000}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="e.g. 50000"
                      className="w-full bg-slate-900 border border-navy-600 rounded px-3 py-2.5 text-white font-mono font-bold pl-12"
                    />
                    <div className="absolute left-3 top-2.5 text-slate-400 font-bold font-mono">UGX</div>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    {[15000, 50000, 100000, 500000, 1000000, 3000000].map((preset) => {
                      if (preset > activeAgent.walletBalance) return null;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setWithdrawAmount(preset.toString())}
                          className="px-2 py-1 bg-slate-950 border border-navy-800/80 rounded hover:border-navy-600 text-[10px] font-mono text-slate-300"
                        >
                          {preset >= 1000000 ? `${preset / 1000000}M` : `${preset / 1000}K`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional inputs */}
                {withdrawChannel === 'Bank' ? (
                  <div className="space-y-2 bg-slate-900/40 p-3 rounded-xl border border-navy-800">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Select Bank</label>
                        <select
                          value={withdrawBankName}
                          onChange={(e) => setWithdrawBankName(e.target.value)}
                          className="w-full bg-slate-950 border border-navy-750 rounded px-2 py-1.5 text-white"
                        >
                          <option value="Centenary Bank">Centenary Bank</option>
                          <option value="Stanbic Bank">Stanbic Bank</option>
                          <option value="Equity Bank">Equity Bank</option>
                          <option value="DFCU Bank">DFCU Bank</option>
                          <option value="Absa Bank">Absa Bank</option>
                          <option value="Standard Chartered">Std Chartered</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Account Number</label>
                        <input 
                          type="text"
                          required
                          value={withdrawBankAccount}
                          onChange={(e) => setWithdrawBankAccount(e.target.value)}
                          placeholder="e.g. 0134567890"
                          className="w-full bg-slate-950 border border-navy-750 rounded px-2 py-1.5 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Account Holder Name</label>
                      <input 
                        type="text"
                        required
                        value={withdrawAccountName}
                        onChange={(e) => setWithdrawAccountName(e.target.value)}
                        placeholder="e.g. Okello Moses"
                        className="w-full bg-slate-950 border border-navy-750 rounded px-2 py-1.5 text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 bg-slate-900/40 p-3 rounded-xl border border-navy-800">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Mobile Number</label>
                    <input 
                      type="tel"
                      required
                      value={withdrawPhone}
                      onChange={(e) => setWithdrawPhone(e.target.value)}
                      placeholder="e.g. 0772123456"
                      className="w-full bg-slate-900 border border-navy-700 rounded px-3 py-2 text-white font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Specify the destination Uganda phone line to receive the payout.</span>
                  </div>
                )}

                {/* Final controls */}
                <div className="flex justify-end gap-2 pt-2 border-t border-navy-700/60">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowWithdrawModal(false);
                      setWithdrawError(null);
                      setWithdrawSuccess(null);
                    }}
                    className="px-3 py-2 bg-slate-900 border border-navy-600 rounded-lg text-slate-400"
                  >
                    Close
                  </button>
                  <button 
                    type="submit"
                    disabled={!getWithdrawalTimeRemaining(activeAgent).canWithdraw || activeAgent.walletBalance < 15000}
                    className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-1.5 ${
                      !getWithdrawalTimeRemaining(activeAgent).canWithdraw || activeAgent.walletBalance < 15000
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-800'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-navy-900 shadow-md hover:shadow-emerald-500/10'
                    }`}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Request Payout
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Ad Campaign Modal */}
      {showAdCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-navy-800 border border-navy-600 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 relative">
            <button 
              onClick={() => {
                setShowAdCreateModal(false);
                setEditingAd(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 pb-2 border-b border-navy-700">
              <Megaphone className="h-5 w-5 text-purple-400" />
              <h3 className="text-base font-bold text-white font-display">
                {editingAd ? `Configure Ad: ${editingAd.brand}` : "Establish Sponsor Campaign"}
              </h3>
            </div>

            <form onSubmit={handleSaveAdCampaign} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Sponsor Brand *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. MTN Uganda"
                    value={adForm.brand || ''}
                    onChange={(e) => setAdForm({ ...adForm, brand: e.target.value })}
                    className="w-full bg-slate-900 border border-navy-600 rounded px-2.5 py-2 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Tagline</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Everywhere You Go"
                    value={adForm.tagline || ''}
                    onChange={(e) => setAdForm({ ...adForm, tagline: e.target.value })}
                    className="w-full bg-slate-900 border border-navy-600 rounded px-2.5 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Promo Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. MoMoPay - Fast, Secure, and Cashless Payments"
                  value={adForm.title || ''}
                  onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-navy-600 rounded px-2.5 py-2 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Description *</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Promotional copy watched by users."
                  value={adForm.description || ''}
                  onChange={(e) => setAdForm({ ...adForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-navy-600 rounded px-2.5 py-2 text-white font-mono leading-normal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Call To Action Text</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Explore MTN MoMo"
                    value={adForm.ctaText || ''}
                    onChange={(e) => setAdForm({ ...adForm, ctaText: e.target.value })}
                    className="w-full bg-slate-900 border border-navy-600 rounded px-2.5 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Gradient Accent</label>
                  <select 
                    value={adForm.themeColor || 'from-blue-500 to-indigo-600'}
                    onChange={(e) => setAdForm({ ...adForm, themeColor: e.target.value })}
                    className="w-full bg-slate-900 border border-navy-600 rounded px-2.5 py-2 text-white font-mono"
                  >
                    <option value="from-yellow-400 to-amber-500">MTN Gold (Yellow to Amber)</option>
                    <option value="from-red-500 to-rose-600">Airtel Ruby (Red to Rose)</option>
                    <option value="from-orange-500 to-amber-600">Orange Burst (Orange to Amber)</option>
                    <option value="from-purple-500 to-indigo-600">Royal Reseller (Purple to Indigo)</option>
                    <option value="from-emerald-500 to-teal-600">Pure Green (Emerald to Teal)</option>
                    <option value="from-slate-600 to-slate-800">Classic Charcoal (Slate to Dark)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Banner Image URL</label>
                <input 
                  type="text" 
                  placeholder="https://images.unsplash.com/photo-..."
                  value={adForm.imageUrl || ''}
                  onChange={(e) => setAdForm({ ...adForm, imageUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-navy-600 rounded px-2.5 py-2 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-navy-700">
                <button 
                  type="button"
                  onClick={() => {
                    setShowAdCreateModal(false);
                    setEditingAd(null);
                  }}
                  className="px-3 py-1.5 bg-slate-900 border border-navy-600 rounded-lg text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg transition"
                >
                  {editingAd ? "Apply Settings" : "Establish Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
