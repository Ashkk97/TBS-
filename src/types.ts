export interface Package {
  id: string;
  name: string;
  durationHours: number;
  priceUGX: number;
  devices: number;
  speed: string;
  notes: string;
}

export type VoucherStatus = 'unused' | 'active' | 'used' | 'expired';

export interface Voucher {
  code: string;
  packageId: string;
  status: VoucherStatus;
  activationTime: string | null;
  expiryTime: string | null;
  boundMACs: string[];
  phone: string | null;
  agentId: string | null;
  createdTime: string;
  commissionDeferred?: boolean;
}

export interface Customer {
  phone: string;
  name: string;
  registeredAt: string;
}

export interface Device {
  mac: string;
  browserFingerprint: string;
  lastActive: string;
  freeTrialClaimed: boolean;
}

export interface Transaction {
  id: string;
  phone: string;
  amountUGX: number;
  packageId: string;
  voucherCode: string;
  type: 'online' | 'agent';
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
  agentId: string | null;
  paymentMethod: 'MTN' | 'Airtel' | 'Pesapal' | 'Cash' | 'Wallet';
}

export interface Agent {
  id: string;
  name: string;
  location: string;
  walletBalance: number;
  commissionPercent: number;
  totalSalesUGX: number;
  totalCommissionUGX: number;
  lastWithdrawalTime?: string;
}

export interface ActiveSession {
  id: string;
  mac: string;
  voucherCode: string;
  speed: string;
  startedAt: string;
  durationMinutes: number;
  dataUsedMB: number;
  ipAddress: string;
  deviceModel?: string;
  status?: 'authorized' | 'pre-auth';
}

export interface RouterSite {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  cpuUsage: number;
  ramUsage: number;
  activeUsers: number;
  latencyMs: number;
  ipAddress?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: 'Super Admin' | 'Operator' | 'Agent' | 'System';
  action: string;
  details: string;
  ip: string;
}

export interface AdTrialClaim {
  id: string;
  mac: string;
  timestamp: string;
}

export interface SponsorAd {
  id: string;
  brand: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  tagline: string;
  themeColor: string;
  impressions: number;
  clicks: number;
  active: boolean;
}

export interface SmartPlan {
  key: string;
  label: string;
  desc: string;
  targetPkg: string;
}

