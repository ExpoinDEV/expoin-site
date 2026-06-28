import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  LogIn,
  LogOut,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  Wallet,
} from 'lucide-react';
import {usePageMetadata} from '../hooks/usePageMetadata';
import {
  type BonusClaim,
  type BonusDashboard,
  type BonusRule,
  type BonusSettings,
  confirmBonusPayout,
  getAdminSession,
  getBonusDashboard,
  logoutAdmin,
  prepareBonusPayout,
  requestAdminNonce,
  resetBonusClaim,
  updateBonusSettings,
  verifyAdminSignature,
} from '../lib/bonusApi';

const BSC_CHAIN_ID = 56;
const AUTHORIZED_ADMIN_ADDRESS = '0xFE144880F486861F1Eb41E085DB6d1cA780D74CD';

type AdminWalletProvider = {
  request: (args: {method: string; params?: unknown[]}) => Promise<any>;
};

function getWalletProvider() {
  return window.ethereum as AdminWalletProvider | undefined;
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatAmount(value: string, digits = 4) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return value;
  return amount.toLocaleString('en-US', {maximumFractionDigits: digits});
}

function statusLabel(status: BonusClaim['status']) {
  switch (status) {
    case 'eligible':
      return 'Ready';
    case 'ineligible':
      return 'Not eligible';
    case 'awaiting_signature':
      return 'Awaiting signature';
    case 'paid':
      return 'Paid';
    case 'payout_failed':
      return 'Failed';
  }
}

function createEmptyRule(): BonusRule {
  return {
    id: `custom-${Date.now()}`,
    enabled: true,
    assetType: 'erc20',
    watchedTokenAddress: '',
    watchedTokenSymbol: 'TOKEN',
    tokenName: '',
    minimumBalance: '1',
    bonusMode: 'percent',
    bonusValue: '10',
  };
}

function claimHolding(claim: BonusClaim) {
  const matchedRule = claim.eligibility.matchedRule;
  return {
    balance: matchedRule?.balanceFormatted || claim.eligibility.balanceFormatted,
    symbol: matchedRule?.symbol || claim.eligibility.symbol,
    minimum: matchedRule?.minimumBalance || claim.ruleSnapshot?.matchedRule?.minimumBalance || claim.ruleSnapshot.minimumBalance,
    bonusValue: matchedRule?.bonusValue || claim.ruleSnapshot?.matchedRule?.bonusValue || claim.ruleSnapshot.bonusValue,
  };
}

async function ensureBsc(provider: AdminWalletProvider) {
  const chainId = await provider.request({method: 'eth_chainId'});
  if (Number(chainId) === BSC_CHAIN_ID) return;
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{chainId: `0x${BSC_CHAIN_ID.toString(16)}`}],
  });
}

export default function BonusAdminPage() {
  usePageMetadata({
    title: 'Bonus Admin | Expoin',
    description: 'Expoin treasury bonus administration.',
    path: '/bonus-admin/',
  });

  const [adminAddress, setAdminAddress] = useState('');
  const [dashboard, setDashboard] = useState<BonusDashboard | null>(null);
  const [settings, setSettings] = useState<BonusSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.content = 'noindex, nofollow, noarchive';
    return () => robots?.remove();
  }, []);

  async function loadDashboard() {
    const data = await getBonusDashboard();
    setDashboard(data);
    setSettings(data.settings);
  }

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const session = await getAdminSession();
        setAdminAddress(session.address);
        await loadDashboard();
      } catch {
        setAdminAddress('');
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  async function login() {
    setError('');
    setMessage('');
    const walletProvider = getWalletProvider();
    if (!walletProvider) {
      setError('MetaMask is required to access the bonus admin.');
      return;
    }

    try {
      setAction('login');
      try {
        await walletProvider.request({
          method: 'wallet_requestPermissions',
          params: [{eth_accounts: {}}],
        });
      } catch (permissionError: any) {
        if (permissionError?.code === 4001) {
          throw new Error('Account selection was cancelled.');
        }
        // Some injected wallets do not support wallet_requestPermissions.
      }
      const accounts = await walletProvider.request({method: 'eth_requestAccounts'});
      if (!accounts?.length) {
        throw new Error('MetaMask did not return a connected account.');
      }
      const address = ethers.getAddress(accounts[0]);
      if (address.toLowerCase() !== AUTHORIZED_ADMIN_ADDRESS.toLowerCase()) {
        throw new Error(
          `Selected wallet ${shortAddress(address)} is not authorized. Select treasury ${shortAddress(AUTHORIZED_ADMIN_ADDRESS)} in MetaMask.`,
        );
      }
      const challenge = await requestAdminNonce(address);
      const browserProvider = new ethers.BrowserProvider(walletProvider as any);
      const signer = await browserProvider.getSigner(address);
      const signature = await signer.signMessage(challenge.message);
      const session = await verifyAdminSignature(address, signature);
      setAdminAddress(session.address);
      await loadDashboard();
      setMessage('Admin wallet authenticated.');
    } catch (loginError: any) {
      setError(loginError?.message || 'Wallet authentication failed.');
    } finally {
      setAction('');
      setLoading(false);
    }
  }

  async function logout() {
    await logoutAdmin().catch(() => undefined);
    setAdminAddress('');
    setDashboard(null);
    setSettings(null);
  }

  async function saveSettings() {
    if (!settings) return;
    try {
      setAction('save');
      setError('');
      const updated = await updateBonusSettings(settings);
      setSettings(updated);
      setDashboard((current) => current ? {...current, settings: updated} : current);
      setMessage('Bonus settings saved.');
    } catch (saveError: any) {
      setError(saveError?.message || 'Could not save settings.');
    } finally {
      setAction('');
    }
  }

  function updateRule(ruleId: string, patch: Partial<BonusRule>) {
    if (!settings) return;
    setSettings({
      ...settings,
      bonusRules: (settings.bonusRules || []).map((rule) => (
        rule.id === ruleId ? {...rule, ...patch} : rule
      )),
    });
  }

  function addRule() {
    if (!settings) return;
    setSettings({
      ...settings,
      bonusRules: [...(settings.bonusRules || []), createEmptyRule()],
    });
  }

  function removeRule(ruleId: string) {
    if (!settings) return;
    setSettings({
      ...settings,
      bonusRules: (settings.bonusRules || []).filter((rule) => rule.id !== ruleId),
    });
  }

  async function refresh() {
    try {
      setAction('refresh');
      setError('');
      await loadDashboard();
    } catch (refreshError: any) {
      setError(refreshError?.message || 'Could not refresh dashboard.');
    } finally {
      setAction('');
    }
  }

  async function payClaim(claim: BonusClaim) {
    const walletProvider = getWalletProvider();
    if (!walletProvider) {
      setError('MetaMask is required to send the bonus.');
      return;
    }

    try {
      setAction(`pay:${claim.id}`);
      setError('');
      setMessage('');
      await ensureBsc(walletProvider);
      const accounts = await walletProvider.request({method: 'eth_requestAccounts'});
      const connected = ethers.getAddress(accounts[0]);
      if (connected.toLowerCase() !== dashboard?.contracts.treasury.toLowerCase()) {
        throw new Error(`Connect treasury wallet ${dashboard?.contracts.treasury}`);
      }

      const prepared = await prepareBonusPayout(claim.id);
      const browserProvider = new ethers.BrowserProvider(walletProvider as any);
      const signer = await browserProvider.getSigner();
      const transaction = await signer.sendTransaction({
        to: prepared.to,
        data: prepared.data,
        value: 0,
      });
      setMessage(`Bonus transaction submitted: ${shortAddress(transaction.hash)}`);
      await transaction.wait();
      await confirmBonusPayout(claim.id, transaction.hash);
      await loadDashboard();
      setMessage(`Paid ${prepared.bonusFormatted} EXN to ${shortAddress(prepared.buyer)}.`);
    } catch (paymentError: any) {
      setError(paymentError?.shortMessage || paymentError?.message || 'Bonus payout failed.');
    } finally {
      setAction('');
    }
  }

  async function resetClaim(claim: BonusClaim) {
    try {
      setAction(`reset:${claim.id}`);
      await resetBonusClaim(claim.id);
      await loadDashboard();
    } catch (resetError: any) {
      setError(resetError?.message || 'Could not reset claim.');
    } finally {
      setAction('');
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070a0d] text-white">
        <Loader2 className="h-7 w-7 animate-spin text-[#38BDF8]" />
      </div>
    );
  }

  if (!adminAddress || !dashboard || !settings) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070a0d] px-5 text-white">
        <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#0d1116] p-7 shadow-2xl">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#38BDF8]/12 text-[#38BDF8]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold">Expoin Bonus Admin</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Connect the authorized treasury wallet and sign the login message. The signature does not create a transaction or spend gas.
          </p>
          <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">Authorized wallet</div>
            <div className="mt-1 break-all font-mono text-xs text-white/70">{AUTHORIZED_ADMIN_ADDRESS}</div>
          </div>
          {error ? <div className="mt-5 rounded-lg border border-red-400/25 bg-red-400/10 p-3 text-sm text-red-100">{error}</div> : null}
          <button
            type="button"
            onClick={login}
            disabled={action === 'login'}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#38BDF8] px-5 py-3 font-semibold text-black disabled:opacity-50"
          >
            {action === 'login' ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
            Connect MetaMask
          </button>
        </div>
      </div>
    );
  }

  const claims = dashboard.claims;

  return (
    <div className="min-h-screen bg-[#070a0d] text-white">
      <header className="border-b border-white/10 bg-[#0a0e12]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <div className="text-xs uppercase text-[#38BDF8]">Expoin Operations</div>
            <h1 className="mt-1 text-xl font-semibold">Bonus administration</h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={refresh} className="rounded-lg border border-white/10 p-2.5 text-white/65 hover:text-white" title="Refresh">
              <RefreshCw className={`h-4 w-4 ${action === 'refresh' ? 'animate-spin' : ''}`} />
            </button>
            <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/65 hover:text-white">
              <LogOut className="h-4 w-4" />
              {shortAddress(adminAddress)}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-5 py-7">
        {error ? <div className="rounded-lg border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-100">{error}</div> : null}
        {message ? <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm text-emerald-100">{message}</div> : null}

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-[#0d1116] p-5">
            <div className="text-xs uppercase text-white/35">Treasury EXN</div>
            <div className="mt-2 text-2xl font-semibold">{formatAmount(dashboard.balances.exn, 2)}</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#0d1116] p-5">
            <div className="text-xs uppercase text-white/35">Gas balance</div>
            <div className="mt-2 text-2xl font-semibold">{formatAmount(dashboard.balances.bnb, 6)} BNB</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#0d1116] p-5">
            <div className="text-xs uppercase text-white/35">Treasury address</div>
            <div className="mt-2 flex items-center gap-2 font-mono text-sm">
              <Wallet className="h-4 w-4 text-[#38BDF8]" />
              {shortAddress(dashboard.contracts.treasury)}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-white/10 bg-[#0d1116]">
          <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">Bonus rules</h2>
              <p className="mt-1 text-sm text-white/45">
                The final eligibility check is performed at the block immediately before the purchase. If several rules match, the highest bonus percentage wins.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(event) => setSettings({...settings, enabled: event.target.checked})}
                  className="h-4 w-4 accent-[#38BDF8]"
                />
                <span className="text-sm">Bonus program enabled</span>
              </label>
              <button
                type="button"
                onClick={saveSettings}
                disabled={action === 'save'}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#38BDF8] px-4 py-2.5 font-semibold text-black disabled:opacity-50"
              >
                {action === 'save' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save rules
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase text-white/35">
                <tr>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">Contract</th>
                  <th className="px-4 py-3">Minimum holding</th>
                  <th className="px-4 py-3">Bonus</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {(settings.bonusRules || []).map((rule) => (
                  <tr key={rule.id}>
                    <td className="px-4 py-4 align-top">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={(event) => updateRule(rule.id, {enabled: event.target.checked})}
                        className="mt-3 h-4 w-4 accent-[#38BDF8]"
                      />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="grid gap-2">
                        <input
                          value={rule.watchedTokenSymbol}
                          onChange={(event) => updateRule(rule.id, {watchedTokenSymbol: event.target.value})}
                          className="w-full rounded-lg border border-white/10 bg-[#080b0f] px-3 py-2 font-semibold"
                          placeholder="SYMBOL"
                        />
                        <input
                          value={rule.tokenName || ''}
                          onChange={(event) => updateRule(rule.id, {tokenName: event.target.value})}
                          className="w-full rounded-lg border border-white/10 bg-[#080b0f] px-3 py-2 text-xs text-white/65"
                          placeholder="Token name"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <input
                        value={rule.watchedTokenAddress}
                        onChange={(event) => updateRule(rule.id, {
                          assetType: event.target.value.trim() ? 'erc20' : rule.assetType,
                          watchedTokenAddress: event.target.value,
                        })}
                        className="w-full rounded-lg border border-white/10 bg-[#080b0f] px-3 py-2 font-mono text-xs"
                        placeholder="0x..."
                      />
                      {rule.watchedTokenAddress ? (
                        <a
                          href={`https://bscscan.com/token/${rule.watchedTokenAddress}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-[#38BDF8] hover:text-white"
                        >
                          BscScan <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <input
                        value={rule.minimumBalance}
                        onChange={(event) => updateRule(rule.id, {minimumBalance: event.target.value})}
                        inputMode="decimal"
                        className="w-full rounded-lg border border-white/10 bg-[#080b0f] px-3 py-2"
                        placeholder="1"
                      />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-2">
                        <input
                          value={rule.bonusValue}
                          onChange={(event) => updateRule(rule.id, {bonusMode: 'percent', bonusValue: event.target.value})}
                          inputMode="decimal"
                          className="w-24 rounded-lg border border-white/10 bg-[#080b0f] px-3 py-2"
                          placeholder="15"
                        />
                        <span className="text-white/45">% EXN</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right align-top">
                      <button
                        type="button"
                        onClick={() => removeRule(rule.id)}
                        disabled={(settings.bonusRules || []).length <= 1}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/55 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-white/10 px-5 py-4">
            <button
              type="button"
              onClick={addRule}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white"
            >
              <Plus className="h-4 w-4" />
              Add custom token rule
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-white/10 bg-[#0d1116]">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="font-semibold">Bonus claims</h2>
            <p className="mt-1 text-sm text-white/45">{claims.length} purchase records</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase text-white/35">
                <tr>
                  <th className="px-4 py-3">Buyer</th>
                  <th className="px-4 py-3">Holding</th>
                  <th className="px-4 py-3">Purchase</th>
                  <th className="px-4 py-3">Bonus</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Transactions</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {claims.map((claim) => (
                  <tr key={claim.id}>
                    <td className="px-4 py-4 font-mono">{shortAddress(claim.buyer)}</td>
                    <td className="px-4 py-4">
                      {formatAmount(claimHolding(claim).balance)} {claimHolding(claim).symbol}
                      <div className="mt-1 text-xs text-white/35">
                        min {claimHolding(claim).minimum} / bonus {claimHolding(claim).bonusValue}%
                      </div>
                    </td>
                    <td className="px-4 py-4">{formatAmount(claim.baseTokenFormatted, 2)} EXN</td>
                    <td className="px-4 py-4 font-semibold text-[#38BDF8]">{formatAmount(claim.bonusFormatted, 2)} EXN</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 ${claim.status === 'paid' ? 'text-emerald-300' : claim.status === 'ineligible' ? 'text-white/35' : 'text-amber-300'}`}>
                        {claim.status === 'paid' ? <CheckCircle2 className="h-4 w-4" /> : null}
                        {statusLabel(claim.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <a href={`https://bscscan.com/tx/${claim.purchaseTxHash}`} target="_blank" rel="noreferrer" className="text-white/50 hover:text-white" title="Purchase transaction">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        {claim.bonusTxHash ? (
                          <a href={`https://bscscan.com/tx/${claim.bonusTxHash}`} target="_blank" rel="noreferrer" className="text-emerald-300" title="Bonus transaction">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {claim.status === 'eligible' || claim.status === 'awaiting_signature' || claim.status === 'payout_failed' ? (
                        <button
                          type="button"
                          onClick={() => payClaim(claim)}
                          disabled={action === `pay:${claim.id}`}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#38BDF8] px-3 py-2 text-xs font-semibold text-black disabled:opacity-50"
                        >
                          {action === `pay:${claim.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          Pay
                        </button>
                      ) : claim.status !== 'paid' ? (
                        <button
                          type="button"
                          onClick={() => resetClaim(claim)}
                          disabled={action === `reset:${claim.id}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/65"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Recheck
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
                {!claims.length ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-white/35">No bonus claims yet.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
