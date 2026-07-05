import { Package, RouterSite, Agent, Voucher, ActiveSession, Transaction, AuditLog, AdTrialClaim, SponsorAd, SmartPlan } from './types';

// Helper to generate a Uganda-styled phone number
export const samplePhones = ["0772123456", "0788987654", "0701555444", "0752111222"];

export const INITIAL_PACKAGES: Package[] = [
  {
    id: "pkg-quick",
    name: "Quick Connect",
    durationHours: 5,
    priceUGX: 500,
    devices: 1,
    speed: "3 Mbps",
    notes: "Entry level, perfect for quick checking"
  },
  {
    id: "pkg-daily",
    name: "Daily",
    durationHours: 24,
    priceUGX: 1000,
    devices: 1,
    speed: "5 Mbps",
    notes: "High volume entry, best value for a day"
  },
  {
    id: "pkg-3day",
    name: "3-Day",
    durationHours: 72,
    priceUGX: 2500,
    devices: 1,
    speed: "5 Mbps",
    notes: "Short term value for weekenders"
  },
  {
    id: "pkg-weekly",
    name: "Weekly",
    durationHours: 168,
    priceUGX: 6000,
    devices: 1,
    speed: "5 Mbps",
    notes: "Core offering for regular residents"
  },
  {
    id: "pkg-weeklyplus",
    name: "Weekly Plus",
    durationHours: 168,
    priceUGX: 10000,
    devices: 2,
    speed: "5 Mbps",
    notes: "Multi-device weekly, connect phone + laptop"
  },
  {
    id: "pkg-monthly",
    name: "Monthly",
    durationHours: 720,
    priceUGX: 20000,
    devices: 1,
    speed: "10 Mbps",
    notes: "Best long term value for power users"
  },
  {
    id: "pkg-family",
    name: "Family Monthly",
    durationHours: 720,
    priceUGX: 50000,
    devices: 4,
    speed: "10 Mbps",
    notes: "Households & small teams, multi-device"
  }
];

export const INITIAL_SITES: RouterSite[] = [
  { id: "site-bukedea", name: "Bukedea Main Tower", location: "Bukedea", status: "online", cpuUsage: 14, ramUsage: 45, activeUsers: 28, latencyMs: 12, ipAddress: "10.150.12.1" },
  { id: "site-kumi", name: "Kumi Market Hub", location: "Kumi", status: "online", cpuUsage: 8, ramUsage: 32, activeUsers: 14, latencyMs: 18, ipAddress: "10.150.13.1" },
  { id: "site-mbale", name: "Mbale Clock Tower", location: "Mbale", status: "online", cpuUsage: 42, ramUsage: 78, activeUsers: 112, latencyMs: 8, ipAddress: "10.150.14.1" },
  { id: "site-lira", name: "Lira Core Site", location: "Lira", status: "online", cpuUsage: 25, ramUsage: 56, activeUsers: 45, latencyMs: 24, ipAddress: "10.150.15.1" },
  { id: "site-gulu", name: "Gulu University Tower", location: "Gulu", status: "online", cpuUsage: 19, ramUsage: 41, activeUsers: 39, latencyMs: 21, ipAddress: "10.150.16.1" },
  { id: "site-arua", name: "Arua Hill Point", location: "Arua", status: "offline", cpuUsage: 0, ramUsage: 0, activeUsers: 0, latencyMs: 999, ipAddress: "10.150.17.1" }
];

export const INITIAL_AGENTS: Agent[] = [
  { id: "agent-1", name: "Moses Okello", location: "Bukedea Town (Main St)", walletBalance: 154500, commissionPercent: 10, totalSalesUGX: 680000, totalCommissionUGX: 68000 },
  { id: "agent-2", name: "Sarah Achen", location: "Kumi Central Market", walletBalance: 42000, commissionPercent: 10, totalSalesUGX: 340000, totalCommissionUGX: 34000 },
  { id: "agent-3", name: "John Masaba", location: "Mbale Town Hall Square", walletBalance: 285000, commissionPercent: 12, totalSalesUGX: 1450000, totalCommissionUGX: 174000 }
];

// Helper to generate a voucher code with 6 figures of randomly generated letters and numbers (e.g., A1B2C3)
export function generateVoucherCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid O, I, 0, 1 for legibility
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// Generate pre-populated vouchers
const now = new Date();
const formatOffsetDate = (hours: number) => {
  const d = new Date(now.getTime() + hours * 60 * 60 * 1000);
  return d.toISOString();
};

export const INITIAL_VOUCHERS: Voucher[] = [
  // Active/Connected Vouchers
  {
    code: "K3D8H9",
    packageId: "pkg-daily",
    status: "active",
    activationTime: formatOffsetDate(-3), // Activated 3 hours ago
    expiryTime: formatOffsetDate(21), // Expires in 21 hours
    boundMACs: ["00:1A:2B:3C:4D:5E"],
    phone: "0772123456",
    agentId: null,
    createdTime: formatOffsetDate(-5)
  },
  {
    code: "G8Y2X5",
    packageId: "pkg-weekly",
    status: "active",
    activationTime: formatOffsetDate(-48), // 2 days ago
    expiryTime: formatOffsetDate(120), // 5 days left
    boundMACs: ["54:E4:3A:90:BC:11"],
    phone: "0788987654",
    agentId: "agent-3",
    createdTime: formatOffsetDate(-50)
  },
  {
    code: "F4V7N1",
    packageId: "pkg-family",
    status: "active",
    activationTime: formatOffsetDate(-120), // 5 days ago
    expiryTime: formatOffsetDate(600), // 25 days left
    boundMACs: ["34:12:F1:C9:AA:00", "34:12:F1:C9:AA:01", "34:12:F1:C9:AA:02"],
    phone: "0701555444",
    agentId: "agent-1",
    createdTime: formatOffsetDate(-125)
  },
  // Unused Vouchers (Available for Agents or online sales)
  {
    code: "K9M3P7",
    packageId: "pkg-quick",
    status: "unused",
    activationTime: null,
    expiryTime: null,
    boundMACs: [],
    phone: null,
    agentId: "agent-2",
    createdTime: formatOffsetDate(-2)
  },
  {
    code: "B2A4W8",
    packageId: "pkg-3day",
    status: "unused",
    activationTime: null,
    expiryTime: null,
    boundMACs: [],
    phone: null,
    agentId: "agent-1",
    createdTime: formatOffsetDate(-1)
  },
  {
    code: "M6X9Z2",
    packageId: "pkg-weeklyplus",
    status: "unused",
    activationTime: null,
    expiryTime: null,
    boundMACs: [],
    phone: null,
    agentId: "agent-3",
    createdTime: formatOffsetDate(-12)
  },
  {
    code: "N1P7R4",
    packageId: "pkg-monthly",
    status: "unused",
    activationTime: null,
    expiryTime: null,
    boundMACs: [],
    phone: null,
    agentId: null,
    createdTime: formatOffsetDate(-1)
  },
  // Used & Expired Vouchers
  {
    code: "E5X8P2",
    packageId: "pkg-quick",
    status: "expired",
    activationTime: formatOffsetDate(-24),
    expiryTime: formatOffsetDate(-19),
    boundMACs: ["A4:5E:60:88:FF:1C"],
    phone: "0752111222",
    agentId: "agent-1",
    createdTime: formatOffsetDate(-26)
  },
  {
    code: "E9Y3K4",
    packageId: "pkg-daily",
    status: "expired",
    activationTime: formatOffsetDate(-30),
    expiryTime: formatOffsetDate(-6),
    boundMACs: ["BC:F2:AA:12:E3:44"],
    phone: "0772123456",
    agentId: null,
    createdTime: formatOffsetDate(-31)
  }
];

export const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: "sess-1",
    mac: "00:1A:2B:3C:4D:5E",
    voucherCode: "K3D8H9",
    speed: "5 Mbps",
    startedAt: formatOffsetDate(-3),
    durationMinutes: 180,
    dataUsedMB: 1240,
    ipAddress: "10.5.50.45"
  },
  {
    id: "sess-2",
    mac: "54:E4:3A:90:BC:11",
    voucherCode: "G8Y2X5",
    speed: "5 Mbps",
    startedAt: formatOffsetDate(-48),
    durationMinutes: 2880,
    dataUsedMB: 14500,
    ipAddress: "10.5.50.12"
  },
  {
    id: "sess-3",
    mac: "34:12:F1:C9:AA:00",
    voucherCode: "F4V7N1",
    speed: "10 Mbps",
    startedAt: formatOffsetDate(-20),
    durationMinutes: 1200,
    dataUsedMB: 8400,
    ipAddress: "10.5.60.101"
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "txn-1001",
    phone: "0772123456",
    amountUGX: 1000,
    packageId: "pkg-daily",
    voucherCode: "K3D8H9",
    type: "online",
    status: "success",
    timestamp: formatOffsetDate(-5),
    agentId: null,
    paymentMethod: "MTN"
  },
  {
    id: "txn-1002",
    phone: "0788987654",
    amountUGX: 6000,
    packageId: "pkg-weekly",
    voucherCode: "G8Y2X5",
    type: "agent",
    status: "success",
    timestamp: formatOffsetDate(-50),
    agentId: "agent-3",
    paymentMethod: "Cash"
  },
  {
    id: "txn-1003",
    phone: "0701555444",
    amountUGX: 50000,
    packageId: "pkg-family",
    voucherCode: "F4V7N1",
    type: "agent",
    status: "success",
    timestamp: formatOffsetDate(-125),
    agentId: "agent-1",
    paymentMethod: "Cash"
  },
  {
    id: "txn-1004",
    phone: "0771239845",
    amountUGX: 20000,
    packageId: "pkg-monthly",
    voucherCode: "N1P7R4",
    type: "online",
    status: "success",
    timestamp: formatOffsetDate(-1),
    agentId: null,
    paymentMethod: "Airtel"
  },
  {
    id: "txn-1005",
    phone: "0752111222",
    amountUGX: 500,
    packageId: "pkg-quick",
    voucherCode: "E5X8P2",
    type: "agent",
    status: "success",
    timestamp: formatOffsetDate(-26),
    agentId: "agent-1",
    paymentMethod: "Cash"
  },
  // June 2026 - Sarah Achen won this month
  {
    id: "txn-june-1",
    phone: "0770111222",
    amountUGX: 250000,
    packageId: "pkg-family",
    voucherCode: "JN6FMA",
    type: "agent",
    status: "success",
    timestamp: "2026-06-12T14:20:00.000Z",
    agentId: "agent-2",
    paymentMethod: "Cash"
  },
  {
    id: "txn-june-2",
    phone: "0770111223",
    amountUGX: 150000,
    packageId: "pkg-monthly",
    voucherCode: "JN6MNB",
    type: "agent",
    status: "success",
    timestamp: "2026-06-18T09:15:00.000Z",
    agentId: "agent-2",
    paymentMethod: "Cash"
  },
  {
    id: "txn-june-3",
    phone: "0770111224",
    amountUGX: 200000,
    packageId: "pkg-monthly",
    voucherCode: "JN6MNC",
    type: "agent",
    status: "success",
    timestamp: "2026-06-22T11:45:00.000Z",
    agentId: "agent-1",
    paymentMethod: "Cash"
  },
  {
    id: "txn-june-4",
    phone: "0770111225",
    amountUGX: 150000,
    packageId: "pkg-monthly",
    voucherCode: "JUNE-MONT-DDDD",
    type: "agent",
    status: "success",
    timestamp: "2026-06-25T16:10:00.000Z",
    agentId: "agent-3",
    paymentMethod: "Cash"
  },
  // May 2026 - John Masaba won this month
  {
    id: "txn-may-1",
    phone: "0770222333",
    amountUGX: 500000,
    packageId: "pkg-family",
    voucherCode: "MAY-FAML-AAAA",
    type: "agent",
    status: "success",
    timestamp: "2026-05-10T10:05:00.000Z",
    agentId: "agent-3",
    paymentMethod: "Cash"
  },
  {
    id: "txn-may-2",
    phone: "0770222334",
    amountUGX: 300000,
    packageId: "pkg-monthly",
    voucherCode: "MAY-MONT-BBBB",
    type: "agent",
    status: "success",
    timestamp: "2026-05-15T15:30:00.000Z",
    agentId: "agent-3",
    paymentMethod: "Cash"
  },
  {
    id: "txn-may-3",
    phone: "0770222335",
    amountUGX: 300000,
    packageId: "pkg-monthly",
    voucherCode: "MAY-MONT-CCCC",
    type: "agent",
    status: "success",
    timestamp: "2026-05-20T12:00:00.000Z",
    agentId: "agent-2",
    paymentMethod: "Cash"
  },
  {
    id: "txn-may-4",
    phone: "0770222336",
    amountUGX: 100000,
    packageId: "pkg-weekly",
    voucherCode: "MAY-WEEK-DDDD",
    type: "agent",
    status: "success",
    timestamp: "2026-05-24T18:50:00.000Z",
    agentId: "agent-1",
    paymentMethod: "Cash"
  }
];

export const INITIAL_LOGS: AuditLog[] = [
  {
    id: "log-1",
    timestamp: formatOffsetDate(-2),
    actor: "Moses Okello (agent-1)",
    role: "Agent",
    action: "Voucher Created",
    details: "Generated physical voucher B2A4W8 (3-Day plan) via agent dashboard.",
    ip: "10.150.12.3"
  },
  {
    id: "log-2",
    timestamp: formatOffsetDate(-5),
    actor: "System API Gateway",
    role: "System",
    action: "Online Payment Webhook",
    details: "MTN Mobile Money webhook received for txn-1001. Generated voucher K3D8H9.",
    ip: "196.201.200.42"
  },
  {
    id: "log-3",
    timestamp: formatOffsetDate(-6),
    actor: "Super Admin",
    role: "Super Admin",
    action: "System Settings Change",
    details: "Updated Free Trial duration default setting to 20 minutes.",
    ip: "102.140.220.10"
  },
  {
    id: "log-4",
    timestamp: formatOffsetDate(-12),
    actor: "Sarah Achen (agent-2)",
    role: "Agent",
    action: "Wallet Top-up",
    details: "Agent wallet topped up by 50,000 UGX via admin approval.",
    ip: "10.150.14.9"
  }
];

export const INITIAL_AD_TRIAL_CLAIMS: AdTrialClaim[] = [
  {
    id: "claim-1",
    mac: "00:1A:2B:3C:4D:5E",
    timestamp: formatOffsetDate(-10) // 10 days ago (within 15 days window)
  },
  {
    id: "claim-2",
    mac: "00:1A:2B:3C:4D:5E",
    timestamp: formatOffsetDate(-4) // 4 days ago (within 15 days window)
  },
  {
    id: "claim-3",
    mac: "54:E4:3A:90:BC:11",
    timestamp: formatOffsetDate(-20) // 20 days ago (outside 15 days)
  }
];

export const INITIAL_SPONSOR_ADS: SponsorAd[] = [
  {
    id: "ad-mtn",
    brand: "MTN Uganda",
    title: "MoMoPay - Fast, Secure, and Cashless Payments",
    description: "Pay for your TBS Connect internet packages, groceries, and bills with MTN MoMoPay. Just dial *165*3# or use the MyMTN app to enjoy zero transaction charges!",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    ctaText: "Explore MTN MoMo",
    tagline: "Everywhere You Go",
    themeColor: "from-yellow-400 to-amber-500",
    impressions: 485,
    clicks: 124,
    active: true
  },
  {
    id: "ad-airtel",
    brand: "Airtel Uganda",
    title: "Airtel Money - Secure Smart Cash Transfers",
    description: "Send money across Uganda and East Africa with ease. Pay your bills, utilities, and buy TBS Connect internet packages instantly using Airtel Money. Zero fees on top-up transfers!",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=800&q=80",
    ctaText: "Explore Airtel Money",
    tagline: "The Smartphone Network",
    themeColor: "from-red-500 to-rose-600",
    impressions: 398,
    clicks: 86,
    active: true
  },
  {
    id: "ad-tbs",
    brand: "TBS Fiber",
    title: "TBS Fiber Pro - Superfast Home & Office Internet",
    description: "Are you tired of data bundles? Upgrade to a dedicated TBS Fiber line for your residence or business starting at just 150,000 UGX/month. Unlimited downloads, 99.9% uptime!",
    imageUrl: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80",
    ctaText: "Order Home Fiber",
    tagline: "Unleash Gigaspeed Broadband",
    themeColor: "from-teal-500 to-cyan-600",
    impressions: 290,
    clicks: 102,
    active: true
  },
  {
    id: "ad-coop",
    brand: "TBS Reseller",
    title: "Earn Extra Cash - Become a Hotspot Reseller Agent!",
    description: "Do you run a shop, salon, or retail stand near our hotspot zones? Apply to become a Reseller Agent, purchase wallet credit, sell high-speed vouchers, and earn up to 15% instant commission!",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80",
    ctaText: "Apply as Reseller",
    tagline: "Grow Your Retail Business",
    themeColor: "from-purple-500 to-indigo-600",
    impressions: 184,
    clicks: 45,
    active: true
  }
];

export const INITIAL_SMART_PLANS: SmartPlan[] = [
  { key: 'browse', label: 'Social & Chatting', desc: 'Casual social media', targetPkg: 'pkg-daily' },
  { key: 'study', label: 'Study & Work', desc: 'Symmetric Zoom & Docs', targetPkg: 'pkg-weekly' },
  { key: 'video', label: 'HD Video Streaming', desc: 'Netflix & YouTube', targetPkg: 'pkg-monthly' },
  { key: 'household', label: 'Entire Family', desc: 'Multiple concurrent devices', targetPkg: 'pkg-family' }
];



// Local Storage Sync Engine
export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const item = localStorage.getItem(`tbs_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    }
  } catch (e) {
    console.error("Local storage read error for key: ", key, e);
  }
  return defaultValue;
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`tbs_${key}`, JSON.stringify(value));
    }
  } catch (e) {
    console.error("Local storage write error for key: ", key, e);
  }
}

// Global state controller
export class AppState {
  packages: Package[];
  sites: RouterSite[];
  agents: Agent[];
  vouchers: Voucher[];
  sessions: ActiveSession[];
  transactions: Transaction[];
  logs: AuditLog[];
  adTrialClaims: AdTrialClaim[];
  sponsorAds: SponsorAd[];
  smartPlans: SmartPlan[];
  
  // Current client device info
  clientMAC: string;
  clientFingerprint: string;
  clientFreeTrialClaimed: boolean;

  constructor() {
    this.packages = getStoredData('packages', INITIAL_PACKAGES);
    this.sites = getStoredData('sites', INITIAL_SITES);
    this.agents = getStoredData('agents', INITIAL_AGENTS);
    this.vouchers = getStoredData('vouchers', INITIAL_VOUCHERS);
    this.sessions = getStoredData('sessions', INITIAL_SESSIONS);
    this.transactions = getStoredData('transactions', INITIAL_TRANSACTIONS);
    this.logs = getStoredData('logs', INITIAL_LOGS);
    this.adTrialClaims = getStoredData('ad_trial_claims', INITIAL_AD_TRIAL_CLAIMS);
    this.sponsorAds = getStoredData('sponsor_ads', INITIAL_SPONSOR_ADS);
    this.smartPlans = getStoredData('smart_plans', INITIAL_SMART_PLANS);

    // Get or initialize device-specific simulation
    this.clientMAC = getStoredData('client_mac', this.randomMAC());
    this.clientFingerprint = getStoredData('client_fingerprint', "fp_" + Math.random().toString(36).substring(2, 10));
    this.clientFreeTrialClaimed = getStoredData('client_free_trial_claimed', false);

    // Run monthly commission automation
    this.recalculateMonthlyCommissions();
  }

  recalculateMonthlyCommissions() {
    const currentMonthStr = new Date().toISOString().substring(0, 7); // e.g., "2026-07"
    
    // Calculate sales for each agent in the current month
    const salesMap: Record<string, number> = {};
    this.agents.forEach(a => {
      salesMap[a.id] = 0;
    });
    
    this.transactions.forEach(txn => {
      if (txn.agentId && txn.status === 'success' && txn.timestamp.startsWith(currentMonthStr)) {
        salesMap[txn.agentId] = (salesMap[txn.agentId] || 0) + txn.amountUGX;
      }
    });

    // Find the top seller with non-zero sales
    let topAgentId: string | null = null;
    let maxSales = 0;
    
    Object.entries(salesMap).forEach(([id, sales]) => {
      if (sales > maxSales) {
        maxSales = sales;
        topAgentId = id;
      }
    });

    // Check if top agent meets the compulsory threshold of 250,000 UGX
    const meetsThreshold = maxSales >= 250000;
    const winningAgentId = meetsThreshold ? topAgentId : null;

    // Apply commissions: Top agent gets 25% (if threshold met), others get their base.
    this.agents.forEach(agent => {
      let basePercent = 10;
      if (agent.id === 'agent-1') basePercent = 10;
      if (agent.id === 'agent-2') basePercent = 10;
      if (agent.id === 'agent-3') basePercent = 12; // John Masaba base
      
      const newCommission = (winningAgentId && agent.id === winningAgentId) ? 25 : basePercent;
      
      if (agent.commissionPercent !== newCommission) {
        agent.commissionPercent = newCommission;
        
        // Push a log dynamically to audit
        const newLog: AuditLog = {
          id: "log-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
          timestamp: new Date().toISOString(),
          actor: "System Scheduler",
          role: "System",
          action: "Monthly Commission Adjusted",
          details: meetsThreshold
            ? `Automated Commission Boost: ${agent.name} is now at ${newCommission}% commission based on top monthly sales volume (${salesMap[agent.id]?.toLocaleString() || 0} UGX, meeting the 250,000 UGX threshold).`
            : `Automated Commission Reset: ${agent.name} reset to base commission ${newCommission}% as monthly sales do not meet the 250,000 UGX threshold.`,
          ip: "127.0.0.1"
        };
        this.logs = [newLog, ...this.logs].slice(0, 200);
      }
    });
  }

  // Load latest state from server backend
  async init(onLoaded?: () => void) {
    try {
      const response = await fetch('/api/state');
      if (response.ok) {
        const data = await response.json();
        if (data.packages) this.packages = data.packages;
        if (data.sites) this.sites = data.sites;
        if (data.agents) this.agents = data.agents;
        if (data.vouchers) this.vouchers = data.vouchers;
        if (data.sessions) this.sessions = data.sessions;
        if (data.transactions) this.transactions = data.transactions;
        if (data.logs) this.logs = data.logs;
        if (data.adTrialClaims) this.adTrialClaims = data.adTrialClaims;
        if (data.sponsorAds) this.sponsorAds = data.sponsorAds;
        if (data.smartPlans) this.smartPlans = data.smartPlans;
        
        // Save to local storage cache
        setStoredData('packages', this.packages);
        setStoredData('sites', this.sites);
        setStoredData('agents', this.agents);
        setStoredData('vouchers', this.vouchers);
        setStoredData('sessions', this.sessions);
        setStoredData('transactions', this.transactions);
        setStoredData('logs', this.logs);
        setStoredData('ad_trial_claims', this.adTrialClaims);
        setStoredData('sponsor_ads', this.sponsorAds);
        setStoredData('smart_plans', this.smartPlans);
      }
    } catch (e) {
      console.warn("Failed to load state from server backend, using local storage fallback:", e);
    } finally {
      if (onLoaded) onLoaded();
    }
  }

  private randomMAC(): string {
    const hexDigits = "0123456789ABCDEF";
    let mac = "";
    for (let i = 0; i < 6; i++) {
      mac += hexDigits[Math.floor(Math.random() * 16)];
      mac += hexDigits[Math.floor(Math.random() * 16)];
      if (i < 5) mac += ":";
    }
    return mac;
  }

  save() {
    // Automatically recalculate monthly commission increases silently before saving
    this.recalculateMonthlyCommissions();

    // 1. Save to local storage as fallback
    setStoredData('packages', this.packages);
    setStoredData('sites', this.sites);
    setStoredData('agents', this.agents);
    setStoredData('vouchers', this.vouchers);
    setStoredData('sessions', this.sessions);
    setStoredData('transactions', this.transactions);
    setStoredData('logs', this.logs);
    setStoredData('ad_trial_claims', this.adTrialClaims);
    setStoredData('sponsor_ads', this.sponsorAds);
    setStoredData('smart_plans', this.smartPlans);
    setStoredData('client_mac', this.clientMAC);
    setStoredData('client_fingerprint', this.clientFingerprint);
    setStoredData('client_free_trial_claimed', this.clientFreeTrialClaimed);

    // 2. Sync asynchronously to the server backend
    fetch('/api/state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        packages: this.packages,
        sites: this.sites,
        agents: this.agents,
        vouchers: this.vouchers,
        sessions: this.sessions,
        transactions: this.transactions,
        logs: this.logs,
        adTrialClaims: this.adTrialClaims,
        sponsorAds: this.sponsorAds
      })
    }).catch(e => console.error("Failed to sync state to server backend:", e));
  }

  async reset() {
    localStorage.removeItem('tbs_packages');
    localStorage.removeItem('tbs_sites');
    localStorage.removeItem('tbs_agents');
    localStorage.removeItem('tbs_vouchers');
    localStorage.removeItem('tbs_sessions');
    localStorage.removeItem('tbs_transactions');
    localStorage.removeItem('tbs_logs');
    localStorage.removeItem('tbs_ad_trial_claims');
    localStorage.removeItem('tbs_sponsor_ads');
    localStorage.removeItem('tbs_client_mac');
    localStorage.removeItem('tbs_client_fingerprint');
    localStorage.removeItem('tbs_client_free_trial_claimed');
    
    try {
      const response = await fetch('/api/state/reset', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        this.packages = data.packages;
        this.sites = data.sites;
        this.agents = data.agents;
        this.vouchers = data.vouchers;
        this.sessions = data.sessions;
        this.transactions = data.transactions;
        this.logs = data.logs;
        this.adTrialClaims = data.adTrialClaims || [];
        this.sponsorAds = data.sponsorAds || [];
      } else {
        throw new Error("Reset response not OK");
      }
    } catch (e) {
      console.warn("Server reset failed, falling back to local reset:", e);
      this.packages = INITIAL_PACKAGES;
      this.sites = INITIAL_SITES;
      this.agents = INITIAL_AGENTS;
      this.vouchers = INITIAL_VOUCHERS;
      this.sessions = INITIAL_SESSIONS;
      this.transactions = INITIAL_TRANSACTIONS;
      this.logs = INITIAL_LOGS;
      this.adTrialClaims = INITIAL_AD_TRIAL_CLAIMS;
      this.sponsorAds = INITIAL_SPONSOR_ADS;
    }
    
    this.clientMAC = this.randomMAC();
    this.clientFingerprint = "fp_" + Math.random().toString(36).substring(2, 10);
    this.clientFreeTrialClaimed = false;
    this.save();
  }

  addLog(role: 'Super Admin' | 'Operator' | 'Agent' | 'System', actor: string, action: string, details: string) {
    const newLog: AuditLog = {
      id: "log-" + Date.now(),
      timestamp: new Date().toISOString(),
      actor,
      role,
      action,
      details,
      ip: role === 'Agent' ? "10.150.12." + Math.floor(Math.random() * 254 + 1) : "102.140.220." + Math.floor(Math.random() * 254 + 1)
    };
    this.logs = [newLog, ...this.logs].slice(0, 200); // Limit logs count
    this.save();
  }
}
