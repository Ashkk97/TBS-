import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { 
  INITIAL_PACKAGES, 
  INITIAL_SITES, 
  INITIAL_AGENTS, 
  INITIAL_VOUCHERS, 
  INITIAL_SESSIONS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_LOGS,
  INITIAL_AD_TRIAL_CLAIMS,
  INITIAL_SPONSOR_ADS,
  INITIAL_SMART_PLANS
} from "./src/data";

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "data.json");

// Parse JSON request bodies
app.use(express.json());

// Helper to load state from data.json or initialize with seeds
function getDbState() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error reading database file, using defaults:", error);
  }

  // Initial state if file doesn't exist
  const initialState = {
    packages: INITIAL_PACKAGES,
    sites: INITIAL_SITES,
    agents: INITIAL_AGENTS,
    vouchers: INITIAL_VOUCHERS,
    sessions: INITIAL_SESSIONS,
    transactions: INITIAL_TRANSACTIONS,
    logs: INITIAL_LOGS,
    adTrialClaims: INITIAL_AD_TRIAL_CLAIMS,
    sponsorAds: INITIAL_SPONSOR_ADS,
    smartPlans: INITIAL_SMART_PLANS
  };
  saveDbState(initialState);
  return initialState;
}

// Helper to save state to data.json
function saveDbState(state: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database file:", error);
  }
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Fetch full DB state
app.get("/api/state", (req, res) => {
  const dbState = getDbState();
  res.json(dbState);
});

// Save / Overwrite DB state
app.post("/api/state", (req, res) => {
  const newState = req.body;
  if (!newState || typeof newState !== "object") {
    return res.status(400).json({ error: "Invalid state object" });
  }
  saveDbState(newState);
  res.json({ success: true });
});

// Reset database to seeds
app.post("/api/state/reset", (req, res) => {
  const initialState = {
    packages: INITIAL_PACKAGES,
    sites: INITIAL_SITES,
    agents: INITIAL_AGENTS,
    vouchers: INITIAL_VOUCHERS,
    sessions: INITIAL_SESSIONS,
    transactions: INITIAL_TRANSACTIONS,
    logs: INITIAL_LOGS,
    adTrialClaims: INITIAL_AD_TRIAL_CLAIMS,
    sponsorAds: INITIAL_SPONSOR_ADS,
    smartPlans: INITIAL_SMART_PLANS
  };
  saveDbState(initialState);
  res.json(initialState);
});

// Specific API endpoints for potential integrations
app.get("/api/packages", (req, res) => {
  const db = getDbState();
  res.json(db.packages);
});

app.get("/api/sites", (req, res) => {
  const db = getDbState();
  res.json(db.sites);
});

app.get("/api/vouchers", (req, res) => {
  const db = getDbState();
  res.json(db.vouchers);
});

app.post("/api/vouchers/verify", (req, res) => {
  const { code, mac } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Voucher code is required" });
  }

  const db = getDbState();
  const voucherIndex = db.vouchers.findIndex((v: any) => v.code.toUpperCase() === code.trim().toUpperCase());

  if (voucherIndex === -1) {
    return res.status(404).json({ error: "Voucher not found" });
  }

  const voucher = db.vouchers[voucherIndex];

  if (voucher.status === "expired") {
    return res.status(400).json({ error: "Voucher has expired" });
  }

  if (voucher.status === "used") {
    return res.status(400).json({ error: "Voucher has already been fully used" });
  }

  // Update voucher status to active if unused
  if (voucher.status === "unused") {
    voucher.status = "active";
    voucher.activationTime = new Date().toISOString();
    
    // Find package details to calculate expiry
    const pkg = db.packages.find((p: any) => p.id === voucher.packageId);
    const durationHours = pkg ? pkg.durationHours : 24;
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + durationHours);
    voucher.expiryTime = expiryDate.toISOString();
    
    if (mac && !voucher.boundMACs.includes(mac)) {
      voucher.boundMACs.push(mac);
    }

    // Create an active session
    const newSession = {
      id: "sess-" + Math.floor(Math.random() * 900000 + 100000),
      mac: mac || "00:00:00:00:00:00",
      voucherCode: voucher.code,
      speed: pkg ? pkg.speed : "5 Mbps",
      startedAt: voucher.activationTime,
      durationMinutes: durationHours * 60,
      dataUsedMB: 0,
      ipAddress: "10.5.50." + Math.floor(Math.random() * 253 + 2)
    };
    db.sessions.push(newSession);

    // Audit log
    const auditLog = {
      id: "log-" + Date.now(),
      timestamp: new Date().toISOString(),
      actor: "Client (" + (mac || "Unknown MAC") + ")",
      role: "System" as const,
      action: "Voucher Activated",
      details: `Voucher ${voucher.code} successfully activated for package ${pkg ? pkg.name : "Unknown"}.`,
      ip: "10.5.50.45"
    };
    db.logs.unshift(auditLog);

    saveDbState(db);
  }

  res.json({ success: true, voucher });
});

// Setup dev server or static middleware
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Techaus Backend] Server is running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
