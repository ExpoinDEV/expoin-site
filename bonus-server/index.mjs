import 'dotenv/config';
import crypto from 'node:crypto';
import {mkdir, readFile, rename, writeFile} from 'node:fs/promises';
import path from 'node:path';
import express from 'express';
import {
  Contract,
  Interface,
  JsonRpcProvider,
  formatEther,
  formatUnits,
  getAddress,
  isAddress,
  parseUnits,
  verifyMessage,
} from 'ethers';

const PORT = Number(process.env.BONUS_PORT || 3001);
const CHAIN_ID = 56;
const RPC_URL = process.env.BONUS_BSC_RPC_URL || 'https://bsc-dataseed.binance.org/';
const SALE_CONTRACT = getAddress(
  process.env.BONUS_SALE_CONTRACT || '0x4580ce4209023ED68b1dA14A689d51906239b641',
);
const EXN_TOKEN = getAddress(
  process.env.BONUS_EXN_TOKEN || '0xAcc3975ca328FedE659D291168bbEBcfE4b69437',
);
const TREASURY_ADDRESS = getAddress(
  process.env.BONUS_TREASURY_ADDRESS || '0xFE144880F486861F1Eb41E085DB6d1cA780D74CD',
);
const ADMIN_ADDRESSES = new Set(
  (process.env.BONUS_ADMIN_ADDRESSES || TREASURY_ADDRESS)
    .split(',')
    .map((value) => getAddress(value.trim()).toLowerCase()),
);
const DATA_PATH = process.env.BONUS_DATA_PATH || path.resolve('bonus-server/data/bonus-data.json');
function normalizeOrigin(value) {
  try {
    return new URL(String(value).split(',')[0].trim()).origin;
  } catch {
    return '';
  }
}

const ALLOWED_ORIGINS = new Set(
  (process.env.BONUS_ALLOWED_ORIGINS || process.env.BONUS_ALLOWED_ORIGIN || 'https://expoin.net')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean),
);
const PRIMARY_ORIGIN = [...ALLOWED_ORIGINS][0];
const SESSION_COOKIE = 'expoin_bonus_admin';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const NONCE_TTL_MS = 10 * 60 * 1000;
const SECURE_COOKIE = PRIMARY_ORIGIN.startsWith('https://');

const provider = new JsonRpcProvider(RPC_URL, CHAIN_ID, {staticNetwork: true});
const saleInterface = new Interface([
  'event TokensPurchased(address indexed buyer, uint256 indexed roundId, uint256 usdtAmount, uint256 tokenAmount)',
]);
const tokenInterface = new Interface([
  'function transfer(address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
]);
const erc20ReadAbi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

const DEFAULT_BONUS_RULES_VERSION = 1;
const defaultBonusRules = [
  {
    id: 'genius',
    enabled: true,
    assetType: 'erc20',
    watchedTokenAddress: '0x1F12B85aAC097E43Aa1555b2881E98a51090e9A6',
    watchedTokenSymbol: 'GENIUS',
    tokenName: 'Genius',
    minimumBalance: '1',
    bonusMode: 'percent',
    bonusValue: '15',
  },
  {
    id: 'tag',
    enabled: true,
    assetType: 'erc20',
    watchedTokenAddress: '0x208bf3e7da9639f1eaefa2de78c23396b0682025',
    watchedTokenSymbol: 'TAG',
    tokenName: 'Tagger',
    minimumBalance: '1',
    bonusMode: 'percent',
    bonusValue: '10',
  },
  {
    id: 'pieverse',
    enabled: true,
    assetType: 'erc20',
    watchedTokenAddress: '0x0e63b9c287e32a05e6b9ab8ee8df88a2760225a9',
    watchedTokenSymbol: 'PIEVERSE',
    tokenName: 'Pieverse Token',
    minimumBalance: '1',
    bonusMode: 'percent',
    bonusValue: '20',
  },
  {
    id: 'cgpt',
    enabled: true,
    assetType: 'erc20',
    watchedTokenAddress: '0x9840652DC04fb9db2C43853633f0F62BE6f00f98',
    watchedTokenSymbol: 'CGPT',
    tokenName: 'ChainGPT',
    minimumBalance: '1',
    bonusMode: 'percent',
    bonusValue: '30',
  },
  {
    id: 'aitech',
    enabled: true,
    assetType: 'erc20',
    watchedTokenAddress: '0x2d060ef4d6bf7f9e5edde373ab735513c0e4f944',
    watchedTokenSymbol: 'AITECH',
    tokenName: 'AITECH',
    minimumBalance: '1',
    bonusMode: 'percent',
    bonusValue: '15',
  },
  {
    id: 'gtai',
    enabled: true,
    assetType: 'erc20',
    watchedTokenAddress: '0x003d87d02a2a01e9e8a20f507c83e15dd83a33d1',
    watchedTokenSymbol: 'GTAI',
    tokenName: 'GT Protocol',
    minimumBalance: '1',
    bonusMode: 'percent',
    bonusValue: '15',
  },
  {
    id: 'the',
    enabled: true,
    assetType: 'erc20',
    watchedTokenAddress: '0xf4c8e32eadec4bfe97e0f595add0f4450a863a11',
    watchedTokenSymbol: 'THE',
    tokenName: 'THENA',
    minimumBalance: '1',
    bonusMode: 'percent',
    bonusValue: '30',
  },
  {
    id: 'apx',
    enabled: true,
    assetType: 'erc20',
    watchedTokenAddress: '0x78f5d389f5cdccfc41594abab4b0ed02f31398b3',
    watchedTokenSymbol: 'APX',
    tokenName: 'ApolloX Token',
    minimumBalance: '1',
    bonusMode: 'percent',
    bonusValue: '15',
  },
  {
    id: 'kilo',
    enabled: true,
    assetType: 'erc20',
    watchedTokenAddress: '0x503fa24b7972677f00c4618e5fbe237780c1df53',
    watchedTokenSymbol: 'KILO',
    tokenName: 'KiloEx Token',
    minimumBalance: '1',
    bonusMode: 'percent',
    bonusValue: '20',
  },
].map((rule) => ({
  ...rule,
  watchedTokenAddress: getAddress(rule.watchedTokenAddress),
}));

const defaultData = {
  settings: {
    enabled: false,
    strategy: 'best',
    defaultBonusRulesVersion: DEFAULT_BONUS_RULES_VERSION,
    bonusRules: defaultBonusRules,
    updatedAt: new Date().toISOString(),
    updatedBy: TREASURY_ADDRESS,
  },
  claims: [],
  audit: [],
};

const nonces = new Map();
const sessions = new Map();
let mutationQueue = Promise.resolve();

async function ensureStore() {
  await mkdir(path.dirname(DATA_PATH), {recursive: true});
  try {
    await readFile(DATA_PATH, 'utf8');
  } catch {
    await writeFile(DATA_PATH, JSON.stringify(defaultData, null, 2), {mode: 0o600});
  }
}

async function readStore() {
  await ensureStore();
  const data = JSON.parse(await readFile(DATA_PATH, 'utf8'));
  data.settings = normalizeSettings(data.settings);
  data.claims = Array.isArray(data.claims) ? data.claims : [];
  data.audit = Array.isArray(data.audit) ? data.audit : [];
  return data;
}

async function mutateStore(mutator) {
  const operation = mutationQueue.then(async () => {
    const data = await readStore();
    const result = await mutator(data);
    const tempPath = `${DATA_PATH}.${process.pid}.tmp`;
    await writeFile(tempPath, JSON.stringify(data, null, 2), {mode: 0o600});
    await rename(tempPath, DATA_PATH);
    return result;
  });
  mutationQueue = operation.catch(() => undefined);
  return operation;
}

function parseCookies(header = '') {
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separator = part.indexOf('=');
        return separator === -1
          ? [part, '']
          : [part.slice(0, separator), decodeURIComponent(part.slice(separator + 1))];
      }),
  );
}

function buildSignInMessage({address, nonce, issuedAt, expiresAt, domain, uri}) {
  return `${domain} wants you to sign in with your Ethereum account:
${address}

Sign in to the Expoin Bonus Admin.

URI: ${uri}
Version: 1
Chain ID: ${CHAIN_ID}
Nonce: ${nonce}
Issued At: ${issuedAt}
Expiration Time: ${expiresAt}`;
}

function decimalIsPositive(value) {
  return typeof value === 'string'
    && /^\d+(\.\d+)?$/.test(value)
    && Number.isFinite(Number(value))
    && Number(value) > 0;
}

function hasAtMostDecimals(value, maximumDecimals) {
  const fraction = String(value).split('.')[1] || '';
  return fraction.length <= maximumDecimals;
}

function ruleKey(rule) {
  return rule.assetType === 'native'
    ? 'native'
    : getAddress(rule.watchedTokenAddress).toLowerCase();
}

function normalizeBonusRule(input, index = 0) {
  const assetType = input.assetType === 'native' ? 'native' : 'erc20';
  const watchedTokenAddress = assetType === 'erc20' && isAddress(input.watchedTokenAddress || '')
    ? getAddress(input.watchedTokenAddress)
    : '';
  const watchedTokenSymbol = assetType === 'native'
    ? 'BNB'
    : String(input.watchedTokenSymbol || input.symbol || 'TOKEN').trim().slice(0, 16) || 'TOKEN';

  return {
    id: String(input.id || `${assetType}-${watchedTokenSymbol}-${index}`).trim().slice(0, 64),
    enabled: input.enabled !== false,
    assetType,
    watchedTokenAddress,
    watchedTokenSymbol,
    tokenName: String(input.tokenName || input.name || '').trim().slice(0, 80),
    minimumBalance: String(input.minimumBalance || '1'),
    bonusMode: input.bonusMode === 'fixed' ? 'fixed' : 'percent',
    bonusValue: String(input.bonusValue || '0'),
  };
}

function legacyRuleFromSettings(settings) {
  if (!settings || !settings.assetType) return null;
  if (settings.assetType === 'erc20' && !isAddress(settings.watchedTokenAddress || '')) return null;

  return normalizeBonusRule({
    id: settings.assetType === 'native'
      ? 'legacy-bnb'
      : `legacy-${String(settings.watchedTokenSymbol || 'token').toLowerCase()}`,
    enabled: true,
    assetType: settings.assetType,
    watchedTokenAddress: settings.watchedTokenAddress || '',
    watchedTokenSymbol: settings.watchedTokenSymbol || (settings.assetType === 'native' ? 'BNB' : 'TOKEN'),
    minimumBalance: settings.minimumBalance || '1',
    bonusMode: settings.bonusMode || 'percent',
    bonusValue: settings.bonusValue || '0',
  });
}

function normalizeSettings(settings = {}) {
  const hasModernRules = Array.isArray(settings.bonusRules);
  const shouldSeedDefaultRules = settings.defaultBonusRulesVersion !== DEFAULT_BONUS_RULES_VERSION;
  const legacyRule = hasModernRules || shouldSeedDefaultRules ? null : legacyRuleFromSettings(settings);
  const rules = hasModernRules
    ? settings.bonusRules.map((rule, index) => normalizeBonusRule(rule, index))
    : [legacyRule].filter(Boolean);

  if (shouldSeedDefaultRules) {
    const existingKeys = new Set(rules.filter((rule) => rule.assetType === 'native' || rule.watchedTokenAddress).map(ruleKey));
    for (const defaultRule of defaultBonusRules) {
      if (!existingKeys.has(ruleKey(defaultRule))) {
        rules.push(normalizeBonusRule(defaultRule, rules.length));
      }
    }
  }

  if (!rules.length) {
    rules.push(...defaultBonusRules.map((rule, index) => normalizeBonusRule(rule, index)));
  }

  const firstRule = rules[0] || normalizeBonusRule(defaultBonusRules[0]);
  return {
    enabled: Boolean(settings.enabled),
    strategy: settings.strategy === 'first' ? 'first' : 'best',
    defaultBonusRulesVersion: settings.defaultBonusRulesVersion || 0,
    bonusRules: rules,
    updatedAt: settings.updatedAt || new Date().toISOString(),
    updatedBy: settings.updatedBy || TREASURY_ADDRESS,
    // Legacy fields remain for old frontend builds and old stored claims.
    assetType: firstRule.assetType,
    watchedTokenAddress: firstRule.watchedTokenAddress,
    watchedTokenSymbol: firstRule.watchedTokenSymbol,
    minimumBalance: firstRule.minimumBalance,
    bonusMode: firstRule.bonusMode,
    bonusValue: firstRule.bonusValue,
  };
}

function validateBonusRule(rule, index) {
  if (!['native', 'erc20'].includes(rule.assetType)) {
    return `Rule ${index + 1}: assetType must be native or erc20`;
  }
  if (rule.assetType === 'erc20' && !isAddress(rule.watchedTokenAddress || '')) {
    return `Rule ${index + 1}: valid BEP-20 contract address required`;
  }
  if (!decimalIsPositive(rule.minimumBalance)) {
    return `Rule ${index + 1}: minimum balance must be greater than zero`;
  }
  if (!['percent', 'fixed'].includes(rule.bonusMode)) {
    return `Rule ${index + 1}: bonusMode must be percent or fixed`;
  }
  if (!decimalIsPositive(rule.bonusValue)) {
    return `Rule ${index + 1}: bonus value must be greater than zero`;
  }
  if (rule.bonusMode === 'percent' && Number(rule.bonusValue) > 100) {
    return `Rule ${index + 1}: percentage bonus cannot exceed 100%`;
  }
  if (rule.bonusMode === 'percent' && !hasAtMostDecimals(rule.bonusValue, 2)) {
    return `Rule ${index + 1}: percentage bonus supports up to two decimal places`;
  }
  return null;
}

function cleanSessions() {
  const now = Date.now();
  for (const [key, value] of sessions.entries()) {
    if (value.expiresAt <= now) sessions.delete(key);
  }
  for (const [key, value] of nonces.entries()) {
    if (value.expiresAt <= now) nonces.delete(key);
  }
}

function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function requireOrigin(req, res, next) {
  const origin = normalizeOrigin(req.get('origin'));
  if (origin && !ALLOWED_ORIGINS.has(origin) && !origin.startsWith('http://localhost:')) {
    return res.status(403).json({error: 'Invalid request origin'});
  }
  next();
}

function requireAdmin(req, res, next) {
  cleanSessions();
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  const session = token ? sessions.get(token) : null;
  if (!session || session.expiresAt <= Date.now()) {
    return res.status(401).json({error: 'Admin authentication required'});
  }
  req.adminAddress = session.address;
  next();
}

function publicSettings(settings) {
  const normalized = normalizeSettings(settings);
  const firstRule = normalized.bonusRules[0];
  return {
    enabled: normalized.enabled,
    strategy: normalized.strategy,
    defaultBonusRulesVersion: normalized.defaultBonusRulesVersion,
    bonusRules: normalized.bonusRules,
    updatedAt: normalized.updatedAt,
    assetType: firstRule.assetType,
    watchedTokenAddress: firstRule.watchedTokenAddress,
    watchedTokenSymbol: firstRule.watchedTokenSymbol,
    minimumBalance: firstRule.minimumBalance,
    bonusMode: firstRule.bonusMode,
    bonusValue: firstRule.bonusValue,
  };
}

async function readAssetBalance(rule, wallet, blockTag = 'latest') {
  if (rule.assetType === 'native') {
    return {
      raw: await provider.getBalance(wallet, blockTag),
      decimals: 18,
      symbol: 'BNB',
    };
  }

  const tokenAddress = getAddress(rule.watchedTokenAddress);
  const token = new Contract(tokenAddress, erc20ReadAbi, provider);
  const [raw, decimals, symbol] = await Promise.all([
    token.balanceOf(wallet, {blockTag}),
    token.decimals(),
    token.symbol().catch(() => rule.watchedTokenSymbol || 'TOKEN'),
  ]);
  return {raw, decimals: Number(decimals), symbol};
}

async function calculateEligibility(settings, wallet, blockTag = 'latest') {
  const normalized = normalizeSettings(settings);
  const checks = await Promise.all(normalized.bonusRules.map(async (rule) => {
    const balance = await readAssetBalance(rule, wallet, blockTag);
    const minimumRaw = parseUnits(rule.minimumBalance, balance.decimals);
    const eligible = normalized.enabled && rule.enabled && balance.raw >= minimumRaw;
    return {
      ...rule,
      ruleId: rule.id,
      eligible,
      balanceRaw: balance.raw.toString(),
      balanceFormatted: formatUnits(balance.raw, balance.decimals),
      decimals: balance.decimals,
      symbol: balance.symbol || rule.watchedTokenSymbol,
      minimumRaw: minimumRaw.toString(),
    };
  }));
  const matchedRule = checks
    .filter((rule) => rule.eligible)
    .sort((left, right) => Number(right.bonusValue) - Number(left.bonusValue))[0] || null;
  const displayRule = matchedRule || checks[0] || null;

  return {
    eligible: Boolean(matchedRule),
    matchedRule,
    checkedRules: checks,
    balanceRaw: displayRule?.balanceRaw || '0',
    balanceFormatted: displayRule?.balanceFormatted || '0',
    decimals: displayRule?.decimals || 18,
    symbol: displayRule?.symbol || 'TOKEN',
    minimumRaw: displayRule?.minimumRaw || '0',
  };
}

async function calculateBonus(settings, eligibility, baseTokenRaw) {
  const exnToken = new Contract(EXN_TOKEN, erc20ReadAbi, provider);
  const exnDecimals = Number(await exnToken.decimals());
  const rule = eligibility?.matchedRule || normalizeSettings(settings).bonusRules[0];

  if (rule.bonusMode === 'fixed') {
    return {
      bonusRaw: parseUnits(rule.bonusValue, exnDecimals),
      exnDecimals,
    };
  }

  const basisPoints = parseUnits(rule.bonusValue, 2);
  return {
    bonusRaw: baseTokenRaw * basisPoints / 10000n,
    exnDecimals,
  };
}

function findPurchaseEvent(receipt) {
  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== SALE_CONTRACT.toLowerCase()) continue;
    try {
      const parsed = saleInterface.parseLog(log);
      if (parsed?.name === 'TokensPurchased') return parsed;
    } catch {
      // Ignore unrelated logs emitted by the sale transaction.
    }
  }
  return null;
}

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({limit: '256kb'}));
app.use('/api/bonus', requireOrigin);

app.get('/api/bonus/health', (_req, res) => {
  res.json({ok: true, chainId: CHAIN_ID, treasury: TREASURY_ADDRESS});
});

app.get('/api/bonus/public/settings', asyncRoute(async (_req, res) => {
  const data = await readStore();
  res.json(publicSettings(data.settings));
}));

app.post('/api/bonus/public/check', asyncRoute(async (req, res) => {
  if (!isAddress(req.body?.wallet || '')) {
    return res.status(400).json({error: 'Valid wallet address required'});
  }
  const data = await readStore();
  const result = await calculateEligibility(data.settings, getAddress(req.body.wallet));
  res.json({...result, settings: publicSettings(data.settings)});
}));

app.post('/api/bonus/auth/nonce', (req, res) => {
  cleanSessions();
  if (!isAddress(req.body?.address || '')) {
    return res.status(400).json({error: 'Valid wallet address required'});
  }

  const address = getAddress(req.body.address);
  const nonce = crypto.randomBytes(16).toString('hex');
  const issuedAt = new Date().toISOString();
  const expiresAtDate = new Date(Date.now() + NONCE_TTL_MS);
  const requestOrigin = normalizeOrigin(req.get('origin'));
  const signInOrigin = requestOrigin && ALLOWED_ORIGINS.has(requestOrigin)
    ? requestOrigin
    : PRIMARY_ORIGIN;
  const domain = new URL(signInOrigin).host;
  const message = buildSignInMessage({
    address,
    nonce,
    issuedAt,
    expiresAt: expiresAtDate.toISOString(),
    domain,
    uri: `${signInOrigin}/bonus-admin/`,
  });

  nonces.set(address.toLowerCase(), {
    nonce,
    message,
    expiresAt: expiresAtDate.getTime(),
  });
  res.json({message, expiresAt: expiresAtDate.toISOString()});
});

app.post('/api/bonus/auth/verify', asyncRoute(async (req, res) => {
  cleanSessions();
  const {address: rawAddress, signature} = req.body || {};
  if (!isAddress(rawAddress || '') || typeof signature !== 'string') {
    return res.status(400).json({error: 'Address and signature required'});
  }

  const address = getAddress(rawAddress);
  const challenge = nonces.get(address.toLowerCase());
  if (!challenge || challenge.expiresAt <= Date.now()) {
    return res.status(401).json({error: 'Sign-in challenge expired'});
  }

  let recovered;
  try {
    recovered = getAddress(verifyMessage(challenge.message, signature));
  } catch {
    return res.status(401).json({error: 'Invalid wallet signature'});
  }
  if (recovered.toLowerCase() !== address.toLowerCase()) {
    return res.status(401).json({error: 'Invalid wallet signature'});
  }
  if (!ADMIN_ADDRESSES.has(address.toLowerCase())) {
    return res.status(403).json({error: 'Wallet is not authorized'});
  }

  nonces.delete(address.toLowerCase());
  const sessionToken = crypto.randomBytes(32).toString('hex');
  sessions.set(sessionToken, {
    address,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${sessionToken}; Path=/api/bonus; HttpOnly; ${SECURE_COOKIE ? 'Secure; ' : ''}SameSite=Strict; Max-Age=${SESSION_TTL_MS / 1000}`,
  );
  res.json({authenticated: true, address, treasury: TREASURY_ADDRESS});
}));

app.post('/api/bonus/auth/logout', (_req, res) => {
  const token = parseCookies(_req.headers.cookie)[SESSION_COOKIE];
  if (token) sessions.delete(token);
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; Path=/api/bonus; HttpOnly; ${SECURE_COOKIE ? 'Secure; ' : ''}SameSite=Strict; Max-Age=0`,
  );
  res.json({ok: true});
});

app.get('/api/bonus/admin/me', requireAdmin, (req, res) => {
  res.json({authenticated: true, address: req.adminAddress, treasury: TREASURY_ADDRESS});
});

app.get('/api/bonus/admin/dashboard', requireAdmin, asyncRoute(async (_req, res) => {
  const data = await readStore();
  const exn = new Contract(EXN_TOKEN, erc20ReadAbi, provider);
  const [treasuryBnb, treasuryExn, exnDecimals] = await Promise.all([
    provider.getBalance(TREASURY_ADDRESS),
    exn.balanceOf(TREASURY_ADDRESS),
    exn.decimals(),
  ]);
  res.json({
    settings: data.settings,
    claims: data.claims.slice().reverse(),
    balances: {
      bnb: formatEther(treasuryBnb),
      exn: formatUnits(treasuryExn, Number(exnDecimals)),
    },
    contracts: {
      treasury: TREASURY_ADDRESS,
      exnToken: EXN_TOKEN,
      saleContract: SALE_CONTRACT,
    },
  });
}));

app.put('/api/bonus/admin/settings', requireAdmin, asyncRoute(async (req, res) => {
  const input = req.body || {};
  const submittedRules = Array.isArray(input.bonusRules)
    ? input.bonusRules
    : [legacyRuleFromSettings(input)].filter(Boolean);

  if (!submittedRules.length || submittedRules.length > 50) {
    return res.status(400).json({error: 'Submit between 1 and 50 bonus rules'});
  }

  const normalizedRules = submittedRules.map((rule, index) => normalizeBonusRule(rule, index));
  const duplicateKeys = new Set();
  for (let index = 0; index < normalizedRules.length; index += 1) {
    const error = validateBonusRule(normalizedRules[index], index);
    if (error) return res.status(400).json({error});
    const key = ruleKey(normalizedRules[index]);
    if (duplicateKeys.has(key)) {
      return res.status(400).json({error: `Rule ${index + 1}: duplicate bonus asset`});
    }
    duplicateKeys.add(key);
  }

  const settings = await mutateStore((data) => {
    const firstRule = normalizedRules[0];
    const nextSettings = {
      enabled: Boolean(input.enabled),
      strategy: input.strategy === 'first' ? 'first' : 'best',
      defaultBonusRulesVersion: DEFAULT_BONUS_RULES_VERSION,
      bonusRules: normalizedRules,
      updatedAt: new Date().toISOString(),
      updatedBy: req.adminAddress,
      assetType: firstRule.assetType,
      watchedTokenAddress: firstRule.watchedTokenAddress,
      watchedTokenSymbol: firstRule.watchedTokenSymbol,
      minimumBalance: firstRule.minimumBalance,
      bonusMode: firstRule.bonusMode,
      bonusValue: firstRule.bonusValue,
    };
    data.settings = nextSettings;
    data.audit.push({
      id: crypto.randomUUID(),
      action: 'settings_updated',
      admin: req.adminAddress,
      at: new Date().toISOString(),
      details: nextSettings,
    });
    return nextSettings;
  });
  res.json(publicSettings(settings));
}));

app.post('/api/bonus/public/claims', asyncRoute(async (req, res) => {
  const txHash = String(req.body?.txHash || '').toLowerCase();
  if (!/^0x[a-f0-9]{64}$/.test(txHash)) {
    return res.status(400).json({error: 'Valid purchase transaction hash required'});
  }

  const existingData = await readStore();
  const existing = existingData.claims.find((claim) => claim.purchaseTxHash === txHash);
  if (existing) return res.json(existing);

  const [receipt, transaction] = await Promise.all([
    provider.getTransactionReceipt(txHash),
    provider.getTransaction(txHash),
  ]);
  if (!receipt || !transaction) {
    return res.status(404).json({error: 'Purchase transaction not found'});
  }
  if (receipt.status !== 1) {
    return res.status(400).json({error: 'Purchase transaction failed'});
  }
  if (!transaction.to || transaction.to.toLowerCase() !== SALE_CONTRACT.toLowerCase()) {
    return res.status(400).json({error: 'Transaction is not an Expoin sale purchase'});
  }

  const purchase = findPurchaseEvent(receipt);
  if (!purchase) {
    return res.status(400).json({error: 'TokensPurchased event not found'});
  }

  const buyer = getAddress(purchase.args.buyer);
  const baseTokenRaw = BigInt(purchase.args.tokenAmount.toString());
  const settings = existingData.settings;
  const eligibilityBlock = Math.max(0, receipt.blockNumber - 1);
  const eligibility = await calculateEligibility(settings, buyer, eligibilityBlock);
  const {bonusRaw, exnDecimals} = await calculateBonus(settings, eligibility, baseTokenRaw);
  const status = eligibility.eligible && bonusRaw > 0n ? 'eligible' : 'ineligible';

  const claim = await mutateStore((data) => {
    const duplicate = data.claims.find((item) => item.purchaseTxHash === txHash);
    if (duplicate) return duplicate;

    const nextClaim = {
      id: crypto.randomUUID(),
      purchaseTxHash: txHash,
      purchaseBlock: receipt.blockNumber,
      buyer,
      roundId: purchase.args.roundId.toString(),
      usdtAmountRaw: purchase.args.usdtAmount.toString(),
      baseTokenRaw: baseTokenRaw.toString(),
      baseTokenFormatted: formatUnits(baseTokenRaw, exnDecimals),
      bonusRaw: eligibility.eligible ? bonusRaw.toString() : '0',
      bonusFormatted: eligibility.eligible ? formatUnits(bonusRaw, exnDecimals) : '0',
      exnDecimals,
      eligibility,
      ruleSnapshot: {
        ...publicSettings(settings),
        matchedRule: eligibility.matchedRule,
      },
      status,
      bonusTxHash: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.claims.push(nextClaim);
    data.audit.push({
      id: crypto.randomUUID(),
      action: 'claim_registered',
      at: new Date().toISOString(),
      details: {claimId: nextClaim.id, purchaseTxHash: txHash, status},
    });
    return nextClaim;
  });

  res.status(201).json(claim);
}));

app.post('/api/bonus/admin/claims/:id/prepare', requireAdmin, asyncRoute(async (req, res) => {
  const data = await readStore();
  const claim = data.claims.find((item) => item.id === req.params.id);
  if (!claim) return res.status(404).json({error: 'Claim not found'});
  if (!['eligible', 'payout_failed', 'awaiting_signature'].includes(claim.status)) {
    return res.status(400).json({error: `Claim cannot be paid from status ${claim.status}`});
  }

  const exn = new Contract(EXN_TOKEN, erc20ReadAbi, provider);
  const treasuryBalance = await exn.balanceOf(TREASURY_ADDRESS);
  if (treasuryBalance < BigInt(claim.bonusRaw)) {
    return res.status(400).json({error: 'Treasury EXN balance is insufficient'});
  }

  await mutateStore((store) => {
    const storedClaim = store.claims.find((item) => item.id === claim.id);
    storedClaim.status = 'awaiting_signature';
    storedClaim.updatedAt = new Date().toISOString();
  });

  res.json({
    claimId: claim.id,
    chainId: `0x${CHAIN_ID.toString(16)}`,
    from: TREASURY_ADDRESS,
    to: EXN_TOKEN,
    data: tokenInterface.encodeFunctionData('transfer', [claim.buyer, BigInt(claim.bonusRaw)]),
    value: '0x0',
    buyer: claim.buyer,
    bonusFormatted: claim.bonusFormatted,
  });
}));

app.post('/api/bonus/admin/claims/:id/confirm', requireAdmin, asyncRoute(async (req, res) => {
  const txHash = String(req.body?.txHash || '').toLowerCase();
  if (!/^0x[a-f0-9]{64}$/.test(txHash)) {
    return res.status(400).json({error: 'Valid payout transaction hash required'});
  }

  const data = await readStore();
  const claim = data.claims.find((item) => item.id === req.params.id);
  if (!claim) return res.status(404).json({error: 'Claim not found'});
  if (claim.status === 'paid') return res.json(claim);

  const [receipt, transaction] = await Promise.all([
    provider.getTransactionReceipt(txHash),
    provider.getTransaction(txHash),
  ]);
  if (!receipt || !transaction) {
    return res.status(404).json({error: 'Payout transaction not found'});
  }
  if (
    receipt.status !== 1
    || transaction.from.toLowerCase() !== TREASURY_ADDRESS.toLowerCase()
    || transaction.to?.toLowerCase() !== EXN_TOKEN.toLowerCase()
  ) {
    return res.status(400).json({error: 'Payout transaction does not match treasury transfer'});
  }

  const validTransfer = receipt.logs.some((log) => {
    if (log.address.toLowerCase() !== EXN_TOKEN.toLowerCase()) return false;
    try {
      const parsed = tokenInterface.parseLog(log);
      return parsed?.name === 'Transfer'
        && getAddress(parsed.args.from).toLowerCase() === TREASURY_ADDRESS.toLowerCase()
        && getAddress(parsed.args.to).toLowerCase() === claim.buyer.toLowerCase()
        && BigInt(parsed.args.value.toString()) === BigInt(claim.bonusRaw);
    } catch {
      return false;
    }
  });
  if (!validTransfer) {
    return res.status(400).json({error: 'Expected EXN Transfer event not found'});
  }

  const updated = await mutateStore((store) => {
    const storedClaim = store.claims.find((item) => item.id === claim.id);
    storedClaim.status = 'paid';
    storedClaim.bonusTxHash = txHash;
    storedClaim.updatedAt = new Date().toISOString();
    store.audit.push({
      id: crypto.randomUUID(),
      action: 'bonus_paid',
      admin: req.adminAddress,
      at: new Date().toISOString(),
      details: {claimId: claim.id, txHash},
    });
    return storedClaim;
  });
  res.json(updated);
}));

app.post('/api/bonus/admin/claims/:id/reset', requireAdmin, asyncRoute(async (req, res) => {
  const updated = await mutateStore((data) => {
    const claim = data.claims.find((item) => item.id === req.params.id);
    if (!claim) return null;
    if (claim.status === 'paid') throw new Error('Paid claim cannot be reset');
    claim.status = claim.eligibility.eligible ? 'eligible' : 'ineligible';
    claim.updatedAt = new Date().toISOString();
    return claim;
  });
  if (!updated) return res.status(404).json({error: 'Claim not found'});
  res.json(updated);
}));

app.use((error, _req, res, _next) => {
  console.error('[bonus-api]', error);
  res.status(500).json({error: error?.shortMessage || error?.message || 'Internal server error'});
});

await ensureStore();
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Expoin bonus API listening on http://127.0.0.1:${PORT}`);
});
