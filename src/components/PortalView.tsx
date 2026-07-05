import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  Copy, 
  Check, 
  Smartphone, 
  Tv, 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Clock, 
  Zap, 
  Info, 
  X, 
  ArrowRight,
  User,
  Activity,
  AlertTriangle,
  Lock,
  RotateCcw,
  Download,
  Sparkles,
  TrendingUp,
  GraduationCap,
  Play,
  SkipForward,
  Sliders,
  Loader
} from 'lucide-react';
import { AppState, generateVoucherCode } from '../data';
import { Package, Voucher, AdTrialClaim, SponsorAd } from '../types';
import { TBSLogo } from './TBSLogo';

// Individual theme styling mapping for each package
export const getPackageStyle = (pkgId: string) => {
  switch (pkgId) {
    case 'pkg-quick':
      return {
        bg: 'from-blue-600/10 to-indigo-600/5 hover:from-blue-600/15 hover:to-indigo-600/10 border-blue-500/20 hover:border-blue-400',
        badge: 'text-blue-300 bg-blue-950/50 border-blue-800/40',
        button: 'bg-blue-500/10 hover:bg-blue-500 text-blue-300 hover:text-slate-955 border-blue-500/30 hover:border-blue-400',
        accentText: 'text-blue-400',
        glowingGlow: 'bg-blue-500/10',
        tag: 'Quick Surf',
        tagBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        icon: Clock,
        benefit: 'Best for checking email & quick social updates'
      };
    case 'pkg-daily':
      return {
        bg: 'from-emerald-600/10 to-teal-600/5 hover:from-emerald-600/15 hover:to-teal-600/10 border-emerald-500/20 hover:border-emerald-400',
        badge: 'text-emerald-300 bg-emerald-950/50 border-emerald-800/40',
        button: 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-slate-955 border-emerald-500/30 hover:border-emerald-400',
        accentText: 'text-emerald-400',
        glowingGlow: 'bg-emerald-500/10',
        tag: 'Budget 24H',
        tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        icon: Zap,
        benefit: 'Unlimited 24-Hour continuous browsing'
      };
    case 'pkg-3day':
      return {
        bg: 'from-violet-600/10 to-purple-600/5 hover:from-violet-600/15 hover:to-purple-600/10 border-violet-500/20 hover:border-violet-400',
        badge: 'text-violet-300 bg-violet-950/50 border-violet-800/40',
        button: 'bg-violet-500/10 hover:bg-violet-500 text-violet-300 hover:text-slate-955 border-violet-500/30 hover:border-violet-400',
        accentText: 'text-violet-400',
        glowingGlow: 'bg-violet-500/10',
        tag: 'Weekend Special',
        tagBg: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        icon: Wifi,
        benefit: 'Great for weekend project getaways & studies'
      };
    case 'pkg-weekly':
      return {
        bg: 'from-amber-600/10 to-orange-600/5 hover:from-amber-600/15 hover:to-orange-600/10 border-amber-500/30 hover:border-amber-400',
        badge: 'text-amber-300 bg-amber-950/50 border-amber-800/40',
        button: 'bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-955 border-amber-500/30 hover:border-amber-400',
        accentText: 'text-amber-400',
        glowingGlow: 'bg-amber-500/10',
        tag: 'Best Seller 🔥',
        tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        icon: Zap,
        benefit: 'Excellent daily study/work balance plan'
      };
    case 'pkg-weeklyplus':
      return {
        bg: 'from-rose-600/10 to-pink-600/5 hover:from-rose-600/15 hover:to-pink-600/10 border-rose-500/20 hover:border-rose-400',
        badge: 'text-rose-300 bg-rose-950/50 border-rose-800/40',
        button: 'bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-slate-955 border-rose-500/30 hover:border-rose-400',
        accentText: 'text-rose-400',
        glowingGlow: 'bg-rose-500/10',
        tag: 'Double Device',
        tagBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        icon: Smartphone,
        benefit: 'Perfect for connecting Phone & Laptop concurrently'
      };
    case 'pkg-monthly':
      return {
        bg: 'from-indigo-600/10 to-cyan-600/5 hover:from-indigo-600/15 hover:to-cyan-600/10 border-indigo-500/20 hover:border-indigo-400',
        badge: 'text-indigo-300 bg-indigo-950/50 border-indigo-800/40',
        button: 'bg-indigo-500/10 hover:bg-indigo-500 text-indigo-300 hover:text-slate-955 border-indigo-500/30 hover:border-indigo-400',
        accentText: 'text-indigo-400',
        glowingGlow: 'bg-indigo-500/10',
        tag: 'Symmetric Power',
        tagBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        icon: Zap,
        benefit: 'Unlimited 10Mbps heavy downloading & streaming'
      };
    case 'pkg-family':
      return {
        bg: 'from-yellow-600/15 to-amber-600/10 hover:from-yellow-600/20 hover:to-amber-600/15 border-yellow-500/30 hover:border-yellow-400 shadow-md shadow-yellow-500/5',
        badge: 'text-yellow-300 bg-yellow-950/50 border-yellow-800/40',
        button: 'bg-yellow-500/10 hover:bg-yellow-500 text-yellow-300 hover:text-slate-955 border-yellow-500/30 hover:border-yellow-400',
        accentText: 'text-yellow-400',
        glowingGlow: 'bg-yellow-500/20',
        tag: 'Elite Shared Deal 👑',
        tagBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        icon: Tv,
        benefit: 'Connect up to 4 devices (TV, laptops, smartphones)'
      };
    default:
      return {
        bg: 'from-slate-600/10 to-slate-600/5 hover:from-slate-600/15 hover:to-slate-600/10 border-slate-500/20 hover:border-slate-400',
        badge: 'text-slate-300 bg-slate-950/50 border-slate-800/40',
        button: 'bg-slate-500/10 hover:bg-slate-500 text-slate-300 hover:text-slate-955 border-slate-500/30 hover:border-slate-400',
        accentText: 'text-slate-400',
        glowingGlow: 'bg-slate-500/10',
        tag: 'Hotspot Pack',
        tagBg: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
        icon: Wifi,
        benefit: 'High-speed symmetric uncapped hotspot connectivity'
      };
  }
};

interface PortalViewProps {
  state: AppState;
  onStateUpdate: () => void;
  onGoToAdmin: () => void;
}

export function detectDeviceModel(): string {
  if (typeof window === 'undefined' || !window.navigator || !window.navigator.userAgent) {
    return "Unknown Phone/Device";
  }
  const ua = window.navigator.userAgent;
  
  if (/iphone/i.test(ua)) return "Apple iPhone";
  if (/ipad/i.test(ua)) return "Apple iPad";
  if (/macintosh|mac os x/i.test(ua)) return "Apple MacBook";
  if (/samsung/i.test(ua)) return "Samsung Galaxy Phone";
  if (/tecno/i.test(ua)) return "Tecno Spark/Camon";
  if (/infinix/i.test(ua)) return "Infinix Hot/Note";
  if (/itel/i.test(ua)) return "itel Mobile Phone";
  if (/xiaomi|redmi|miui/i.test(ua)) return "Xiaomi Redmi Phone";
  if (/oppo/i.test(ua)) return "Oppo Phone";
  if (/vivo/i.test(ua)) return "Vivo Phone";
  if (/huawei|honor/i.test(ua)) return "Huawei Phone";
  if (/pixel/i.test(ua)) return "Google Pixel";
  if (/android/i.test(ua)) return "Android Smartphone";
  if (/windows/i.test(ua)) return "Windows Laptop/PC";
  if (/linux/i.test(ua)) return "Linux Workstation";
  return "Smartphone/Device";
}

export default function PortalView({ state, onStateUpdate, onGoToAdmin }: PortalViewProps) {
  // Client connection states
  const [activeSession, setActiveSession] = useState<any>(null);
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [copiedMac, setCopiedMac] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Customer History & Eligibility for Simultaneous Ads
  const customerSinceDateStr = state.getCustomerSince(state.clientMAC);
  const customerSinceDate = new Date(customerSinceDateStr);
  const daysCustomer = Math.max(0, Math.floor((Date.now() - customerSinceDate.getTime()) / (1000 * 60 * 60 * 24)));
  const isEligibleForSimultaneous = daysCustomer >= 90;

  const handleToggleCustomerSince = () => {
    if (isEligibleForSimultaneous) {
      // Toggle to 1 day ago (new customer)
      const d = new Date();
      d.setDate(d.getDate() - 1);
      state.setCustomerSince(state.clientMAC, d.toISOString());
    } else {
      // Toggle to 95 days ago (loyal customer of ~3 months)
      const d = new Date();
      d.setDate(d.getDate() - 95);
      state.setCustomerSince(state.clientMAC, d.toISOString());
    }
    onStateUpdate();
  };

  // Automatic device recognition on connect (even without a coupon!)
  const [detectedModel, setDetectedModel] = useState("Detecting...");
  
  useEffect(() => {
    const model = detectDeviceModel();
    setDetectedModel(model);

    // Register pre-auth session immediately so Admin dashboard sees it
    const existingSession = state.sessions.find(s => s.mac === state.clientMAC);
    if (!existingSession) {
      const preAuthSession = {
        id: "sess-" + Date.now(),
        mac: state.clientMAC,
        voucherCode: "Pre-Auth (None)",
        speed: "Blocked (Pre-Auth)",
        startedAt: new Date().toISOString(),
        durationMinutes: 0,
        dataUsedMB: 0,
        ipAddress: "10.5.50." + Math.floor(Math.random() * 200 + 50),
        deviceModel: model,
        status: "pre-auth" as const
      };
      state.sessions.push(preAuthSession);
      state.save();
      onStateUpdate();
    } else {
      let changed = false;
      if (!existingSession.deviceModel) {
        existingSession.deviceModel = model;
        changed = true;
      }
      if (!existingSession.status) {
        existingSession.status = existingSession.voucherCode && existingSession.voucherCode !== "Pre-Auth (None)" ? "authorized" : "pre-auth";
        changed = true;
      }
      if (changed) {
        state.save();
        onStateUpdate();
      }
    }
  }, [state.clientMAC]);
  
  // Modals / Sections
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentCarrier, setPaymentCarrier] = useState<'MTN' | 'Airtel' | 'Pesapal'>('MTN');
  const [paymentStep, setPaymentStep] = useState<'details' | 'ussd' | 'processing' | 'success'>('details');
  const [ussdPin, setUssdPin] = useState('');
  const [generatedVoucher, setGeneratedVoucher] = useState<string | null>(null);
  const [pesapalSubMethod, setPesapalSubMethod] = useState<'card' | 'wallet'>('card');
  const [cardNum, setCardNum] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Find My Voucher
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupResults, setLookupResults] = useState<Voucher[]>([]);
  const [hasSearchedVouchers, setHasSearchedVouchers] = useState(false);

  // Smart TV Registration
  const [tvVoucher, setTvVoucher] = useState('');
  const [tvMac, setTvMac] = useState('');
  const [tvSuccess, setTvSuccess] = useState(false);

  // FAQ collapsible state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Free Trial Timer Simulation
  const [trialTimeRemaining, setTrialTimeRemaining] = useState<number | null>(null);
  const [trialEndedAlert, setTrialEndedAlert] = useState(false);

  // Advertising Portal Simulation
  const [showAdModal, setShowAdModal] = useState(false);
  const [activeAd, setActiveAd] = useState<SponsorAd | null>(null);
  const [adCountdown, setAdCountdown] = useState(15);
  const [adFinished, setAdFinished] = useState(false);
  const [completedAdsCount, setCompletedAdsCount] = useState(0);

  // New Simultaneous & Auto-Play / Transition states
  const [adPlayMode, setAdPlayMode] = useState<'simultaneous' | 'sequential'>('simultaneous');
  const [activeAdsSimultaneous, setActiveAdsSimultaneous] = useState<SponsorAd[]>([]);
  const [simultaneousCountdown, setSimultaneousCountdown] = useState(15);
  const [simultaneousFinished, setSimultaneousFinished] = useState(false);
  const [autoPlayLoadingSeconds, setAutoPlayLoadingSeconds] = useState<number | null>(null);

  // Package display filter: 'all' | 'budget' | 'weekly-monthly' | 'multidevice'
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'budget' | 'weekly-monthly' | 'multidevice'>('all');
  
  // Dynamic Package Need advisor state
  const [selectedAdvisorNeed, setSelectedAdvisorNeed] = useState<string | null>(null);

  // Ad modal countdown effect (Sequential and Simultaneous)
  useEffect(() => {
    if (!showAdModal) return;

    if (adPlayMode === 'simultaneous') {
      if (simultaneousCountdown <= 0) {
        setSimultaneousFinished(true);
        return;
      }
      const timer = setTimeout(() => {
        setSimultaneousCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Sequential Mode
      if (adCountdown > 0) {
        const timer = setTimeout(() => {
          setAdCountdown(prev => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setAdFinished(true);
      }
    }
  }, [showAdModal, adPlayMode, adCountdown, simultaneousCountdown]);

  // Sequential Auto-Play Transition Effect (3 seconds loading time)
  useEffect(() => {
    if (!showAdModal || adPlayMode !== 'sequential') {
      setAutoPlayLoadingSeconds(null);
      return;
    }

    // Only run if the current ad is finished (adCountdown === 0)
    if (adCountdown === 0) {
      if (autoPlayLoadingSeconds === null) {
        setAutoPlayLoadingSeconds(3);
        return;
      }

      if (autoPlayLoadingSeconds > 0) {
        const timer = setTimeout(() => {
          setAutoPlayLoadingSeconds(prev => (prev !== null ? prev - 1 : null));
        }, 1000);
        return () => clearTimeout(timer);
      } else if (autoPlayLoadingSeconds === 0) {
        // Transition finished!
        setAutoPlayLoadingSeconds(null);
        if (completedAdsCount < 2) {
          handleNextAd();
        } else {
          // Auto-claim on the last ad completion
          handleFinishAdAndClaim();
        }
      }
    } else {
      setAutoPlayLoadingSeconds(null);
    }
  }, [showAdModal, adPlayMode, adCountdown, autoPlayLoadingSeconds, completedAdsCount]);

  // Get ad trial claims for the current device MAC within the last 30 days
  const getClaimsInLast30Days = () => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return (state.adTrialClaims || []).filter(c => 
      c.mac === state.clientMAC && new Date(c.timestamp).getTime() >= thirtyDaysAgo
    );
  };

  // Get remaining days before a new ad slot becomes available
  const getAdResetDaysRemaining = () => {
    const claims = getClaimsInLast30Days();
    if (claims.length < 2) return 0;
    const timestamps = claims.map(c => new Date(c.timestamp).getTime());
    const oldest = Math.min(...timestamps);
    const thirtyDaysFromOldest = oldest + 30 * 24 * 60 * 60 * 1000;
    const msRemaining = thirtyDaysFromOldest - Date.now();
    return Math.max(1, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
  };

  // Effect to sync and find active session for current MAC
  useEffect(() => {
    const currentSession = state.sessions.find(s => s.mac === state.clientMAC);
    setActiveSession(currentSession || null);

    // If active session is a free trial, manage its timer
    if (currentSession && currentSession.voucherCode === "FREE-TRIAL-TEMP") {
      const started = new Date(currentSession.startedAt).getTime();
      const durationMs = currentSession.durationMinutes * 60 * 1000;
      const endsAt = started + durationMs;
      
      const updateTimer = () => {
        const remaining = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
        if (remaining <= 0) {
          // Free trial expired!
          setTrialTimeRemaining(null);
          handleDisconnect();
          setTrialEndedAlert(true);
        } else {
          setTrialTimeRemaining(remaining);
        }
      };

      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    } else {
      setTrialTimeRemaining(null);
    }
  }, [state.sessions, state.clientMAC]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMac(true);
    setTimeout(() => setCopiedMac(false), 2000);
  };

  // 1. Voucher Redemption
  const handleConnectVoucher = (codeToUse?: string) => {
    const code = (codeToUse || voucherCodeInput).trim().toUpperCase();
    if (!code) {
      setErrorMessage("Please enter a valid voucher code.");
      return;
    }

    // Lookup voucher
    const voucherIndex = state.vouchers.findIndex(v => v.code === code);
    if (voucherIndex === -1) {
      setErrorMessage("Voucher code not found. Please verify and try again.");
      state.addLog('System', 'Client Portal', 'Voucher Failed', `Attempted invalid voucher code: ${code}`);
      return;
    }

    const voucher = state.vouchers[voucherIndex];

    // Check status
    if (voucher.status === 'expired') {
      setErrorMessage("This voucher code has already expired.");
      return;
    }

    // Verify package and device binding
    const pkg = state.packages.find(p => p.id === voucher.packageId);
    if (!pkg) {
      setErrorMessage("Invalid package associated with voucher.");
      return;
    }

    // Device binding checks:
    // If not family plan, bind to first MAC that connects
    const alreadyBound = voucher.boundMACs.includes(state.clientMAC);
    if (voucher.boundMACs.length > 0 && !alreadyBound && pkg.id !== 'pkg-family') {
      // Check device limit
      if (voucher.boundMACs.length >= pkg.devices) {
        setErrorMessage(`Voucher limits reached. This voucher is bound to MAC: ${voucher.boundMACs.join(', ')}.`);
        state.addLog('System', 'Client Portal', 'Binding Failed', `Device ${state.clientMAC} failed to use bound voucher ${code}`);
        return;
      }
    }

    // Apply binding
    const updatedBound = alreadyBound 
      ? voucher.boundMACs 
      : [...voucher.boundMACs, state.clientMAC];

    let actTime = voucher.activationTime;
    let expTime = voucher.expiryTime;
    let newStatus = voucher.status;
    let updatedDeferred = voucher.commissionDeferred;

    if (voucher.status === 'unused') {
      actTime = new Date().toISOString();
      const expDate = new Date(Date.now() + pkg.durationHours * 60 * 60 * 1000);
      expTime = expDate.toISOString();
      newStatus = 'active';

      // Remit 10% commission to agent if this was a bulk-purchased voucher
      if (voucher.agentId && voucher.commissionDeferred) {
        const agentIndex = state.agents.findIndex(a => a.id === voucher.agentId);
        if (agentIndex !== -1) {
          const agent = state.agents[agentIndex];
          const commissionPercent = agent.commissionPercent || 10;
          const commissionAmount = Math.round(pkg.priceUGX * (commissionPercent / 100));
          
          state.agents[agentIndex].walletBalance += commissionAmount;
          state.agents[agentIndex].totalCommissionUGX += commissionAmount;
          
          // Record transaction for the commission credit
          state.transactions.push({
            id: "txn-comm-" + Math.floor(Math.random() * 90000 + 10000),
            phone: voucher.phone || "0700000000",
            amountUGX: commissionAmount,
            packageId: pkg.id,
            voucherCode: code,
            type: 'agent',
            status: 'success',
            timestamp: new Date().toISOString(),
            agentId: agent.id,
            paymentMethod: 'Wallet'
          });

          // Add audit log
          state.addLog(
            'System',
            'Client Portal',
            'Commission Remitted',
            `Voucher ${code} successfully activated. Commission of ${commissionAmount.toLocaleString()} UGX remitted to Agent ${agent.name}'s wallet.`
          );

          updatedDeferred = false;
        }
      }
    }

    // Update voucher in state
    state.vouchers[voucherIndex] = {
      ...voucher,
      status: newStatus as any,
      activationTime: actTime,
      expiryTime: expTime,
      boundMACs: updatedBound,
      commissionDeferred: updatedDeferred
    };

    // Remove any existing session for this MAC
    state.sessions = state.sessions.filter(s => s.mac !== state.clientMAC);

    // Create active session
    const newSession = {
      id: "sess-" + Date.now(),
      mac: state.clientMAC,
      voucherCode: code,
      speed: pkg.speed,
      startedAt: actTime || new Date().toISOString(),
      durationMinutes: pkg.durationHours * 60,
      dataUsedMB: 0,
      ipAddress: "10.5.50." + Math.floor(Math.random() * 200 + 10),
      deviceModel: detectedModel,
      status: 'authorized' as const
    };

    state.sessions.push(newSession);
    state.addLog('System', 'Client Portal', 'Voucher Connected', `Device ${state.clientMAC} connected successfully using voucher ${code} (${pkg.name})`);
    
    setSuccessMessage(`Success! Connected to WIFI ZONE high-speed internet via ${pkg.name}.`);
    setErrorMessage(null);
    setVoucherCodeInput('');
    
    state.save();
    onStateUpdate();
  };

  // 2. Disconnect
  const handleDisconnect = () => {
    const sessionToClose = state.sessions.find(s => s.mac === state.clientMAC);
    if (sessionToClose) {
      // If it was a standard voucher, update active status if needed, or keep as active
      state.sessions = state.sessions.filter(s => s.mac !== state.clientMAC);
      state.addLog('System', 'Client Portal', 'Disconnected', `Device ${state.clientMAC} disconnected from session ${sessionToClose.id}`);
      state.save();
      onStateUpdate();
    }
    setActiveSession(null);
  };

  // 3. Claim Free Trial (20 minutes) via Ad-supported video
  const handleClaimFreeTrial = () => {
    // Check rolling 30 days limit
    const claims = getClaimsInLast30Days();
    if (claims.length >= 2) {
      setErrorMessage("Ad trial limit reached: You can only claim up to 2 ad-supported free trials every 30 days per device. (Current claims: 2/2 in last 30 days)");
      return;
    }

    // Get active ads
    const activeAds = (state.sponsorAds || []).filter(ad => ad.active);
    if (activeAds.length === 0) {
      setErrorMessage("No sponsor campaigns are active right now. Please buy a high-speed voucher or check back later.");
      return;
    }

    // Select up to 3 distinct active ads for simultaneous play
    const shuffled = [...activeAds].sort(() => 0.5 - Math.random());
    const selectedSimultaneous = shuffled.slice(0, Math.min(3, shuffled.length));
    setActiveAdsSimultaneous(selectedSimultaneous);
    
    // Track impressions for all selected simultaneous ads
    selectedSimultaneous.forEach(ad => {
      const adIndex = state.sponsorAds.findIndex(a => a.id === ad.id);
      if (adIndex !== -1) {
        state.sponsorAds[adIndex].impressions = (state.sponsorAds[adIndex].impressions || 0) + 1;
      }
    });

    // Start with 0 completed ads for sequential mode
    setCompletedAdsCount(0);

    // Pick first sequential ad
    const firstAd = activeAds[Math.floor(Math.random() * activeAds.length)];
    setActiveAd(firstAd);

    // Reset countdowns for both modes
    setAdCountdown(15);
    setAdFinished(false);
    setSimultaneousCountdown(15);
    setSimultaneousFinished(false);
    setAutoPlayLoadingSeconds(null);
    
    // Set default mode to simultaneous as requested if 3-months customer history exists!
    if (isEligibleForSimultaneous) {
      setAdPlayMode('simultaneous');
    } else {
      setAdPlayMode('sequential');
    }

    setShowAdModal(true);
    setErrorMessage(null);

    state.save();
    onStateUpdate();
  };

  const handleNextAd = (forceSkip = false) => {
    if (!forceSkip && (!adFinished || !activeAd)) return;

    // Reset sequential auto-play transition loader
    setAutoPlayLoadingSeconds(null);
    
    const nextCompleted = completedAdsCount + 1;
    setCompletedAdsCount(nextCompleted);

    const activeAds = (state.sponsorAds || []).filter(ad => ad.active);
    if (activeAds.length === 0) return;

    // Pick a different ad to avoid immediate repetition
    const otherAds = activeAds.filter(ad => ad.id !== activeAd.id);
    const chosenAd = otherAds.length > 0 
      ? otherAds[Math.floor(Math.random() * otherAds.length)] 
      : activeAds[Math.floor(Math.random() * activeAds.length)];

    // Increment impressions in state
    const adIndex = state.sponsorAds.findIndex(a => a.id === chosenAd.id);
    if (adIndex !== -1) {
      state.sponsorAds[adIndex].impressions = (state.sponsorAds[adIndex].impressions || 0) + 1;
      state.save();
      onStateUpdate();
    }

    setActiveAd(chosenAd);
    setAdCountdown(15);
    setAdFinished(false);
  };

  const handleFinishAdAndClaim = (forceSkip = false) => {
    const isSequentialFinished = adFinished && completedAdsCount >= 2;
    const isSimultaneousFinished = simultaneousFinished;

    if (!forceSkip && !isSequentialFinished && !isSimultaneousFinished) return;

    // Create temp free trial voucher
    const trialCode = "FREE-TRIAL-TEMP";
    
    // Create active session for 20 minutes
    const newSession = {
      id: "sess-trial-" + Date.now(),
      mac: state.clientMAC,
      voucherCode: trialCode,
      speed: "3 Mbps",
      startedAt: new Date().toISOString(),
      durationMinutes: 20,
      dataUsedMB: 0,
      ipAddress: "10.5.50." + Math.floor(Math.random() * 200 + 10),
      deviceModel: detectedModel,
      status: 'authorized' as const
    };

    // Filter out previous session for this device
    state.sessions = state.sessions.filter(s => s.mac !== state.clientMAC);
    state.sessions.push(newSession);
    
    // Set general claimed flag
    state.clientFreeTrialClaimed = true;

    // Record the ad trial claim in our array
    const newClaim = {
      id: "claim-" + Date.now(),
      mac: state.clientMAC,
      timestamp: new Date().toISOString()
    };
    if (!state.adTrialClaims) {
      state.adTrialClaims = [];
    }
    state.adTrialClaims.push(newClaim);

    // Get brand name for success message
    const sponsorBrandName = adPlayMode === 'simultaneous' 
      ? (activeAdsSimultaneous[0]?.brand || "Sponsors") 
      : (activeAd?.brand || "Sponsors");

    // Add audit log
    state.addLog('System', 'Client Portal', 'Ad Free Trial Claimed', `Device ${state.clientMAC} watched sponsor ads simultaneously/automatically (brand: ${sponsorBrandName}) and started 20 min free trial.`);
    
    // Display success
    setSuccessMessage(`Enjoy your 20 minutes of free trial internet sponsored by our brand partners including ${sponsorBrandName}!`);
    setErrorMessage(null);

    // Save and update
    state.save();
    onStateUpdate();

    // Close modal
    setShowAdModal(false);
  };

  // 4. Buy Package (Simulated Mobile Money Flow)
  const handleStartPurchase = (pkg: Package) => {
    setSelectedPackage(pkg);
    setPaymentPhone(state.vouchers.find(v => v.phone)?.phone || "0772123456"); // Default mock
    setPaymentCarrier('MTN');
    setPaymentStep('details');
    setGeneratedVoucher(null);
  };

  const handleProcessPayment = () => {
    if (paymentCarrier === 'Pesapal' && pesapalSubMethod === 'card') {
      if (cardNum.length < 16) {
        setErrorMessage("Please enter a valid 16-digit card number.");
        return;
      }
      if (!cardExp.match(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)) {
        setErrorMessage("Please enter a valid expiry date (MM/YY).");
        return;
      }
      if (cardCvv.length < 3) {
        setErrorMessage("Please enter your card CVV (3-digits).");
        return;
      }
      setErrorMessage(null);
      setPaymentStep('processing');
      
      // Simulate card transaction validation via Pesapal Gateway API
      setTimeout(() => {
        if (!selectedPackage) return;
        
        const voucherCode = generateVoucherCode();
        
        const newVoucher: Voucher = {
          code: voucherCode,
          packageId: selectedPackage.id,
          status: 'unused',
          activationTime: null,
          expiryTime: null,
          boundMACs: [],
          phone: "0770000000",
          agentId: null,
          createdTime: new Date().toISOString()
        };
        state.vouchers.push(newVoucher);
        
        const newTxn = {
          id: "txn-pesa-" + Math.floor(Math.random() * 90000 + 10000),
          phone: "Card Payment",
          amountUGX: selectedPackage.priceUGX,
          packageId: selectedPackage.id,
          voucherCode: voucherCode,
          type: 'online' as const,
          status: 'success' as const,
          timestamp: new Date().toISOString(),
          agentId: null,
          paymentMethod: 'Pesapal' as const
        };
        state.transactions.push(newTxn);
        
        state.addLog('System', 'Pesapal Gateway', 'Card Payment Success', `Secure card authorization successful for ${selectedPackage.priceUGX} UGX via Pesapal. Generated voucher: ${voucherCode}`);
        setGeneratedVoucher(voucherCode);
        setPaymentStep('success');
        state.save();
        onStateUpdate();
      }, 2500);
      return;
    }

    if (!paymentPhone.match(/^(07[0-9]{8})$/)) {
      setErrorMessage("Please enter a valid 10-digit Uganda phone number (e.g., 0772123456).");
      return;
    }
    setErrorMessage(null);
    setPaymentStep('ussd');
  };

  const handleSubmitUssdPin = () => {
    if (ussdPin.length < 4) {
      setErrorMessage("Please enter your 4 or 5-digit Mobile Money PIN.");
      return;
    }
    setErrorMessage(null);
    setPaymentStep('processing');

    // Simulate Network delay for Mobile Money transaction validation
    setTimeout(() => {
      if (!selectedPackage) return;

      const voucherCode = generateVoucherCode();
      
      // Save voucher
      const newVoucher: Voucher = {
        code: voucherCode,
        packageId: selectedPackage.id,
        status: 'unused',
        activationTime: null,
        expiryTime: null,
        boundMACs: [],
        phone: paymentPhone,
        agentId: null,
        createdTime: new Date().toISOString()
      };

      state.vouchers.push(newVoucher);

      // Save transaction
      const newTxn = {
        id: "txn-" + Math.floor(Math.random() * 90000 + 10000),
        phone: paymentPhone,
        amountUGX: selectedPackage.priceUGX,
        packageId: selectedPackage.id,
        voucherCode: voucherCode,
        type: 'online' as const,
        status: 'success' as const,
        timestamp: new Date().toISOString(),
        agentId: null,
        paymentMethod: paymentCarrier
      };

      state.transactions.push(newTxn);
      state.addLog('System', 'Payment Gateway', 'Payment Success', `Online payment of ${selectedPackage.priceUGX} UGX from ${paymentPhone} via ${paymentCarrier}. Generated voucher ${voucherCode}`);
      
      setGeneratedVoucher(voucherCode);
      setPaymentStep('success');
      state.save();
      onStateUpdate();
    }, 2000);
  };

  // 5. Find My Voucher Lookup
  const handleVoucherLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupPhone) return;

    const results = state.vouchers.filter(v => v.phone === lookupPhone);
    setLookupResults(results);
    setHasSearchedVouchers(true);
  };

  // 6. Smart TV Registration
  const handleTvRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tvVoucher || !tvMac) {
      setErrorMessage("Please enter both voucher code and the Smart TV MAC address.");
      return;
    }

    // Verify MAC address format
    const cleanedMac = tvMac.trim().toUpperCase();
    if (!cleanedMac.match(/^([0-9A-FA-F]{2}[:-]){5}([0-9A-FA-F]{2})$/)) {
      setErrorMessage("Please enter a valid MAC address format (e.g. AA:BB:CC:DD:EE:FF).");
      return;
    }

    const voucherIndex = state.vouchers.findIndex(v => v.code === tvVoucher.trim().toUpperCase());
    if (voucherIndex === -1) {
      setErrorMessage("Voucher code not found.");
      return;
    }

    const voucher = state.vouchers[voucherIndex];
    const pkg = state.packages.find(p => p.id === voucher.packageId);
    if (!pkg) return;

    if (voucher.boundMACs.includes(cleanedMac)) {
      setSuccessMessage("This Smart TV MAC address is already registered on this voucher.");
      setTvSuccess(true);
      return;
    }

    if (voucher.boundMACs.length >= pkg.devices && pkg.id !== 'pkg-family') {
      setErrorMessage(`Voucher device limit reached (${pkg.devices} max). Cannot register TV.`);
      return;
    }

    // Bind MAC to voucher
    const updatedBound = [...voucher.boundMACs, cleanedMac];
    let actTime = voucher.activationTime;
    let expTime = voucher.expiryTime;
    let newStatus = voucher.status;
    let updatedDeferred = voucher.commissionDeferred;

    if (voucher.status === 'unused') {
      actTime = new Date().toISOString();
      expTime = new Date(Date.now() + pkg.durationHours * 60 * 60 * 1000).toISOString();
      newStatus = 'active';

      // Remit 10% commission to agent if this was a bulk-purchased voucher
      if (voucher.agentId && voucher.commissionDeferred) {
        const agentIndex = state.agents.findIndex(a => a.id === voucher.agentId);
        if (agentIndex !== -1) {
          const agent = state.agents[agentIndex];
          const commissionPercent = agent.commissionPercent || 10;
          const commissionAmount = Math.round(pkg.priceUGX * (commissionPercent / 100));
          
          state.agents[agentIndex].walletBalance += commissionAmount;
          state.agents[agentIndex].totalCommissionUGX += commissionAmount;
          
          // Record transaction for the commission credit
          state.transactions.push({
            id: "txn-comm-" + Math.floor(Math.random() * 90000 + 10000),
            phone: voucher.phone || "0700000000",
            amountUGX: commissionAmount,
            packageId: pkg.id,
            voucherCode: voucher.code,
            type: 'agent',
            status: 'success',
            timestamp: new Date().toISOString(),
            agentId: agent.id,
            paymentMethod: 'Wallet'
          });

          // Add audit log
          state.addLog(
            'System',
            'Client Portal',
            'Commission Remitted',
            `Voucher ${voucher.code} successfully activated for Smart TV. Commission of ${commissionAmount.toLocaleString()} UGX remitted to Agent ${agent.name}'s wallet.`
          );

          updatedDeferred = false;
        }
      }
    }

    state.vouchers[voucherIndex] = {
      ...voucher,
      status: newStatus as any,
      activationTime: actTime,
      expiryTime: expTime,
      boundMACs: updatedBound,
      commissionDeferred: updatedDeferred
    };

    // Auto connect TV session simulation
    const newSession = {
      id: "sess-" + Date.now(),
      mac: cleanedMac,
      voucherCode: voucher.code,
      speed: pkg.speed,
      startedAt: actTime || new Date().toISOString(),
      durationMinutes: pkg.durationHours * 60,
      dataUsedMB: 0,
      ipAddress: "10.5.50." + Math.floor(Math.random() * 200 + 10)
    };
    state.sessions.push(newSession);

    state.addLog('System', 'Client Portal', 'Smart TV Registered', `Smart TV ${cleanedMac} registered and connected using voucher ${voucher.code}`);
    setSuccessMessage(`Success! Smart TV registered. It is now connected to the internet.`);
    setErrorMessage(null);
    setTvSuccess(true);
    setTvVoucher('');
    setTvMac('');

    state.save();
    onStateUpdate();
  };

  const getCarrierBg = (carrier: string) => {
    if (carrier === 'MTN') return 'bg-yellow-500 hover:bg-yellow-600 text-black';
    if (carrier === 'Airtel') return 'bg-red-600 hover:bg-red-700 text-white';
    return 'bg-emerald-600 hover:bg-emerald-700 text-white';
  };

  const getCarrierLogoColor = (carrier: string) => {
    if (carrier === 'MTN') return 'text-yellow-500';
    if (carrier === 'Airtel') return 'text-red-500';
    return 'text-emerald-500';
  };

  // Collapsible FAQ content
  const faqs = [
    {
      q: "Where can I buy physical vouchers?",
      a: "You can buy physical scratch cards from any authorized WIFI ZONE retail agent in Bukedea, Kumi, Mbale, Lira, Gulu, and Arua. Look for our vibrant orange banners!"
    },
    {
      q: "How does the device binding work?",
      a: "To protect your bandwidth, your voucher automatically binds to the MAC address of the first device you connect with (except for Family plans, which allow up to 4 devices)."
    },
    {
      q: "Can I use the internet on my Smart TV or PlayStation?",
      a: "Yes! Connect your Smart TV/console to the WIFI ZONE network, copy its MAC address from its network settings, and register it here using the 'Smart TV Registration' form below."
    },
    {
      q: "How can I check my remaining session time?",
      a: "As long as you are connected to WIFI ZONE, visiting this portal will automatically display your session status, remaining time, and data usage statistics."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Modern Radiant Ambient Glow Background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* 1. Header & Live Connection Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-navy-800/90 border-b border-navy-700 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <TBSLogo />

          <div className="flex items-center gap-2">
            <a 
              href="/tbs-connect-wisp.zip"
              download="tbs-connect-wisp.zip"
              className="px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/25 text-xs text-teal-400 font-bold rounded-md border border-teal-500/30 transition flex items-center gap-1.5"
              id="source-code-download-btn"
            >
              <Download className="h-3.5 w-3.5 animate-bounce" />
              <span>Download Source ZIP</span>
            </a>
            <button 
              onClick={onGoToAdmin}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium rounded-md border border-slate-700 transition flex items-center gap-1"
              id="admin-portal-switch"
            >
              <User className="h-3.5 w-3.5" />
              Admin Portal
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-6 w-full space-y-6">

        {/* Floating notifications */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-red-950/80 border border-red-500/50 text-red-200 text-sm rounded-xl flex items-start gap-3 shadow-lg"
            >
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Error Occurred</p>
                <p className="text-xs text-red-300">{errorMessage}</p>
              </div>
              <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-200">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-sm rounded-xl flex items-start gap-3 shadow-lg"
            >
              <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Success</p>
                <p className="text-xs text-emerald-300">{successMessage}</p>
              </div>
              <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-emerald-200">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {trialEndedAlert && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 bg-slate-900 border-2 border-yellow-500 text-center rounded-2xl shadow-2xl max-w-md mx-auto"
            >
              <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Your Free Trial Has Ended!</h3>
              <p className="text-slate-300 text-sm mb-4">
                Thank you for trying WIFI ZONE. To keep browsing without interruption, please purchase one of our affordable high-speed packages below.
              </p>
              <button 
                onClick={() => setTrialEndedAlert(false)}
                className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold rounded-xl transition"
              >
                Buy A Package
              </button>
            </motion.div>
          )}

          {showAdModal && activeAd && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md overflow-y-auto animate-fadeIn"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-slate-900 border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl relative my-8"
              >
                {/* Header with Close warning */}
                <div className="p-5 border-b border-navy-800 flex items-center justify-between bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                    <div>
                      <h3 className="text-base font-bold text-white font-display">Sponsor-Supported Free Internet</h3>
                      <p className="text-[10px] text-slate-400">Claim 20 minutes of high-speed browsing</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to exit? You will lose progress and won't claim your 20 minutes of free internet.")) {
                        setShowAdModal(false);
                      }
                    }}
                    className="p-1.5 rounded-full bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-950 transition border border-navy-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Ad Mode Selector Toggle */}
                <div className="px-6 pt-4 pb-2 bg-slate-950/20">
                  <div className="flex bg-slate-950 p-1 rounded-2xl border border-navy-800 text-xs">
                    <button
                      onClick={() => {
                        if (isEligibleForSimultaneous) {
                          setAdPlayMode('simultaneous');
                        } else {
                          alert(`🔒 Simultaneous play requires at least 3 months (~90 days) customer history on this MAC address.\n\nYour current history: ${daysCustomer} days.\n\nYou can use the "Simulate Device History" toggle on the connection box to change this and test this mode!`);
                        }
                      }}
                      className={`flex-1 py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                        adPlayMode === 'simultaneous'
                          ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300 border border-teal-500/30"
                          : !isEligibleForSimultaneous
                            ? "text-slate-600 cursor-not-allowed hover:text-slate-500"
                            : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Zap className="h-3.5 w-3.5" />
                      ⚡ Play Simultaneously {!isEligibleForSimultaneous && "🔒"}
                    </button>
                    <button
                      onClick={() => setAdPlayMode('sequential')}
                      className={`flex-1 py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                        adPlayMode === 'sequential'
                          ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 border border-yellow-500/30"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      🔄 Play Sequentially (Auto 3s Buffer)
                    </button>
                  </div>
                  {!isEligibleForSimultaneous && (
                    <p className="text-[10px] text-center text-yellow-500/80 font-mono mt-1.5 px-4">
                      🔒 Simultaneous mode locked. Only available for MAC addresses registered for ≥ 90 days (Current: {daysCustomer} days).
                    </p>
                  )}
                </div>

                {/* SINGLE UNIFIED AD PLAYER (Displays One Ad at a Time) */}
                {(() => {
                  // In simultaneous mode, select active ad index based on elapsed 15s timer
                  const currentSimultaneousIndex = adPlayMode === 'simultaneous'
                    ? Math.min(2, Math.floor((15 - simultaneousCountdown) / 5))
                    : completedAdsCount;

                  const displayedAd = adPlayMode === 'simultaneous'
                    ? (activeAdsSimultaneous[currentSimultaneousIndex] || activeAd)
                    : activeAd;

                  if (!displayedAd) return null;

                  // Determine timer displays
                  const isCurrentAdFinished = adPlayMode === 'simultaneous'
                    ? simultaneousFinished
                    : adFinished;

                  const remainingTime = adPlayMode === 'simultaneous'
                    ? simultaneousCountdown
                    : adCountdown;

                  return (
                    <div className="p-6 space-y-5">
                      {/* Ad player info / status bar */}
                      <div className="p-3 bg-slate-950/80 rounded-2xl border border-teal-500/10 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${isCurrentAdFinished ? 'bg-emerald-400' : 'bg-teal-400 animate-pulse'}`} />
                          <span className="font-bold text-slate-300 font-mono uppercase tracking-wider">
                            {adPlayMode === 'simultaneous' ? "⚡ Simultaneous Turbo Play (15s Total)" : "🔄 Sequential Play (45s Total)"}
                          </span>
                        </div>
                        <div className="font-mono text-slate-400">
                          {adPlayMode === 'simultaneous' ? (
                            <span>Total Timer: <span className="text-teal-400 font-bold">{remainingTime}s</span></span>
                          ) : (
                            <span>Ad Countdown: <span className="text-yellow-400 font-bold">{remainingTime}s</span></span>
                          )}
                        </div>
                      </div>

                      {/* Main Single Ad Player container */}
                      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden rounded-2xl border border-navy-800 group">
                        {/* Show loading overlay if transitioning (Sequential mode transition buffer) */}
                        {adPlayMode === 'sequential' && autoPlayLoadingSeconds !== null && (
                          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-sm p-4 text-center">
                            <Loader className="h-8 w-8 text-yellow-400 animate-spin mb-3" />
                            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                              Optimizing Hotspot Connection
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 max-w-xs">
                              {completedAdsCount < 2 
                                ? `Buffering next sponsor campaign... Auto-playing in ${autoPlayLoadingSeconds}s`
                                : `All campaigns completed successfully! Starting internet session in ${autoPlayLoadingSeconds}s`}
                            </p>
                            
                            {/* Immediate skip transition button */}
                            <button
                              onClick={() => {
                                setAutoPlayLoadingSeconds(null);
                                if (completedAdsCount < 2) {
                                  handleNextAd(true);
                                } else {
                                  handleFinishAdAndClaim(true);
                                }
                              }}
                              className="mt-5 px-3.5 py-1.5 bg-yellow-500/10 text-yellow-400 rounded-lg text-[10px] font-bold border border-yellow-500/30 flex items-center gap-1 hover:bg-yellow-500/20 transition"
                            >
                              <SkipForward className="h-3.5 w-3.5" />
                              Skip Buffer (Customer Action)
                            </button>
                          </div>
                        )}

                        <img 
                          src={displayedAd.imageUrl} 
                          alt={displayedAd.title}
                          className="w-full h-full object-cover select-none pointer-events-none transition duration-500 scale-102 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        
                        {/* Countdown overlay */}
                        <div className="absolute top-4 left-4 py-1.5 px-3 bg-slate-950/80 rounded-full border border-slate-700/50 backdrop-blur-sm text-xs font-mono font-bold text-white flex items-center gap-2">
                          {isCurrentAdFinished ? (
                            <span className="text-teal-400 flex items-center gap-1">
                              <Check className="h-3 w-3" /> All Sponsors Completed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-yellow-500 animate-ping" />
                              Campaign {currentSimultaneousIndex + 1}/3: {remainingTime}s remaining
                            </span>
                          )}
                        </div>

                        {/* Brand Tag */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-yellow-400 text-slate-950 rounded-md tracking-wider">
                            SPONSORED BY {displayedAd.brand.toUpperCase()}
                          </span>
                          <h4 className="text-lg font-bold text-white font-display mt-1 drop-shadow">
                            {displayedAd.title}
                          </h4>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <motion.div 
                          key={adPlayMode}
                          initial={{ width: "0%" }}
                          animate={{ width: isCurrentAdFinished ? "100%" : `${((15 - remainingTime) / 15) * 100}%` }}
                          transition={{ duration: 1, ease: "linear" }}
                          className="h-full bg-gradient-to-r from-yellow-400 to-teal-400"
                        />
                      </div>

                      {/* Ad Copy & Brand CTA */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-xl border border-navy-800">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center font-bold text-yellow-400 text-sm">
                              {displayedAd.brand.charAt(0)}
                            </div>
                            <div>
                              <h5 className="font-bold text-white text-sm">{displayedAd.brand}</h5>
                              <p className="text-[10px] text-slate-400 font-medium font-mono">{displayedAd.tagline}</p>
                            </div>
                          </div>
                          
                          {/* Ads completed progress dots */}
                          <div className="flex items-center gap-1 bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-[9px] text-slate-400 font-mono font-bold mr-1">Campaigns:</span>
                            {[1, 2, 3].map((step) => {
                              const stepIdx = step - 1;
                              const isCompleted = adPlayMode === 'simultaneous'
                                ? (currentSimultaneousIndex > stepIdx || simultaneousFinished)
                                : (completedAdsCount > stepIdx || (completedAdsCount === stepIdx && adFinished));
                              const isCurrent = currentSimultaneousIndex === stepIdx && !isCurrentAdFinished;
                              return (
                                <div 
                                  key={step} 
                                  className={`h-1.5 w-3 rounded-full transition-colors duration-300 ${
                                    isCompleted 
                                      ? "bg-teal-400" 
                                      : isCurrent 
                                        ? "bg-yellow-400 animate-pulse" 
                                        : "bg-slate-700"
                                  }`} 
                                  title={`Ad ${step}`}
                                />
                              );
                            })}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/30 p-3 rounded-xl border border-navy-800 min-h-[50px]">
                          {displayedAd.description}
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                          <button 
                            onClick={() => {
                              const adIndex = state.sponsorAds.findIndex(a => a.id === displayedAd.id);
                              if (adIndex !== -1) {
                                state.sponsorAds[adIndex].clicks = (state.sponsorAds[adIndex].clicks || 0) + 1;
                                state.save();
                                onStateUpdate();
                              }
                              alert(`Simulating ad click-through to sponsor website! This triggers conversion credit for ${displayedAd.brand}.`);
                            }}
                            className="flex-1 text-center py-2.5 bg-slate-850 hover:bg-slate-750 text-white font-bold rounded-xl text-xs border border-slate-700 transition"
                          >
                            {displayedAd.ctaText}
                          </button>

                          {/* Customer direct skip button - always enabled for Customers */}
                          <button
                            onClick={() => {
                              if (adPlayMode === 'simultaneous') {
                                setSimultaneousCountdown(0);
                                setSimultaneousFinished(true);
                                handleFinishAdAndClaim(true);
                              } else {
                                if (completedAdsCount < 2) {
                                  handleNextAd(true);
                                } else {
                                  handleFinishAdAndClaim(true);
                                }
                              }
                            }}
                            className="flex-1 py-2.5 bg-slate-850 hover:bg-slate-750 text-slate-300 hover:text-white font-extrabold rounded-xl text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
                            title="Bypasses the current countdown timer (Customer perk)"
                          >
                            <SkipForward className="h-3.5 w-3.5 text-yellow-400 animate-pulse" />
                            Skip Ad (Customer Skip)
                          </button>

                          {isCurrentAdFinished ? (
                            adPlayMode === 'simultaneous' ? (
                              <button
                                onClick={() => handleFinishAdAndClaim(true)}
                                className="flex-1 py-2.5 bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs transition shadow-lg shadow-teal-500/20 flex items-center justify-center gap-1.5"
                              >
                                Claim 20 Min Internet
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            ) : (
                              completedAdsCount < 2 ? (
                                <button
                                  onClick={() => handleNextAd(false)}
                                  className="flex-1 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-1.5"
                                >
                                  Next Sponsor Ad (Ad {completedAdsCount + 2} of 3)
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleFinishAdAndClaim(false)}
                                  className="flex-1 py-2.5 bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs transition shadow-lg shadow-teal-500/20 flex items-center justify-center gap-1.5"
                                >
                                  Claim 20 Min Internet
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                              )
                            )
                          ) : (
                            <button
                              disabled
                              className="flex-1 py-2.5 bg-slate-800 text-slate-500 cursor-not-allowed font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-navy-800"
                            >
                              Wait {remainingTime}s to continue
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. Customer Post-Login Self Service Portal OR Main Redemption Panel */}
        {activeSession ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl border border-teal-500/30 shadow-xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -z-10" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <Activity className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white font-display">Active Internet Session</h2>
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 rounded-full font-semibold border border-emerald-500/30">Connected</span>
                  </div>
                  <p className="text-xs text-slate-300">MAC Address: <span className="font-mono text-white">{state.clientMAC}</span></p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleDisconnect}
                  className="px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                >
                  <X className="h-3.5 w-3.5" />
                  Disconnect Session
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-navy-700/60 pt-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-navy-700/40">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Remaining Time</p>
                {trialTimeRemaining !== null ? (
                  <p className="text-2xl font-bold text-yellow-400 font-mono mt-1">
                    {Math.floor(trialTimeRemaining / 60)}m {trialTimeRemaining % 60}s
                  </p>
                ) : (
                  <p className="text-xl font-bold text-teal-400 font-mono mt-1">
                    High Speed Unlimited
                  </p>
                )}
                <span className="text-[10px] text-slate-500">Based on voucher limits</span>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-navy-700/40">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Speed Cap</p>
                <p className="text-2xl font-bold text-white mt-1 flex items-center gap-1">
                  <Zap className="h-5 w-5 text-teal-400" />
                  {activeSession.speed}
                </p>
                <span className="text-[10px] text-slate-500">Symmetric download/upload</span>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-navy-700/40">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Voucher Code</p>
                <p className="text-lg font-bold text-white font-mono mt-2 select-all">
                  {activeSession.voucherCode}
                </p>
                <span className="text-[10px] text-slate-500">Auto-bound to this device</span>
              </div>
            </div>

            <div className="mt-5 p-3.5 bg-slate-900/40 rounded-xl border border-teal-500/10 flex items-center gap-3">
              <Info className="h-4 w-4 text-teal-400 shrink-0" />
              <p className="text-xs text-slate-300">
                <strong>Need more time?</strong> You can purchase a top-up package below. Any unused time on your current voucher will be preserved.
              </p>
            </div>
          </motion.div>
        ) : (
          /* Redemptions Block */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Voucher Code Box */}
            <div className="md:col-span-7 bg-navy-800 rounded-2xl border border-navy-700 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl -z-10" />
              
              <div>
                {/* Immediate Device Recognition Indicator */}
                <div className="mb-5 p-3.5 bg-slate-900/80 border border-emerald-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0 border border-emerald-500/20">
                      <Smartphone className="h-5 w-5 animate-pulse" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          ● Device Connected
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Automatic Pairing</span>
                      </div>
                      <p className="text-xs font-bold text-white font-sans">
                        Recognized Device: <span className="text-teal-300">{detectedModel}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Hardware MAC: <span className="text-slate-200">{state.clientMAC}</span>
                      </p>
                      
                      {/* Customer History Status */}
                      <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-300 font-mono">
                          Tenure: <span className="font-bold text-yellow-400">{daysCustomer} days</span>
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          isEligibleForSimultaneous 
                            ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" 
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {isEligibleForSimultaneous ? "✓ 3M+ Loyal (Sim-Ads)" : "✗ New (<3M) Sequential"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-1.5 self-stretch sm:self-center">
                    <span className="text-center text-[10px] bg-emerald-950 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                      Pre-Auth Active
                    </span>
                    <button
                      onClick={handleToggleCustomerSince}
                      className="px-2 py-1 text-[9px] font-bold bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white rounded border border-slate-700 transition flex items-center justify-center gap-1"
                      title="Simulate different duration of customer tenure for testing ad modes"
                    >
                      <span>🔄 Simulate {isEligibleForSimultaneous ? "New (<3M)" : "Loyal (3M+)"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 text-xs bg-teal-500/10 text-teal-300 rounded-full font-bold border border-teal-500/20">Step 1</span>
                  <h2 className="text-lg font-bold text-white font-display">Enter Your Voucher Code</h2>
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  If you bought a scratch card from an agent or purchased online, enter the 6-character code below to start browsing.
                </p>

                <div className="space-y-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="A1B2C3"
                      value={voucherCodeInput}
                      onChange={(e) => setVoucherCodeInput(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-950 border border-navy-600 rounded-xl font-mono text-center text-lg text-white font-bold tracking-widest placeholder-slate-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                      maxLength={6}
                      id="voucher-code-field"
                    />
                  </div>

                  <button 
                    onClick={() => handleConnectVoucher()}
                    className="w-full py-3.5 bg-teal-500 hover:bg-teal-600 text-navy-800 font-bold rounded-xl shadow-lg shadow-teal-500/20 transition duration-150 flex items-center justify-center gap-2 text-sm"
                    id="connect-internet-btn"
                  >
                    <Wifi className="h-4 w-4" />
                    Connect to Internet
                  </button>
                </div>
              </div>

              {/* Display Device MAC */}
              <div className="mt-5 pt-4 border-t border-navy-700/60 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Smartphone className="h-4.5 w-4.5 text-slate-400" />
                  Your Device MAC: <span className="font-mono text-white ml-1 font-semibold">{state.clientMAC}</span>
                </span>
                <button 
                  onClick={() => copyToClipboard(state.clientMAC)}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-950 border border-navy-600 rounded text-slate-300 hover:text-white transition flex items-center gap-1 font-medium"
                >
                  {copiedMac ? <Check className="h-3 w-3 text-teal-400" /> : <Copy className="h-3 w-3" />}
                  Copy
                </button>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="md:col-span-5 flex flex-col gap-4">
              
              {/* Free Trial Button */}
              <div className="bg-gradient-to-br from-slate-900 to-navy-900 rounded-2xl border border-navy-700 p-5 shadow-xl relative overflow-hidden flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-teal-300 uppercase tracking-wider font-display">Sponsor Ads</h3>
                    <span className="px-2 py-0.5 text-[9px] bg-teal-400 text-slate-950 rounded-full font-extrabold uppercase">Trial</span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">Claim 20 Min Free Trial</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Watch 3 sponsor advertisements (15 seconds each) consecutively to unlock instant high-speed access. Max 2 claims every 30 days.
                  </p>
                </div>

                <div className="mt-4">
                  {(() => {
                    const claimsThisPeriod = getClaimsInLast30Days();
                    const claimsCount = claimsThisPeriod.length;
                    const isLimitReached = claimsCount >= 2;

                    if (isLimitReached) {
                      return (
                        <div className="space-y-2">
                          <div className="py-2.5 px-3 bg-red-950/40 rounded-xl border border-red-900/50 text-center text-xs text-red-400 font-medium">
                            Limit reached: 2 claims used this 30 days.
                          </div>
                          <div className="text-[10px] text-slate-500 text-center font-mono font-bold">
                            Next claim unlocks in ~{getAdResetDaysRemaining()} days
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>30-day claim usage:</span>
                          <span className="font-bold text-teal-400 font-mono bg-slate-950 px-2 py-0.5 rounded-md">{claimsCount} / 2</span>
                        </div>
                        <button 
                          onClick={handleClaimFreeTrial}
                          className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-extrabold rounded-xl transition text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/15"
                          id="claim-free-trial-btn"
                        >
                          Watch Sponsor Ads (3 × 15s)
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Look Up Voucher */}
              <div className="bg-slate-900 rounded-2xl border border-navy-700 p-5 shadow-xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">Find My Voucher</h4>
                <form onSubmit={handleVoucherLookup} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter phone: 07..."
                    value={lookupPhone}
                    onChange={(e) => setLookupPhone(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-950 border border-navy-600 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-teal-400"
                    id="lookup-phone-field"
                  />
                  <button 
                    type="submit"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold rounded-lg border border-slate-700 transition"
                  >
                    Lookup
                  </button>
                </form>

                {hasSearchedVouchers && (
                  <div className="mt-3 space-y-1.5 max-h-24 overflow-y-auto">
                    {lookupResults.length === 0 ? (
                      <p className="text-[10px] text-slate-500 italic">No vouchers found for this number.</p>
                    ) : (
                      lookupResults.map(v => {
                        const pkg = state.packages.find(p => p.id === v.packageId);
                        return (
                          <div key={v.code} className="flex items-center justify-between text-[11px] bg-slate-950/80 p-1.5 rounded border border-navy-700/50">
                            <span className="font-mono font-bold text-teal-300">{v.code}</span>
                            <span className="text-slate-400 text-[10px]">({pkg?.name})</span>
                            {v.status === 'unused' ? (
                              <button 
                                onClick={() => handleConnectVoucher(v.code)}
                                className="px-1.5 py-0.5 bg-teal-500 text-slate-950 font-bold rounded text-[9px]"
                              >
                                Connect
                              </button>
                            ) : (
                              <span className="text-slate-500 capitalize text-[9px]">{v.status}</span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 3. Package Pricing Table */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                <Zap className="h-5 w-5 text-teal-400" />
                Choose a High-Speed Package
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Symmetric, unlimited downloads with individual multi-tier color options.</p>
            </div>

            {/* Smart Category Filters */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-navy-800 shrink-0">
              <button
                onClick={() => {
                  setSelectedFilter('all');
                  setSelectedAdvisorNeed(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedFilter === 'all' && !selectedAdvisorNeed
                    ? 'bg-teal-500 text-navy-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Packages
              </button>
              <button
                onClick={() => {
                  setSelectedFilter('budget');
                  setSelectedAdvisorNeed(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedFilter === 'budget'
                    ? 'bg-emerald-500 text-navy-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Budget (≤ 2,500 UGX)
              </button>
              <button
                onClick={() => {
                  setSelectedFilter('weekly-monthly');
                  setSelectedAdvisorNeed(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedFilter === 'weekly-monthly'
                    ? 'bg-indigo-500 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Weekly & Monthly
              </button>
              <button
                onClick={() => {
                  setSelectedFilter('multidevice');
                  setSelectedAdvisorNeed(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedFilter === 'multidevice'
                    ? 'bg-rose-500 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Multi-Device ({'>'}1 Dev)
              </button>
            </div>
          </div>

          {/* Interactive Needs Advisor Bar */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-navy-800/80">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5">
              💡 Smart Package Advisor — Select what you plan to do:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(state.smartPlans || []).map((needObj) => {
                const isSelected = selectedAdvisorNeed === needObj.key;
                
                // Determine icon
                let NIcon = User;
                if (needObj.key === 'browse') NIcon = Smartphone;
                else if (needObj.key === 'study') NIcon = GraduationCap;
                else if (needObj.key === 'video') NIcon = Tv;

                return (
                  <button
                    key={needObj.key}
                    type="button"
                    onClick={() => {
                      setSelectedAdvisorNeed(isSelected ? null : needObj.key);
                      // Auto-adjust categories to present the recommended package
                      if (!isSelected) {
                        if (needObj.key === 'browse') setSelectedFilter('budget');
                        else if (needObj.key === 'household') setSelectedFilter('multidevice');
                        else setSelectedFilter('weekly-monthly');
                      } else {
                        setSelectedFilter('all');
                      }
                    }}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-teal-500/10 border-teal-400/80 shadow-md shadow-teal-500/5'
                        : 'bg-slate-950/40 border-navy-800/60 hover:bg-slate-950/80 hover:border-navy-700'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-teal-500/20 text-teal-400' : 'bg-navy-900 text-slate-400'}`}>
                      <NIcon className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <p className={`text-xs font-black truncate ${isSelected ? 'text-teal-300' : 'text-slate-300'}`}>{needObj.label}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{needObj.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {state.packages
              .filter((pkg) => {
                if (selectedFilter === 'budget') return pkg.priceUGX <= 2500;
                if (selectedFilter === 'weekly-monthly') return pkg.durationHours >= 168;
                if (selectedFilter === 'multidevice') return pkg.devices > 1;
                return true;
              })
              .map((pkg) => {
                const style = getPackageStyle(pkg.id);
                const IconComponent = style.icon;
                
                const currentSmartPlan = (state.smartPlans || []).find(sp => sp.key === selectedAdvisorNeed);
                const isRecommended = selectedAdvisorNeed && currentSmartPlan && pkg.id === currentSmartPlan.targetPkg;

                return (
                  <div 
                    key={pkg.id}
                    className={`bg-gradient-to-b ${style.bg} rounded-2xl border p-5 flex flex-col justify-between shadow-lg transition-all duration-300 group relative overflow-hidden ${
                      isRecommended 
                        ? 'ring-2 ring-teal-400/70 shadow-teal-500/10 scale-[1.02] z-10' 
                        : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Glowing background bubble */}
                    <div className={`absolute -right-10 -top-10 w-32 h-32 ${style.glowingGlow} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-300`} />
                    
                    {/* Custom Tag Badges */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      {isRecommended && (
                        <span className="px-2 py-0.5 text-[9px] bg-teal-500 text-navy-950 font-black rounded-full uppercase tracking-widest animate-bounce flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5" /> Best Match
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-[9px] ${style.tagBg} font-bold rounded-full border uppercase tracking-wider`}>
                        {style.tag}
                      </span>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2 pr-20">
                        <div className={`p-1.5 rounded-lg bg-slate-950/50 ${style.accentText}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <h3 className="text-base font-extrabold text-white font-display transition-colors">
                          {pkg.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-baseline gap-1.5 my-3.5">
                        <span className="text-3xl font-black text-white tracking-tight">{pkg.priceUGX.toLocaleString()}</span>
                        <span className={`text-xs font-bold ${style.accentText}`}>UGX</span>
                        <span className="text-xs text-slate-400 ml-1">/ {pkg.durationHours >= 24 ? `${pkg.durationHours / 24} Day` : `${pkg.durationHours} Hours`}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-4 min-h-[36px]">
                        {pkg.notes}
                      </p>

                      {/* Smart Metric helper */}
                      <div className="bg-slate-950/40 p-2 rounded-lg border border-navy-800/40 text-[10px] text-slate-400 mb-4 flex items-center gap-1.5">
                        <TrendingUp className={`h-3 w-3 shrink-0 ${style.accentText}`} />
                        <span>{style.benefit}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-navy-700/60 mt-auto space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Smartphone className="h-3.5 w-3.5 text-slate-500" />
                          Concurrent devices:
                        </span>
                        <span className="font-bold text-white bg-slate-950/50 px-2 py-0.5 rounded border border-navy-700">
                          {pkg.devices} {pkg.devices > 1 ? 'Devices' : 'Device'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3.5 w-3.5 text-slate-500" />
                          Download Speed:
                        </span>
                        <span className={`font-bold font-mono px-2 py-0.5 rounded border border-navy-700/80 ${style.accentText} bg-slate-950/50`}>
                          {pkg.speed}
                        </span>
                      </div>

                      <button 
                        onClick={() => handleStartPurchase(pkg)}
                        className={`w-full py-2.5 ${style.button} font-black text-xs rounded-xl border transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md`}
                        id={`buy-pkg-${pkg.id}`}
                      >
                        Buy Online Now
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* 4. Physical Agent Banner */}
        <div className="bg-gradient-to-r from-teal-900/30 to-navy-900/40 border border-teal-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">No Mobile Money? Purchase from an Agent</h4>
              <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                Visit any retail agent in Bukedea, Kumi, Mbale, Lira, Gulu, or Arua to buy scratch cards and cash vouchers with cash.
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              setOpenFaq(0);
              const element = document.getElementById('faqs-section');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 hover:border-teal-500/50 text-teal-300 font-bold text-xs rounded-xl transition whitespace-nowrap"
          >
            Find Authorized Agents
          </button>
        </div>

        {/* 5. Smart TV/Console Registration Section */}
        <div className="bg-slate-900 border border-navy-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Tv className="h-5 w-5 text-teal-400" />
            <h3 className="text-base font-bold text-white font-display">Smart TV or Console Registration</h3>
          </div>
          <p className="text-xs text-slate-300 mb-4">
            Smart TVs and gaming consoles don't support standard captive portal login screens. If you want to connect a TV or console, enter your active voucher and the device's MAC address here.
          </p>

          <form onSubmit={handleTvRegistration} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Voucher Code</label>
              <input 
                type="text" 
                placeholder="A1B2C3"
                value={tvVoucher}
                onChange={(e) => setTvVoucher(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-navy-600 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                maxLength={6}
                id="tv-voucher-input"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TV / Console MAC Address</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="AA:BB:CC:DD:EE:FF"
                  value={tvMac}
                  onChange={(e) => setTvMac(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-navy-600 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                  id="tv-mac-input"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-navy-800 font-bold text-xs rounded-xl shadow-md transition"
                  id="tv-register-btn"
                >
                  Register TV
                </button>
              </div>
            </div>
          </form>

          {tvSuccess && (
            <p className="text-xs text-emerald-400 font-medium mt-3">✓ Device successfully registered. Restart your TV's Wi-Fi network to enjoy connection.</p>
          )}
        </div>

        {/* 6. Collapsible FAQ */}
        <div id="faqs-section" className="bg-navy-800 border border-navy-700 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-teal-400" />
            <h3 className="text-base font-bold text-white font-display">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-navy-700 pb-2.5 last:border-0 last:pb-0">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-white hover:text-teal-300 transition py-1"
                >
                  <span>{faq.q}</span>
                  <span className="text-slate-400 text-lg font-mono leading-none">{openFaq === i ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-slate-300 leading-relaxed mt-2 pl-1 italic">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* 7. Support Footer */}
      <footer className="mt-auto bg-navy-900 border-t border-navy-700 py-6 text-xs text-slate-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="font-bold text-white mb-0.5">WIFI ZONE Uganda</p>
            <p className="text-[10px]">Serving Bukedea, Kumi, Mbale, Lira, Gulu, and Arua.</p>
          </div>

          <div className="flex gap-4">
            <a 
              href="https://wa.me/256760208497" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 rounded-lg border border-slate-700 hover:border-emerald-500/40 transition"
            >
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              <span>WhatsApp (+256 760 208497)</span>
            </a>
            <a 
              href="tel:+256200971515" 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-navy-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition"
            >
              <Phone className="h-4 w-4 text-teal-400" />
              <span>Call (+256 200 971515)</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Payment Sheet Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-navy-800 border border-navy-600 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedPackage(null)}
                className="absolute top-4 right-4 p-1 bg-slate-900 hover:bg-slate-950 rounded-full border border-navy-600 text-slate-400 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>

              {paymentStep === 'details' && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-navy-700">
                    <Smartphone className="h-5 w-5 text-teal-400" />
                    <div>
                      <h3 className="text-base font-bold text-white font-display">Complete Online Purchase</h3>
                      <p className="text-[10px] text-slate-400">Uganda Mobile Money Checkout</p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-navy-600 flex justify-between items-baseline">
                    <span className="text-xs text-slate-300">Total Price:</span>
                    <span className="text-xl font-black text-white">{selectedPackage.priceUGX.toLocaleString()} <span className="text-xs text-slate-400">UGX</span></span>
                  </div>

                  {/* Carrier selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Payment Option</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setPaymentCarrier('MTN')}
                        className={`p-2.5 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition ${paymentCarrier === 'MTN' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' : 'bg-slate-900 border-navy-600 text-slate-400 hover:border-navy-500'}`}
                      >
                        <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                        MTN MoMo
                      </button>
                      <button 
                        onClick={() => setPaymentCarrier('Airtel')}
                        className={`p-2.5 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition ${paymentCarrier === 'Airtel' ? 'bg-red-500/10 border-red-500 text-red-400' : 'bg-slate-900 border-navy-600 text-slate-400 hover:border-navy-500'}`}
                      >
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        Airtel Money
                      </button>
                      <button 
                        onClick={() => setPaymentCarrier('Pesapal')}
                        className={`p-2.5 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition ${paymentCarrier === 'Pesapal' ? 'bg-teal-500/10 border-teal-500 text-teal-300' : 'bg-slate-900 border-navy-600 text-slate-400 hover:border-navy-500'}`}
                        id="pesapal-payment-btn"
                      >
                        <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                        Pesapal
                      </button>
                    </div>
                  </div>

                  {paymentCarrier === 'Pesapal' ? (
                    <div className="space-y-3 p-3 bg-slate-900/60 rounded-xl border border-teal-500/20 text-xs">
                      <div className="flex items-center justify-between pb-1.5 border-b border-navy-700">
                        <span className="font-bold text-teal-300">Pesapal Safe Checkout</span>
                        <span className="text-[9px] bg-teal-400 text-slate-950 px-1.5 py-0.5 rounded font-extrabold uppercase">Secured</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          type="button"
                          onClick={() => setPesapalSubMethod('card')}
                          className={`py-1.5 rounded border text-center transition font-bold text-[10px] ${pesapalSubMethod === 'card' ? 'bg-teal-500/15 border-teal-500 text-teal-300' : 'bg-slate-950 border-navy-700 text-slate-400'}`}
                        >
                          Credit / Debit Card
                        </button>
                        <button 
                          type="button"
                          onClick={() => setPesapalSubMethod('wallet')}
                          className={`py-1.5 rounded border text-center transition font-bold text-[10px] ${pesapalSubMethod === 'wallet' ? 'bg-teal-500/15 border-teal-500 text-teal-300' : 'bg-slate-950 border-navy-700 text-slate-400'}`}
                        >
                          Mobile Wallet
                        </button>
                      </div>

                      {pesapalSubMethod === 'card' ? (
                        <div className="space-y-2 mt-2">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Card Number</label>
                            <input 
                              type="text" 
                              placeholder="4111 2222 3333 4444"
                              value={cardNum}
                              onChange={(e) => setCardNum(e.target.value.replace(/\D/g, '').substring(0, 16))}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-navy-600 rounded text-xs text-white focus:outline-none focus:border-teal-400 font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Expiry (MM/YY)</label>
                              <input 
                                type="text" 
                                placeholder="12/28"
                                value={cardExp}
                                onChange={(e) => setCardExp(e.target.value.substring(0, 5))}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-navy-600 rounded text-xs text-white text-center focus:outline-none focus:border-teal-400 font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">CVV</label>
                              <input 
                                type="password" 
                                placeholder="•••"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-navy-600 rounded text-xs text-white text-center focus:outline-none focus:border-teal-400 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5 mt-2">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Mobile Wallet Number (MTN/Airtel)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 0772123456"
                            value={paymentPhone}
                            onChange={(e) => setPaymentPhone(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-950 border border-navy-600 rounded text-xs text-white focus:outline-none focus:border-teal-400 font-mono"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Phone input */
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Money Phone Number</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 0772123456"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-navy-600 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-teal-400"
                        id="portal-payment-phone"
                      />
                      <span className="text-[10px] text-slate-500 italic">Enter the 10-digit number to receive the prompt.</span>
                    </div>
                  )}

                  <button 
                    onClick={handleProcessPayment}
                    className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-navy-800 font-bold text-sm rounded-xl transition flex items-center justify-center gap-1"
                  >
                    Send Payment Request
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {paymentStep === 'ussd' && (
                <div className="p-6 text-center space-y-4 bg-slate-900">
                  <div className="mx-auto h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400 border border-yellow-500/30">
                    <Lock className="h-6 w-6" />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">USSD Security Verification</h3>
                    <p className="text-lg font-black text-white mt-1">Confirm on Phone</p>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2 px-2">
                      We have sent a secure payment push request to <span className="font-mono font-bold text-white">{paymentPhone}</span>. Please verify by typing your Mobile Money PIN.
                    </p>
                  </div>

                  {/* Simulated Mobile Device Frame for Enter PIN */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-w-xs mx-auto text-left space-y-3 font-mono">
                    <div className="text-[11px] text-yellow-500 border-b border-slate-800 pb-1.5">
                      {paymentCarrier === 'MTN' ? 'MTN MoMo API Prompt' : 'Airtel Money API Prompt'}
                    </div>
                    <div className="text-xs text-slate-200">
                      Charge: {selectedPackage.priceUGX.toLocaleString()} UGX for {selectedPackage.name}. Enter MoMo PIN to authorize:
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••"
                      value={ussdPin}
                      onChange={(e) => setUssdPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-center text-white text-lg tracking-widest focus:outline-none"
                      maxLength={5}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedPackage(null)}
                        className="flex-1 py-1 bg-slate-900 text-slate-400 border border-slate-800 rounded text-[10px] text-center"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSubmitUssdPin}
                        className={`flex-1 py-1 font-bold rounded text-[10px] text-center ${getCarrierBg(paymentCarrier)}`}
                      >
                        Send PIN
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {paymentStep === 'processing' && (
                <div className="p-8 text-center space-y-4">
                  <div className="h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div>
                    <h3 className="text-base font-bold text-white">Validating Transaction</h3>
                    <p className="text-xs text-slate-400 mt-1">Polling carrier logs for approval receipt...</p>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">Usually takes 2-3 seconds</p>
                </div>
              )}

              {paymentStep === 'success' && generatedVoucher && (
                <div className="p-6 text-center space-y-5">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <Check className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">Payment Received!</h3>
                    <p className="text-xs text-slate-400">A voucher has been automatically generated for you.</p>
                  </div>

                  {/* Voucher display */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-teal-500/20 shadow-inner relative group">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Your Code (Symmetric Speed {selectedPackage.speed})</p>
                    <p className="text-2xl font-black text-teal-400 font-mono tracking-wider select-all" id="newly-bought-voucher">
                      {generatedVoucher}
                    </p>
                    
                    <button 
                      onClick={() => copyToClipboard(generatedVoucher)}
                      className="absolute top-2.5 right-2.5 p-1 bg-slate-900 hover:bg-slate-950 border border-navy-700 rounded text-slate-400 hover:text-white transition"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        handleConnectVoucher(generatedVoucher);
                        setSelectedPackage(null);
                      }}
                      className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-navy-800 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/10 transition flex items-center justify-center gap-1.5"
                    >
                      <Wifi className="h-4 w-4" />
                      Auto-Connect Current Device
                    </button>
                    
                    <button 
                      onClick={() => setSelectedPackage(null)}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
                    >
                      Close & Keep Code
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
