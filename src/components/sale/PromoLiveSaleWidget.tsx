import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ethers} from 'ethers';
import {CheckCircle2, ChevronDown, Loader2, LogOut, Wallet} from 'lucide-react';
import TokenSaleABI from '../../../token-sale-main/client/src/abi/TokenSaleContract.json';
import {
  type BonusEligibility,
  checkBonusEligibility,
  registerBonusClaim,
} from '../../lib/bonusApi';
import {pushToDataLayer} from '../../utils/analytics';

const TOKEN_SALE_CONTRACT_ADDRESS = '0x4580ce4209023ED68b1dA14A689d51906239b641';
const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
const TOKEN_PRICE_USD = 0.025;
const BSC_CHAIN_ID = 56;
const BSC_RPC_URL = 'https://bsc-dataseed.binance.org/';
const COMMUNITY_TOTAL_TOKENS = 20000000;

type WalletKey = 'metamask' | 'rabby' | 'okx' | 'safepal' | 'binance' | 'trustwallet';

type InjectedProvider = {
  request: (args: {method: string; params?: unknown[]}) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
  isRabby?: boolean;
  isTrust?: boolean;
  isSafePal?: boolean;
  isOkxWallet?: boolean;
  isOKExWallet?: boolean;
  isBinance?: boolean;
  isBinanceChain?: boolean;
  isPhantom?: boolean;
  providers?: InjectedProvider[];
};

type SaleInfo = {
  totalSold: string;
  maxTokens: string;
  minPurchase: string;
  maxPurchase: string;
  tokenPrice: string;
};

const walletOptions: Array<{key: WalletKey; label: string; description: string; tone: string; icon: string}> = [
  {key: 'metamask', label: 'MetaMask', description: 'Connect with MetaMask', tone: 'bg-orange-500/15 text-orange-300', icon: 'M'},
  {key: 'rabby', label: 'Rabby', description: 'Connect with Rabby Wallet', tone: 'bg-sky-500/15 text-sky-300', icon: 'R'},
  {key: 'okx', label: 'OKX Wallet', description: 'Connect with OKX Wallet', tone: 'bg-white/15 text-white', icon: 'OKX'},
  {key: 'safepal', label: 'SafePal', description: 'Connect with SafePal Wallet', tone: 'bg-fuchsia-500/15 text-fuchsia-300', icon: 'S'},
  {key: 'binance', label: 'Binance Web3', description: 'Connect with Binance Web3', tone: 'bg-yellow-500/15 text-yellow-300', icon: 'B'},
  {key: 'trustwallet', label: 'Trust Wallet', description: 'Connect with Trust Wallet', tone: 'bg-blue-500/15 text-blue-300', icon: 'T'},
];

function getWindowProvider() {
  return (window as any).ethereum as InjectedProvider | undefined;
}

function getInjectedProviders() {
  const injected = getWindowProvider();
  const providers = injected
    ? Array.isArray(injected.providers) && injected.providers.length
      ? [...injected.providers]
      : [injected]
    : [];
  const okxProvider = (window as any).okxwallet?.ethereum ?? (window as any).okxwallet;

  if (okxProvider) providers.unshift(okxProvider);

  return providers.filter((provider, index) => providers.indexOf(provider) === index && !provider.isPhantom);
}

function resolveWalletProvider(walletType: WalletKey) {
  const providers = getInjectedProviders();
  if (!providers.length) return null;

  const match = providers.find((provider) => {
    switch (walletType) {
      case 'metamask':
        return !!provider.isMetaMask && !provider.isRabby && !provider.isTrust && !provider.isSafePal && !provider.isOkxWallet && !provider.isOKExWallet;
      case 'rabby':
        return !!provider.isRabby;
      case 'okx':
        return !!provider.isOkxWallet || !!provider.isOKExWallet || provider === (window as any).okxwallet || provider === (window as any).okxwallet?.ethereum;
      case 'safepal':
        return !!provider.isSafePal;
      case 'binance':
        return !!provider.isBinance || !!provider.isBinanceChain;
      case 'trustwallet':
        return !!provider.isTrust;
      default:
        return false;
    }
  });

  return match ?? (walletType === 'metamask' ? providers[0] : null);
}

function formatNumber(value: string | number, digits = 2) {
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  if (Number.isNaN(parsed)) return '0';
  return parsed.toLocaleString('en-US', {
    minimumFractionDigits: digits === 0 ? 0 : 0,
    maximumFractionDigits: digits,
  });
}

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function normalizeDecimalInput(value: string) {
  return value.replace(',', '.').replace(/[^\d.]/g, '');
}

function TetherIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#26A17B" />
      <path d="M18.9 12.5V10h5.7V6.5H7.4V10h5.7v2.5c-4.7.2-8.2 1-8.2 2 0 1 3.5 1.8 8.2 2.1v8h5.8v-8c4.7-.2 8.2-1.1 8.2-2.1 0-1-3.5-1.8-8.2-2Zm0 3.4v.1c-.1 0-1.7.1-2.8.1-.9 0-1.6 0-2.8-.1v-.1c-3.6-.2-6.2-.8-6.2-1.4s2.6-1.2 6.2-1.4V15c1.2.1 2 .1 2.8.1 1 0 1.8 0 2.8-.1v-2c3.6.2 6.2.8 6.2 1.4s-2.6 1.2-6.2 1.4Z" fill="#fff" />
    </svg>
  );
}

type PromoLiveSaleWidgetProps = {
  analyticsSource?: string;
  enableCommunityBonus?: boolean;
  communityRuleId?: string;
};

export default function PromoLiveSaleWidget({
  analyticsSource = 'promo_funnel',
  enableCommunityBonus = false,
  communityRuleId,
}: PromoLiveSaleWidgetProps) {
  const [account, setAccount] = useState('');
  const [walletProvider, setWalletProvider] = useState<InjectedProvider | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [usdtAmount, setUsdtAmount] = useState('');
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [saleInfo, setSaleInfo] = useState<SaleInfo | null>(null);
  const [notice, setNotice] = useState<{tone: 'default' | 'danger' | 'success'; message: string} | null>(null);
  const [bonusEligibility, setBonusEligibility] = useState<BonusEligibility | null>(null);
  const trackedInputFocus = useRef(false);

  const tokenPrice = saleInfo ? parseFloat(saleInfo.tokenPrice) : TOKEN_PRICE_USD;
  const soldTokens = saleInfo ? parseFloat(saleInfo.totalSold) : 0;
  const progress = Math.min(100, (soldTokens / COMMUNITY_TOTAL_TOKENS) * 100);
  const receiveAmount = useMemo(() => {
    const pay = parseFloat(normalizeDecimalInput(usdtAmount));
    if (!usdtAmount || Number.isNaN(pay) || pay <= 0) return '0';
    return Math.floor(pay / tokenPrice).toString();
  }, [tokenPrice, usdtAmount]);
  const minimumUsdt = useMemo(() => Number((saleInfo ? parseFloat(saleInfo.minPurchase) : 1).toFixed(4)), [saleInfo]);
  const maximumUsdt = useMemo(() => Number((saleInfo ? parseFloat(saleInfo.maxPurchase) : 10000).toFixed(4)), [saleInfo]);
  const matchedBonusRule = bonusEligibility?.matchedRule || null;
  const campaignBonusRule = communityRuleId
    ? bonusEligibility?.checkedRules?.find((rule) => rule.id === communityRuleId) || null
    : matchedBonusRule;
  const bonusAmount = useMemo(() => {
    const rule = campaignBonusRule?.eligible ? campaignBonusRule : matchedBonusRule;
    if (!enableCommunityBonus || !rule?.eligible) return 0;
    const baseAmount = parseFloat(receiveAmount);
    if (!baseAmount || Number.isNaN(baseAmount)) return 0;
    if (rule.bonusMode === 'fixed') return parseFloat(rule.bonusValue) || 0;
    return baseAmount * (parseFloat(rule.bonusValue) || 0) / 100;
  }, [campaignBonusRule, enableCommunityBonus, matchedBonusRule, receiveAmount]);

  useEffect(() => {
    const fetchSaleInfo = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
        const contract = new ethers.Contract(TOKEN_SALE_CONTRACT_ADDRESS, TokenSaleABI, provider);
        const roundId = await contract.currentRoundId();
        const round = await contract.saleRounds(roundId);
        setSaleInfo({
          totalSold: ethers.formatUnits(round.sold, 18),
          maxTokens: ethers.formatUnits(round.allocation, 18),
          minPurchase: ethers.formatUnits(round.minPurchase, 18),
          maxPurchase: ethers.formatUnits(round.maxPurchase, 18),
          tokenPrice: ethers.formatUnits(round.price, 18),
        });
      } catch (error) {
        console.error('Failed to fetch promo sale info', error);
        setNotice({tone: 'danger', message: 'Could not load live sale data from BSC right now.'});
      }
    };

    fetchSaleInfo();
  }, []);

  useEffect(() => {
    if (!showWalletModal) return;
    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo({top: scrollY});
    };
  }, [showWalletModal]);

  useEffect(() => {
    const activeProvider = walletProvider ?? getWindowProvider();
    if (!activeProvider) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (!accounts.length) {
        setAccount('');
        setUsdtBalance('0');
        return;
      }

      setAccount(accounts[0]);
      await refreshWalletState(accounts[0], activeProvider);
    };

    const handleChainChanged = () => window.location.reload();

    activeProvider.on?.('accountsChanged', handleAccountsChanged);
    activeProvider.on?.('chainChanged', handleChainChanged);

    return () => {
      activeProvider.removeListener?.('accountsChanged', handleAccountsChanged);
      activeProvider.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [walletProvider]);

  useEffect(() => {
    const bootstrap = async () => {
      const activeProvider = walletProvider ?? getWindowProvider();
      if (!activeProvider) return;
      try {
        const accounts = await activeProvider.request({method: 'eth_accounts'});
        if (accounts?.length) {
          setAccount(accounts[0]);
          setWalletProvider(activeProvider);
          await refreshWalletState(accounts[0], activeProvider);
        }
      } catch (error) {
        console.error('Failed to restore promo wallet session', error);
      }
    };

    bootstrap();
  }, [walletProvider]);

  async function ensureBscNetwork(providerOverride?: InjectedProvider | null) {
    const activeProvider = providerOverride ?? walletProvider ?? getWindowProvider();
    if (!activeProvider) return false;
    try {
      const provider = new ethers.BrowserProvider(activeProvider as any);
      const network = await provider.getNetwork();
      if (Number(network.chainId) === BSC_CHAIN_ID) return true;
      await activeProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: `0x${BSC_CHAIN_ID.toString(16)}`}],
      });
      return true;
    } catch (error) {
      console.error('Failed to switch promo wallet chain', error);
      setNotice({tone: 'danger', message: 'Please switch your wallet to BNB Smart Chain (BEP-20) to continue.'});
      return false;
    }
  }

  async function refreshWalletState(address: string, providerOverride?: InjectedProvider | null) {
    const activeProvider = providerOverride ?? walletProvider ?? getWindowProvider();
    if (!activeProvider) return;
    try {
      const provider = new ethers.BrowserProvider(activeProvider as any);
      const usdtContract = new ethers.Contract(USDT_ADDRESS, ['function balanceOf(address) view returns (uint256)'], provider);
      const balance = await usdtContract.balanceOf(address);
      setUsdtBalance(ethers.formatUnits(balance, 18));
      if (enableCommunityBonus) {
        try {
          setBonusEligibility(await checkBonusEligibility(address));
        } catch (bonusError) {
          console.error('Failed to check campaign bonus eligibility', bonusError);
          setBonusEligibility(null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch promo wallet balances', error);
    }
  }

  async function connectWallet(walletType: WalletKey) {
    const selectedProvider = resolveWalletProvider(walletType);
    pushToDataLayer('wallet_interaction', {
      step_number: 3,
      action: 'wallet_option_click',
      wallet_type: walletType,
      source: analyticsSource,
    });

    if (!selectedProvider) {
      setNotice({tone: 'danger', message: `No compatible ${walletOptions.find((item) => item.key === walletType)?.label ?? 'wallet'} provider found.`});
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await selectedProvider.request({method: 'eth_requestAccounts'});
      if (!accounts?.length) throw new Error('No accounts found');
      const onBsc = await ensureBscNetwork(selectedProvider);
      if (!onBsc) return;
      setWalletProvider(selectedProvider);
      setAccount(accounts[0]);
      setShowWalletModal(false);
      await refreshWalletState(accounts[0], selectedProvider);
      setNotice({tone: 'success', message: 'Wallet connected successfully.'});
    } catch (error: any) {
      console.error('Promo wallet connection failed', error);
      setNotice({tone: 'danger', message: error?.code === 4001 ? 'Wallet connection was cancelled.' : 'Failed to connect wallet.'});
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnectWallet() {
    try {
      const activeProvider = walletProvider ?? getWindowProvider();
      if (activeProvider?.request) {
        await activeProvider.request({
          method: 'wallet_revokePermissions',
          params: [{eth_accounts: {}}],
        });
      }
    } catch (error) {
      console.info('wallet_revokePermissions not available', error);
    }
    setAccount('');
    setWalletProvider(null);
    setUsdtBalance('0');
    setBonusEligibility(null);
    setNotice({tone: 'default', message: 'Wallet disconnected.'});
  }

  function handleAmountFocus() {
    if (trackedInputFocus.current) return;
    trackedInputFocus.current = true;
    pushToDataLayer('form_engagement', {
      step_number: 3,
      field_name: 'usdt_amount',
      source: analyticsSource,
    });
  }

  function openWalletModalFromPrimary() {
    pushToDataLayer('wallet_interaction', {
      step_number: 3,
      action: 'connect_wallet_click',
      source: analyticsSource,
    });
    setShowWalletModal(true);
  }

  async function handlePurchase() {
    const activeProvider = walletProvider ?? getWindowProvider();
    if (!account || !activeProvider) {
      openWalletModalFromPrimary();
      return;
    }

    pushToDataLayer('wallet_interaction', {
      step_number: 3,
      action: 'purchase_click',
      source: analyticsSource,
    });

    const normalizedUsdtAmount = normalizeDecimalInput(usdtAmount);
    const pay = parseFloat(normalizedUsdtAmount);
    const tokens = parseFloat(receiveAmount);
    const remainingTokens = Math.max(0, COMMUNITY_TOTAL_TOKENS - soldTokens);
    if (!normalizedUsdtAmount || !pay || Number.isNaN(pay)) {
      setNotice({tone: 'danger', message: 'Enter a valid USDT amount.'});
      return;
    }
    if (pay < minimumUsdt) {
      setNotice({tone: 'danger', message: `Minimum purchase is ${minimumUsdt} USDT.`});
      return;
    }
    if (pay > maximumUsdt) {
      setNotice({tone: 'danger', message: `Maximum purchase is ${formatNumber(maximumUsdt, 2)} USDT.`});
      return;
    }
    if (tokens > remainingTokens) {
      setNotice({tone: 'danger', message: 'Requested amount exceeds the remaining supply.'});
      return;
    }
    if (pay > parseFloat(usdtBalance)) {
      setNotice({tone: 'danger', message: 'Insufficient USDT balance for this purchase.'});
      return;
    }

    const onBsc = await ensureBscNetwork(activeProvider);
    if (!onBsc) return;

    try {
      setIsPurchasing(true);
      setNotice({tone: 'default', message: 'Approving USDT...'});

      const provider = new ethers.BrowserProvider(activeProvider as any);
      const signer = await provider.getSigner();
      const saleContract = new ethers.Contract(TOKEN_SALE_CONTRACT_ADDRESS, TokenSaleABI, signer);
      const usdtContract = new ethers.Contract(
        USDT_ADDRESS,
        [
          'function approve(address spender, uint256 amount) returns (bool)',
          'function balanceOf(address owner) view returns (uint256)',
          'function decimals() view returns (uint8)',
        ],
        signer,
      );

      const usdtDecimals = Number(await usdtContract.decimals?.().catch(() => 18)) || 18;
      const usdtAmountWei = ethers.parseUnits(normalizedUsdtAmount, usdtDecimals);
      const balance = await usdtContract.balanceOf(account);
      if (balance < usdtAmountWei) {
        throw new Error(`Insufficient USDT balance. You need ${normalizedUsdtAmount} USDT on BSC.`);
      }

      const approveTx = await usdtContract.approve(TOKEN_SALE_CONTRACT_ADDRESS, usdtAmountWei);
      await approveTx.wait();

      setNotice({tone: 'default', message: 'Submitting purchase transaction...'});
      const tx = await saleContract.buyTokens(usdtAmountWei);
      const receipt = await tx.wait();
      if (receipt.status !== 1) throw new Error('Transaction failed on-chain.');

      try {
        const referrer = localStorage.getItem('expoin-referrer');
        if (referrer) {
          await fetch('/api/trpc/referral.recordPurchase', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
              json: {
                buyer: account,
                txHash: tx.hash,
                usdtAmount: normalizedUsdtAmount,
                tokensAmount: receiveAmount,
                chainId: 56,
                referrer,
              },
            }),
          });
        }
      } catch (error) {
        console.error('Promo referral tracking failed', error);
      }

      await refreshWalletState(account, activeProvider);
      let successMessage = 'Purchase successful. Your allocation is secured.';
      if (enableCommunityBonus) {
        try {
          const bonusClaim = await registerBonusClaim(tx.hash);
          successMessage = bonusClaim.status === 'eligible'
            ? `Purchase successful. ${formatNumber(bonusClaim.bonusFormatted, 2)} bonus EXN is ready for treasury payout.`
            : 'Purchase successful. The wallet did not meet the active bonus holding requirement.';
        } catch (bonusError) {
          console.error('Campaign bonus claim registration failed', bonusError);
          successMessage = 'Purchase successful. Bonus verification is pending.';
        }
      }
      setNotice({tone: 'success', message: successMessage});
      setShowSuccessOverlay(true);
      pushToDataLayer('purchase_success', {
        value: Number(normalizedUsdtAmount),
        currency: 'USDT',
        token: 'EXN',
        source: analyticsSource,
        community_rule: communityRuleId || null,
      });
      setUsdtAmount('');
    } catch (error: any) {
      console.error('Promo purchase failed', error);
      setNotice({tone: 'danger', message: error?.reason || error?.message || 'Purchase failed.'});
    } finally {
      setIsPurchasing(false);
    }
  }

  const buttonText = account ? (usdtAmount ? 'Purchase with USDT' : 'Enter Amount') : 'Connect Wallet';

  return (
    <>
      {showSuccessOverlay && notice?.tone === 'success' ? (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-emerald-400/25 bg-[#07110d] p-6 text-center shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">Purchase successful</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">{notice.message}</p>
            <button type="button" onClick={() => setShowSuccessOverlay(false)} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-emerald-300">
              Continue
            </button>
          </div>
        </div>
      ) : null}

      <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">
        <div className="w-full lg:w-[480px] spotlight-card relative overflow-hidden rounded-[32px] border border-white/10 bg-[#080808]/80 p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          <div className="relative z-10">
            <div className="mb-6 flex items-start justify-between gap-5">
              <div>
                <h3 className="mb-1 text-2xl font-semibold tracking-tight text-white">Buy EXN</h3>
                <p className="text-xs font-medium leading-relaxed text-[#38BDF8]">You are purchasing EXN at the Community OG price of ${tokenPrice.toFixed(4)}.</p>
              </div>
              {account ? (
                <button type="button" onClick={disconnectWallet} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-[11px] font-medium text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white">
                  <LogOut className="h-4 w-4" />
                  {formatAddress(account)}
                </button>
              ) : (
                <button type="button" onClick={openWalletModalFromPrimary} className="inline-flex items-center gap-2 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-3 py-2 text-[11px] font-semibold text-[#38BDF8] transition-colors hover:bg-[#38BDF8]/15">
                  {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
                  Connect
                </button>
              )}
            </div>

            <div className="mb-8">
              <div className="mb-2 flex justify-between text-xs font-mono text-white/60">
                <span>Sold: <strong className="text-white">{formatNumber(soldTokens, 0)} EXN</strong></span>
                <span>Total: {formatNumber(COMMUNITY_TOTAL_TOKENS, 0)} EXN</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-white/5">
                <div className="h-full rounded-full bg-[#38BDF8] transition-all duration-500" style={{width: `${progress}%`}} />
              </div>
            </div>

            {notice && notice.tone !== 'success' ? (
              <div className={`mb-4 rounded-2xl border px-4 py-3 text-xs ${notice.tone === 'danger' ? 'border-red-400/30 bg-red-400/10 text-red-100' : 'border-white/10 bg-white/[0.04] text-white/65'}`}>
                {notice.message}
              </div>
            ) : null}

            <div className="relative flex flex-col gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-colors focus-within:border-white/20">
                <div className="mb-3 flex justify-between text-[10px] uppercase tracking-widest text-white/40 font-mono">
                  <span>You Pay</span>
                  <span>Balance: {account ? `${parseFloat(usdtBalance).toFixed(2)} USDT` : 'Connect wallet'}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#26A17B]/20 text-[#26A17B]">
                      <TetherIcon />
                    </div>
                    <span className="text-sm font-semibold">USDT</span>
                  </div>
                  <input
                    type="number"
                    min={minimumUsdt}
                    step="0.01"
                    placeholder={minimumUsdt.toString()}
                    value={usdtAmount}
                    onFocus={handleAmountFocus}
                    onChange={(event) => setUsdtAmount(event.target.value)}
                    className="w-full bg-transparent text-right font-mono text-2xl text-white outline-none placeholder-white/20"
                  />
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#111111] text-white/40">
                <ChevronDown className="h-4 w-4" />
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="relative z-10 mb-3 flex justify-between text-[10px] uppercase tracking-widest text-white/40 font-mono">
                  <span>You Receive</span>
                  <span>Price: ${tokenPrice.toFixed(4)}</span>
                </div>
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 px-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#38BDF8]/20 text-[#38BDF8]">
                      <img src="/tokenicon.svg" alt="EXN" className="h-4 w-4 object-contain" />
                    </div>
                    <span className="text-sm font-semibold">EXN</span>
                  </div>
                  <div className="w-full text-right font-mono text-2xl text-[#38BDF8]">{formatNumber(receiveAmount, 0)}</div>
                </div>
              </div>
            </div>

            {enableCommunityBonus && account && bonusEligibility ? (
              <div className={`campaign-bonus-status mt-4 rounded-2xl border px-4 py-3 text-sm ${
                campaignBonusRule?.eligible
                  ? 'is-eligible border-emerald-400/25 bg-emerald-400/10 text-emerald-100'
                  : 'border-white/10 bg-white/[0.03] text-white/55'
              }`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <strong className="block">
                      {campaignBonusRule?.eligible
                        ? `${campaignBonusRule.watchedTokenSymbol} holder bonus unlocked`
                        : 'Wallet bonus requirement'}
                    </strong>
                    {campaignBonusRule ? (
                      <span className="mt-1 block text-xs opacity-75">
                        Balance: {formatNumber(campaignBonusRule.balanceFormatted, 4)} {campaignBonusRule.symbol}. Required: {campaignBonusRule.minimumBalance} {campaignBonusRule.symbol}.
                      </span>
                    ) : null}
                  </div>
                  {campaignBonusRule?.eligible ? <strong className="whitespace-nowrap font-mono">+{formatNumber(bonusAmount, 2)} EXN</strong> : null}
                </div>
              </div>
            ) : null}

            <div className="mt-6">
              <button type="button" onClick={handlePurchase} disabled={isPurchasing || (account ? !usdtAmount : false)} className="shiny-cta w-full">
                <span>
                  {isPurchasing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    buttonText
                  )}
                </span>
              </button>
            </div>

            <p className="mt-4 text-center text-[10px] font-mono text-white/30">Transactions are processed on BNB Chain.</p>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:w-1/2 lg:gap-6 lg:mt-4">
          <div className="flex flex-col justify-center rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <span className="mb-2 text-xs font-mono uppercase tracking-wider text-white/40">Token Price</span>
            <span className="text-3xl font-semibold tracking-tight text-white">${tokenPrice.toFixed(4)} <span className="text-sm font-normal text-white/30">/ EXN</span></span>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <span className="mb-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8]">IDO Price</span>
            <span className="text-3xl font-semibold tracking-tight text-[#38BDF8]">$0.060 <span className="text-sm font-normal text-[#38BDF8]/50">/ EXN</span></span>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:col-span-2">
            <span className="mb-4 text-xs font-mono uppercase tracking-wider text-white/40">Vesting Schedule</span>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-3"><span className="text-sm text-white/80">TGE Unlock</span><span className="font-mono font-medium text-white">20%</span></div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3"><span className="text-sm text-white/80">Cliff Period</span><span className="font-mono font-medium text-white">12 Months</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-white/80">Linear Vesting</span><span className="font-mono font-medium text-white">18 Months</span></div>
            </div>
          </div>
          <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl border border-[#38BDF8]/20 bg-gradient-to-br from-[#38BDF8]/10 to-transparent p-6 sm:col-span-2">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#38BDF8]/10 blur-3xl"></div>
            <span className="relative z-10 mb-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8]/80">Smart Contract Audit</span>
            <span className="relative z-10 text-lg font-medium text-white">Audited by Hacken & CertiK.</span>
          </div>
        </div>
      </div>

      {showWalletModal ? (
        <div className="fixed inset-0 z-[260] flex items-start justify-center overflow-y-auto bg-black/70 px-4 pb-8 pt-36 sm:pt-40 lg:pt-44 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[30px] border border-white/10 bg-[#05070b] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-white">Connect Wallet</h3>
                <p className="mt-2 text-sm text-white/55">Choose your preferred wallet to purchase EXN with USDT on BNB Smart Chain.</p>
              </div>
              <button type="button" onClick={() => setShowWalletModal(false)} className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-white/60 transition-colors hover:text-white">
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-3">
              {walletOptions.map((option) => (
                <button key={option.label} type="button" onClick={() => connectWallet(option.key)} className="flex items-center gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition-colors hover:bg-white/[0.06]">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-bold ${option.tone}`}>{option.icon}</div>
                  <div>
                    <div className="font-semibold text-white">{option.label}</div>
                    <div className="text-sm text-white/45">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
