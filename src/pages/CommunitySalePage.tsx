import React, {useEffect, useMemo, useState} from 'react';
import {ethers} from 'ethers';
import {
  CheckCircle2,
  ChevronDown,
  Copy,
  HandCoins,
  Loader2,
  LogOut,
  Percent,
  ShieldEllipsis,
  Wallet,
  XCircle,
} from 'lucide-react';
import {Link} from 'react-router-dom';
import TokenSaleABI from '../../token-sale-main/client/src/abi/TokenSaleContract.json';
import {Eyebrow, PageSection, SectionShell, SpotlightCard} from '../components/pages/PagePrimitives';
import {usePageMetadata} from '../hooks/usePageMetadata';
import {
  type BonusEligibility,
  checkBonusEligibility,
  registerBonusClaim,
} from '../lib/bonusApi';
import {createPageStructuredData} from '../lib/seo';

const TOKEN_SALE_CONTRACT_ADDRESS = '0x4580ce4209023ED68b1dA14A689d51906239b641';
const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
const TOKEN_PRICE_USD = 0.025;
const BSC_CHAIN_ID = 56;
const BSC_RPC_URL = 'https://bsc-dataseed.binance.org/';
const COMMUNITY_TOTAL_TOKENS = 20000000;

const stats = [
  ['Entry Price', '$0.025'],
  ['IDO Price', '$0.060'],
  ['Discount', '58% OFF'],
  ['Allocation', '10% only'],
];

const reasons = [
  ['Profit Sharing', 'EXN is designed as an ownership layer. Stakers participate in a share of platform fee generation rather than sitting on passive paper upside alone.'],
  ['58% Instant Equity', 'The Community OG round enters at $0.025 while the public IDO is positioned at $0.06, creating a meaningful pre-listing edge.'],
  ['Scarce & Protected', 'Fixed supply, long cliffs, and staged unlocks are there to protect structure after launch instead of feeding instant overhang.'],
];

const rounds = [
  {name: 'Community OG', price: '$0.025', allocation: '10%', discount: '58%', lockup: '12 months', vesting: '18 months', featured: true},
  {name: 'Presale Round', price: '$0.045', allocation: '15%', discount: '25%', lockup: '6 months', vesting: '12 months'},
  {name: 'Public IDO', price: '$0.060', allocation: '5%', discount: '0%', lockup: 'None', vesting: '100% TGE'},
];

const faqItems = [
  {
    question: 'What is the EXN Token Sale?',
    answer: "The EXN Token Sale is the initial offering of Expoin's native token (EXN) to early supporters and investors. EXN powers the Expoin ecosystem, a multi-chain DEX and wallet platform connecting over 50 cross-chain bridges.",
  },
  {
    question: 'What is Expoin?',
    answer: 'Expoin is a comprehensive crypto platform featuring a multi-chain wallet and DEX. We support 99% of blockchains and tokens, enabling truly cross-chain trading with atomic swaps technology.',
  },
  {
    question: 'Which network should I use?',
    answer: 'The token sale operates on Binance Smart Chain (BSC) mainnet. Make sure your wallet is connected to BSC network before purchasing.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'This Community OG flow currently accepts only USDT on BSC (BEP-20).',
  },
  {
    question: 'How do I participate in the token sale?',
    answer: 'Connect your wallet, ensure you are on BSC, enter a USDT amount, confirm the approval, then confirm the purchase transaction.',
  },
  {
    question: 'What is the current token price?',
    answer: 'The current Community OG price is $0.0250 per EXN token.',
  },
  {
    question: 'What is the minimum purchase amount?',
    answer: 'The minimum purchase threshold is enforced by the live sale contract and reflected inside the checkout widget.',
  },
  {
    question: 'Is there a vesting period?',
    answer: 'Community OG tokens follow a long-term alignment schedule with a 12-month lockup and 18-month linear vesting.',
  },
  {
    question: 'Is there a whitelist?',
    answer: 'No whitelist is required. The sale is open while allocation remains available.',
  },
  {
    question: 'When will I receive my tokens?',
    answer: 'Purchased tokens are recorded immediately, but release follows the vesting schedule attached to this round.',
  },
  {
    question: 'Where can I trade EXN tokens after purchase?',
    answer: 'EXN is intended for future DEX and CEX listing after the launch sequence. Official listing announcements will be made on Expoin channels.',
  },
  {
    question: 'What are the risks?',
    answer: 'Cryptocurrency investments carry inherent risks including volatility, smart contract risk, and regulatory uncertainty. Please do your own research before participating.',
  },
];

const salePageTitle = 'Buy EXN | Expoin Community OG Sale';
const salePageDescription = 'Join the EXN Community OG round, review vesting terms, and purchase with USDT on BNB Smart Chain.';
const saleStructuredData = createPageStructuredData({
  path: '/sale',
  title: salePageTitle,
  description: salePageDescription,
  breadcrumbs: [
    {name: 'Home', path: '/'},
    {name: 'Buy EXN', path: '/sale'},
  ],
  article: {
    headline: salePageTitle,
  },
  faqs: faqItems,
});

interface SaleInfo {
  totalSold: string;
  maxTokens: string;
  minPurchase: string;
  maxPurchase: string;
  tokenPrice: string;
}

interface TxRecord {
  hash: string;
  buyer: string;
  amount: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
}

declare global {
  type InjectedWalletProvider = {
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
    providers?: InjectedWalletProvider[];
  };

  interface Window {
    ethereum?: InjectedWalletProvider;
    okxwallet?: InjectedWalletProvider & {ethereum?: InjectedWalletProvider};
  }
}

type WalletKey = 'metamask' | 'rabby' | 'okx' | 'safepal' | 'binance' | 'trustwallet';

function MetaMaskIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3.5 6.8 10.3l3.4 8.6 5.8 3.2 5.8-3.2 3.4-8.6L16 3.5Z" fill="#E17726" />
      <path d="M25.2 10.3 16 15.7l-9.2-5.4L16 3.5l9.2 6.8Z" fill="#F6851B" />
      <path d="m10.2 18.9 5.8-3.2 5.8 3.2-5.8 8.1-5.8-8.1Z" fill="#C0AD9E" />
      <path d="M12 11.6 16 9l4 2.6-.8 5.1-3.2 1.7-3.2-1.7-.8-5.1Z" fill="#FFF" />
      <path d="M12.8 16.7 16 15l3.2 1.7L16 18.4l-3.2-1.7Z" fill="#161616" fillOpacity=".16" />
    </svg>
  );
}

function RabbyIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" rx="8" fill="#6AA4FF" />
      <path d="M11 21V11h5.4c2.7 0 4.6 1.4 4.6 3.8 0 1.7-.9 2.9-2.4 3.4l2.8 2.8H17.9l-2.3-2.4H14V21h-3Zm3-4.8h2.1c1.2 0 1.8-.5 1.8-1.4 0-.8-.6-1.3-1.8-1.3H14v2.7Z" fill="#fff" />
    </svg>
  );
}

function OkxIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#111" />
      <path d="M7 9h5v5H7zm6 0h5v5h-5zm6 0h5v5h-5zM7 15h5v5H7zm12 0h5v5h-5zM13 21h5v5h-5z" fill="#fff" />
    </svg>
  );
}

function SafePalIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#7C3AED" />
      <path d="M10.5 12.8c0-2 1.7-3.5 4.1-3.5h6.9v3.1h-6.5c-.9 0-1.5.4-1.5 1 0 .8.7 1 2 1.3 2.8.6 5.4 1.3 5.4 4.3 0 2.2-1.8 3.7-4.7 3.7H9.7v-3.1h6.5c1.1 0 1.7-.4 1.7-1.1 0-.8-.8-1-2.3-1.4-2.6-.6-5.1-1.4-5.1-4.3Z" fill="#fff" />
    </svg>
  );
}

function BinanceIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#181A20" />
      <path d="M16 6.5 19.7 10.2 16 13.9l-3.7-3.7L16 6.5Zm-5.8 5.8 3.7 3.7-3.7 3.7-3.7-3.7 3.7-3.7Zm11.6 0 3.7 3.7-3.7 3.7-3.7-3.7 3.7-3.7ZM16 18.1l3.7 3.7-3.7 3.7-3.7-3.7 3.7-3.7Zm0-4.3 2.7 2.7-2.7 2.7-2.7-2.7 2.7-2.7Z" fill="#F3BA2F" />
    </svg>
  );
}

function TrustWalletIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#3375FF" />
      <path d="M16 8 10 10.5v4.8c0 4.2 2.6 7.6 6 8.7 3.4-1.1 6-4.5 6-8.7v-4.8L16 8Zm0 3 3.4 1.4v2.9c0 2.8-1.4 5.1-3.4 6.2-2-1.1-3.4-3.4-3.4-6.2v-2.9L16 11Z" fill="#fff" />
    </svg>
  );
}

function TetherIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#26A17B" />
      <path d="M18.9 12.5V10h5.7V6.5H7.4V10h5.7v2.5c-4.7.2-8.2 1-8.2 2 0 1 3.5 1.8 8.2 2.1v8h5.8v-8c4.7-.2 8.2-1.1 8.2-2.1 0-1-3.5-1.8-8.2-2Zm0 3.4v.1c-.1 0-1.7.1-2.8.1-.9 0-1.6 0-2.8-.1v-.1c-3.6-.2-6.2-.8-6.2-1.4s2.6-1.2 6.2-1.4V15c1.2.1 2 .1 2.8.1 1 0 1.8 0 2.8-.1v-2c3.6.2 6.2.8 6.2 1.4s-2.6 1.2-6.2 1.4Z" fill="#fff" />
    </svg>
  );
}

const walletOptions: Array<{
  key: WalletKey;
  label: string;
  description: string;
  tone: string;
  icon: React.ReactNode;
}> = [
  {key: 'metamask', label: 'MetaMask', description: 'Connect with MetaMask', tone: 'bg-orange-500/15 text-orange-300', icon: <MetaMaskIcon />},
  {key: 'rabby', label: 'Rabby', description: 'Connect with Rabby Wallet', tone: 'bg-sky-500/15 text-sky-300', icon: <RabbyIcon />},
  {key: 'okx', label: 'OKX Wallet', description: 'Connect with OKX Wallet', tone: 'bg-white/15 text-white', icon: <OkxIcon />},
  {key: 'safepal', label: 'SafePal', description: 'Connect with SafePal Wallet', tone: 'bg-fuchsia-500/15 text-fuchsia-300', icon: <SafePalIcon />},
  {key: 'binance', label: 'Binance Web3', description: 'Connect with Binance Web3', tone: 'bg-yellow-500/15 text-yellow-300', icon: <BinanceIcon />},
  {key: 'trustwallet', label: 'Trust Wallet', description: 'Connect with Trust Wallet', tone: 'bg-blue-500/15 text-blue-300', icon: <TrustWalletIcon />},
];

function getInjectedProviders() {
  const injected = window.ethereum;
  const providers = injected
    ? Array.isArray(injected.providers) && injected.providers.length
      ? [...injected.providers]
      : [injected]
    : [];
  const okxProvider = window.okxwallet?.ethereum ?? window.okxwallet;

  if (okxProvider) {
    providers.unshift(okxProvider);
  }

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
        return !!provider.isOkxWallet || !!provider.isOKExWallet || provider === window.okxwallet || provider === window.okxwallet?.ethereum;
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

export default function CommunitySalePage() {
  usePageMetadata({
    title: salePageTitle,
    description: salePageDescription,
    path: '/sale',
    jsonLd: saleStructuredData,
  });

  const [showCheckout, setShowCheckout] = useState(false);
  const [account, setAccount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [usdtAmount, setUsdtAmount] = useState('');
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [saleInfo, setSaleInfo] = useState<SaleInfo | null>(null);
  const [transactions, setTransactions] = useState<TxRecord[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [notice, setNotice] = useState<{tone: 'default' | 'danger' | 'success'; message: string} | null>(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [copied, setCopied] = useState(false);
  const [walletProvider, setWalletProvider] = useState<InjectedWalletProvider | null>(null);
  const [bonusEligibility, setBonusEligibility] = useState<BonusEligibility | null>(null);

  const tokenPrice = saleInfo ? parseFloat(saleInfo.tokenPrice) : TOKEN_PRICE_USD;
  const remainingTokens = useMemo(() => {
    if (!saleInfo) return 0;
    return Math.max(0, parseFloat(saleInfo.maxTokens) - parseFloat(saleInfo.totalSold));
  }, [saleInfo]);
  const soldTokens = useMemo(() => {
    if (!saleInfo) return 0;
    return parseFloat(saleInfo.totalSold);
  }, [saleInfo]);
  const progress = useMemo(() => {
    if (!soldTokens) return 0;
    return Math.min(100, (soldTokens / COMMUNITY_TOTAL_TOKENS) * 100);
  }, [soldTokens]);
  const receiveAmount = useMemo(() => {
    const pay = parseFloat(normalizeDecimalInput(usdtAmount));
    if (!usdtAmount || Number.isNaN(pay) || pay <= 0) return '0';
    return Math.floor(pay / tokenPrice).toString();
  }, [tokenPrice, usdtAmount]);
  const minimumUsdt = useMemo(() => Number((saleInfo ? parseFloat(saleInfo.minPurchase) : 1).toFixed(4)), [saleInfo]);
  const maximumUsdt = useMemo(() => Number((saleInfo ? parseFloat(saleInfo.maxPurchase) : 10000).toFixed(4)), [saleInfo]);
  const matchedBonusRule = bonusEligibility?.matchedRule || null;
  const bonusAmount = useMemo(() => {
    if (!bonusEligibility?.eligible || !matchedBonusRule) return 0;
    const baseAmount = parseFloat(receiveAmount);
    if (!baseAmount || Number.isNaN(baseAmount)) return 0;
    if (matchedBonusRule.bonusMode === 'fixed') {
      return parseFloat(matchedBonusRule.bonusValue) || 0;
    }
    return baseAmount * (parseFloat(matchedBonusRule.bonusValue) || 0) / 100;
  }, [bonusEligibility, matchedBonusRule, receiveAmount]);
  const displayedBonusRule = matchedBonusRule || bonusEligibility?.checkedRules?.[0] || null;

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
    const storageKey = account ? `exn-transactions-${account.toLowerCase()}` : null;
    if (!storageKey) {
      setTransactions([]);
      return;
    }
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      setTransactions([]);
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      setTransactions(Array.isArray(parsed) ? parsed : []);
    } catch {
      setTransactions([]);
    }
  }, [account]);

  useEffect(() => {
    if (!account) return;
    localStorage.setItem(`exn-transactions-${account.toLowerCase()}`, JSON.stringify(transactions));
  }, [account, transactions]);

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
        console.error('Failed to fetch sale info', error);
        setNotice({
          tone: 'danger',
          message: 'Could not load live sale data from BSC right now.',
        });
      }
    };

    fetchSaleInfo();
  }, []);

  useEffect(() => {
    const activeProvider = walletProvider ?? window.ethereum;
    if (!activeProvider) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (!accounts.length) {
        setAccount('');
        setUsdtBalance('0');
        return;
      }

      const nextAccount = accounts[0];
      setAccount(nextAccount);
      await refreshWalletState(nextAccount, activeProvider);
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
      const activeProvider = walletProvider ?? window.ethereum;
      if (!activeProvider) return;
      try {
        const accounts = await activeProvider.request({method: 'eth_accounts'});
        if (accounts?.length) {
          setAccount(accounts[0]);
          setWalletProvider(activeProvider);
          await refreshWalletState(accounts[0], activeProvider);
        }
      } catch (error) {
        console.error('Failed to restore wallet session', error);
      }
    };
    bootstrap();
  }, [walletProvider]);

  async function ensureBscNetwork(providerOverride?: InjectedWalletProvider | null) {
    const activeProvider = providerOverride ?? walletProvider ?? window.ethereum;
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
    } catch (error: any) {
      console.error('Failed to switch chain', error);
      setNotice({
        tone: 'danger',
        message: 'Please switch your wallet to BNB Smart Chain (BEP-20) to continue.',
      });
      return false;
    }
  }

  async function refreshWalletState(address: string, providerOverride?: InjectedWalletProvider | null) {
    const activeProvider = providerOverride ?? walletProvider ?? window.ethereum;
    if (!activeProvider) return;
    try {
      const provider = new ethers.BrowserProvider(activeProvider as any);
      const usdtContract = new ethers.Contract(
        USDT_ADDRESS,
        ['function balanceOf(address) view returns (uint256)'],
        provider,
      );
      const balance = await usdtContract.balanceOf(address);
      setUsdtBalance(ethers.formatUnits(balance, 18));
      try {
        setBonusEligibility(await checkBonusEligibility(address));
      } catch (bonusError) {
        console.error('Failed to check bonus eligibility', bonusError);
        setBonusEligibility(null);
      }
    } catch (error) {
      console.error('Failed to fetch wallet balances', error);
    }
  }

  async function connectWallet(walletType: WalletKey) {
    const selectedProvider = resolveWalletProvider(walletType);
    if (!selectedProvider) {
      setNotice({
        tone: 'danger',
        message: `No compatible ${walletOptions.find((item) => item.key === walletType)?.label ?? 'wallet'} provider found.`,
      });
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
      console.error('Wallet connection failed', error);
      setNotice({
        tone: 'danger',
        message: error?.code === 4001 ? 'Wallet connection was cancelled.' : 'Failed to connect wallet.',
      });
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnectWallet() {
    try {
      const activeProvider = walletProvider ?? window.ethereum;
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

  async function handlePurchase() {
    const activeProvider = walletProvider ?? window.ethereum;
    if (!account || !activeProvider) {
      setNotice({tone: 'danger', message: 'Connect your wallet before purchasing.'});
      return;
    }

    const normalizedUsdtAmount = normalizeDecimalInput(usdtAmount);
    const pay = parseFloat(normalizedUsdtAmount);
    const tokens = parseFloat(receiveAmount);
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

      setTransactions((prev) => [
        {
          hash: tx.hash,
          buyer: account,
          amount: receiveAmount,
          timestamp: Date.now(),
          status: 'pending',
        },
        ...prev,
      ]);

      const receipt = await tx.wait();
      setTransactions((prev) =>
        prev.map((item) =>
          item.hash === tx.hash
            ? {...item, status: receipt.status === 1 ? 'success' : 'failed'}
            : item,
        ),
      );

      if (receipt.status !== 1) {
        throw new Error('Transaction failed on-chain.');
      }

      let successMessage = 'Purchase successful. Your allocation is secured.';
      try {
        const bonusClaim = await registerBonusClaim(tx.hash);
        if (bonusClaim.status === 'eligible') {
          successMessage = `Purchase successful. ${formatNumber(bonusClaim.bonusFormatted, 2)} bonus EXN is ready for treasury payout.`;
        } else {
          successMessage = 'Purchase successful. The wallet did not meet the active bonus holding requirement.';
        }
      } catch (bonusError) {
        console.error('Bonus claim registration failed', bonusError);
        successMessage = 'Purchase successful. Bonus verification is pending.';
      }

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
        console.error('Referral tracking failed', error);
      }

      await refreshWalletState(account, activeProvider);
      const providerRead = new ethers.JsonRpcProvider(BSC_RPC_URL);
      const contractRead = new ethers.Contract(TOKEN_SALE_CONTRACT_ADDRESS, TokenSaleABI, providerRead);
      const roundId = await contractRead.currentRoundId();
      const round = await contractRead.saleRounds(roundId);
      setSaleInfo({
        totalSold: ethers.formatUnits(round.sold, 18),
        maxTokens: ethers.formatUnits(round.allocation, 18),
        minPurchase: ethers.formatUnits(round.minPurchase, 18),
        maxPurchase: ethers.formatUnits(round.maxPurchase, 18),
        tokenPrice: ethers.formatUnits(round.price, 18),
      });

      setUsdtAmount('');
      setNotice({tone: 'success', message: successMessage});
      setShowSuccessOverlay(true);
    } catch (error: any) {
        console.error('Purchase failed', error);
      setNotice({tone: 'danger', message: error?.reason || error?.message || 'Purchase failed.'});
      setTransactions((prev) =>
        prev.map((item, index) => (index === 0 && item.status === 'pending' ? {...item, status: 'failed'} : item)),
      );
    } finally {
      setIsPurchasing(false);
    }
  }

  function openCheckout() {
    setShowCheckout(true);
  }

  function copyReferral() {
    navigator.clipboard.writeText('https://expoin.net/sale');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="pt-20 sm:pt-24">
      {showSuccessOverlay && notice?.tone === 'success' ? (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-emerald-400/25 bg-[#07110d] p-6 text-center shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">Purchase successful</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">{notice.message}</p>
            <button
              type="button"
              onClick={() => setShowSuccessOverlay(false)}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-emerald-300"
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      <PageSection className="border-t-0 overflow-hidden pb-16 pt-8 sm:pt-10">
        <SectionShell className="text-center">
          {!showCheckout ? (
            <>
              <Eyebrow>Community OG Round Live</Eyebrow>
              <h1 className="mx-auto max-w-5xl text-5xl font-semibold leading-[1.04] tracking-tight text-white md:text-6xl lg:text-7xl">
                Exclusive entry for <span className="text-[#38BDF8] text-glow">diamond hands.</span>
              </h1>
              <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-white/60 md:text-xl">
                Secure EXN at the lowest entry point in the sale structure. This round is designed
                for long-term holders who want discounted exposure plus participation in ecosystem upside.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button type="button" onClick={openCheckout} className="shiny-cta">
                  <span>Join OG Sale ($0.025)</span>
                </button>
                <LinkButton />
              </div>
            </>
          ) : (
            <div className="w-full text-left">
              <SaleCheckoutModule
                account={account}
                bonusAmount={bonusAmount}
                bonusEligibility={bonusEligibility}
                copied={copied}
                isConnecting={isConnecting}
                isPurchasing={isPurchasing}
                minimumUsdt={minimumUsdt}
                notice={notice}
                openWalletModal={() => setShowWalletModal(true)}
                onCopyReferral={copyReferral}
                onDisconnect={disconnectWallet}
                onPurchase={handlePurchase}
                progress={progress}
                receiveAmount={receiveAmount}
                saleInfo={saleInfo}
                tokenPrice={tokenPrice}
                usdtAmount={usdtAmount}
                usdtBalance={usdtBalance}
                setUsdtAmount={setUsdtAmount}
                transactions={transactions}
              />
            </div>
          )}

          <div className="mt-14 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-white/8 bg-white/[0.03] px-6 py-5">
                <div className="text-xs uppercase tracking-[0.18em] text-white/35">{label}</div>
                <div className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</div>
              </div>
            ))}
          </div>
        </SectionShell>
      </PageSection>

      <PageSection className="bg-[#030303]/60 backdrop-blur-xl">
        <SectionShell>
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">Why become an OG?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
              This round is meant for partners who want discounted access and are comfortable aligning with a longer unlock profile.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {reasons.map(([title, description], index) => (
              <SpotlightCard key={title} className="h-full p-7">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#38BDF8]/20 bg-[#38BDF8]/10 text-xl text-[#38BDF8]">
                  {index === 0 ? <HandCoins className="h-6 w-6" /> : null}
                  {index === 1 ? <Percent className="h-6 w-6" /> : null}
                  {index === 2 ? <ShieldEllipsis className="h-6 w-6" /> : null}
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/58">{description}</p>
              </SpotlightCard>
            ))}
          </div>
        </SectionShell>
      </PageSection>

      <PageSection>
        <SectionShell>
          <SpotlightCard id="buy-section" className="p-8 lg:p-10">
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.22em] text-[#38BDF8]">Round Comparison</div>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white">Choose the entry point that fits your strategy.</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                OG Sale Open
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {rounds.map((round) => (
                <div
                  key={round.name}
                  className={`rounded-[28px] border p-6 ${
                    round.featured
                      ? 'border-[#38BDF8]/50 bg-[#38BDF8]/10 shadow-[0_0_40px_rgba(56,189,248,0.12)]'
                      : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <div className="mb-6">
                    <div className={`text-sm font-semibold ${round.featured ? 'text-[#38BDF8]' : 'text-white/70'}`}>{round.name}</div>
                    <div className="mt-2 text-5xl font-semibold tracking-tight text-white">{round.price}</div>
                    <div className="mt-2 text-sm text-white/45">{round.allocation} allocation</div>
                  </div>
                  <div className="space-y-3 border-t border-white/10 pt-5 text-sm text-white/60">
                    <div className="flex items-center justify-between">
                      <span>Discount</span>
                      <span className="font-medium text-white">{round.discount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Lockup</span>
                      <span className="font-medium text-white">{round.lockup}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Vesting</span>
                      <span className="font-medium text-white">{round.vesting}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </SectionShell>
      </PageSection>

      <PageSection className="bg-[#030303]/60 backdrop-blur-xl">
        <SectionShell>
          <SpotlightCard className="p-8 lg:p-10">
            <div className="mx-auto max-w-4xl">
              <div className="text-center">
                <div className="text-xs font-mono uppercase tracking-[0.22em] text-[#38BDF8]">Frequently Asked Questions</div>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">Everything you need before joining the round.</h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
                  Straight answers about the Community OG allocation, network requirements, vesting, and purchase flow.
                </p>
              </div>

              <div className="mt-10 space-y-3">
                {faqItems.map((item, index) => {
                  const open = openFaqIndex === index;
                  return (
                    <div key={item.question} className="rounded-[24px] border border-white/10 bg-white/[0.03]">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(open ? null : index)}
                        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                      >
                        <span className="text-base font-semibold text-white">{item.question}</span>
                        <ChevronDown className={`h-5 w-5 shrink-0 text-white/50 transition-transform ${open ? 'rotate-180' : ''}`} />
                      </button>
                      {open ? (
                        <div className="border-t border-white/10 px-6 py-5 text-sm leading-relaxed text-white/60">
                          {item.answer}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </SpotlightCard>
        </SectionShell>
      </PageSection>

      <PageSection className="bg-[#030303]/60 backdrop-blur-xl">
        <SectionShell>
          <SpotlightCard className="p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.22em] text-[#38BDF8]">Why the 12-month lockup?</div>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">This round is built for partners, not flippers.</h2>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/58">
                  By accepting a 12-month lockup, Community OG participants align themselves with the
                  earliest product expansion phase. In return, they receive the lowest price in the
                  structure, which maximizes upside once vesting begins.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                <div className="text-xs font-mono uppercase tracking-[0.2em] text-white/45">Core logic</div>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/60">
                  <li className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#38BDF8]" />Deepest discount in the sale stack.</li>
                  <li className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#38BDF8]" />Longer lockup to reduce early overhang.</li>
                  <li className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#38BDF8]" />Better alignment with network growth and staking economics.</li>
                </ul>
              </div>
            </div>
          </SpotlightCard>
        </SectionShell>
      </PageSection>

      {showWalletModal ? (
        <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-black/70 px-4 pb-8 pt-28 backdrop-blur-sm sm:pt-32">
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
                <button
                  key={option.label}
                  type="button"
                  onClick={() => connectWallet(option.key)}
                  className="flex items-center gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition-colors hover:bg-white/[0.06]"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${option.tone}`}>
                    {option.icon}
                  </div>
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
    </div>
  );
}

function LinkButton() {
  return (
    <Link
      to="/tokenomics"
      className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-medium text-white/75 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      View Tokenomics
    </Link>
  );
}

function SaleCheckoutModule({
  account,
  bonusAmount,
  bonusEligibility,
  copied,
  isConnecting,
  isPurchasing,
  minimumUsdt,
  notice,
  openWalletModal,
  onCopyReferral,
  onDisconnect,
  onPurchase,
  progress,
  receiveAmount,
  saleInfo,
  tokenPrice,
  usdtAmount,
  usdtBalance,
  setUsdtAmount,
  transactions,
}: {
  account: string;
  bonusAmount: number;
  bonusEligibility: BonusEligibility | null;
  copied: boolean;
  isConnecting: boolean;
  isPurchasing: boolean;
  minimumUsdt: number;
  notice: {tone: 'default' | 'danger' | 'success'; message: string} | null;
  openWalletModal: () => void;
  onCopyReferral: () => void;
  onDisconnect: () => void;
  onPurchase: () => void;
  progress: number;
  receiveAmount: string;
  saleInfo: SaleInfo | null;
  tokenPrice: number;
  usdtAmount: string;
  usdtBalance: string;
  setUsdtAmount: (value: string) => void;
  transactions: TxRecord[];
}) {
  const soldTokens = saleInfo ? parseFloat(saleInfo.totalSold) : 0;
  const soldLabel = `${formatNumber(soldTokens, 0)} EXN`;
  const totalLabel = `${formatNumber(COMMUNITY_TOTAL_TOKENS, 0)} EXN`;
  const remainingLabel = `${formatNumber(Math.max(0, COMMUNITY_TOTAL_TOKENS - soldTokens), 0)} EXN`;
  const matchedBonusRule = bonusEligibility?.matchedRule || null;
  const displayedBonusRule = matchedBonusRule || bonusEligibility?.checkedRules?.[0] || null;

  return (
    <div className="w-full">
      <div className="mx-auto max-w-4xl text-center">
        <Eyebrow>Step 4: Community OG Checkout</Eyebrow>
        <h1 className="mx-auto max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-6xl">
          Welcome to the <span className="text-[#38BDF8] text-glow">inner circle.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/55">
          This is the same sale page, now expanded into the live Community OG checkout. Connect your wallet, review the vesting, and purchase EXN with USDT on BNB Smart Chain.
        </p>
      </div>

      {notice && notice.tone !== 'success' ? (
        <div
          className={`mx-auto mt-8 max-w-4xl rounded-2xl border px-5 py-4 text-sm ${
            notice.tone === 'danger'
              ? 'border-red-400/30 bg-red-400/10 text-red-100'
              : 'border-white/10 bg-white/[0.04] text-white/70'
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      <div className="mx-auto mt-10 grid max-w-[1054px] gap-5 xl:grid-cols-[minmax(0,0.94fr)_minmax(280px,0.66fr)]">
        <SpotlightCard className="p-5 sm:p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-[2rem] font-semibold tracking-tight text-white sm:text-[2.15rem]">Buy EXN</h2>
                <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-[#38BDF8] sm:text-sm">You are purchasing EXN at the Community OG price of $0.0250.</p>
              </div>
              <div className="flex flex-col gap-3 sm:items-end">
                <div className="flex gap-8 text-left sm:text-right">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">Remaining</p>
                    <p className="mt-1 font-mono text-base text-white sm:text-[17px]">{remainingLabel}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">Total</p>
                    <p className="mt-1 font-mono text-base text-white sm:text-[17px]">{totalLabel}</p>
                  </div>
                </div>
                {account ? (
                  <button
                    type="button"
                    onClick={onDisconnect}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    {formatAddress(account)}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={openWalletModal}
                    className="inline-flex items-center gap-2 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-4 py-2 text-[11px] font-semibold text-[#38BDF8] transition-colors hover:bg-[#38BDF8]/15 sm:text-xs"
                  >
                    {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-white/60">
                <span>Sold: <strong className="text-white">{soldLabel}</strong></span>
                <span>{progress.toFixed(2)}%</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
                <div className="h-full rounded-full bg-[#38BDF8] transition-all duration-500" style={{width: `${progress}%`}} />
              </div>
            </div>

            <div className="relative flex flex-col gap-3">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-white/35">
                  <span>You Pay</span>
                  <span>Balance: {account ? `${parseFloat(usdtBalance).toFixed(2)} USDT` : 'Connect wallet'}</span>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="inline-flex min-w-[160px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#26A17B]/20 text-[#26A17B]">
                      <TetherIcon />
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-white">USDT</div>
                      <div className="text-xs uppercase tracking-[0.18em] text-white/30">BEP-20 only</div>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center gap-3">
                    <input
                      type="number"
                      min={minimumUsdt}
                      step="0.01"
                      value={usdtAmount}
                      onChange={(event) => setUsdtAmount(event.target.value)}
                      placeholder={minimumUsdt.toString()}
                      className="w-full bg-transparent text-right text-3xl font-mono text-white outline-none placeholder:text-white/15"
                    />
                    <button
                      type="button"
                      onClick={() => setUsdtAmount(Math.min(10000, parseFloat(usdtBalance) || 0).toString())}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#38BDF8] transition-colors hover:border-[#38BDF8]/30 hover:bg-[#38BDF8]/10"
                    >
                      Max
                    </button>
                  </div>
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#0d1015] text-white/45">
                <ChevronDown className="h-5 w-5 rotate-[-90deg]" />
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-white/35">
                  <span>You Receive</span>
                  <span>Price: ${tokenPrice.toFixed(4)}</span>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="inline-flex min-w-[160px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#38BDF8]/20 text-[#38BDF8]">
                      <img src="/tokenicon.svg" alt="EXN" className="h-5 w-5 object-contain" />
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-white">EXN</div>
                      <div className="text-xs uppercase tracking-[0.18em] text-white/30">Community OG</div>
                    </div>
                  </div>
                  <div className="text-right text-3xl font-mono text-[#38BDF8]">{formatNumber(receiveAmount, 0)}</div>
                </div>
              </div>
            </div>

            {account && bonusEligibility ? (
              <div className={`rounded-2xl border px-4 py-3 text-sm ${
                bonusEligibility.eligible
                  ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100'
                  : 'border-white/10 bg-white/[0.03] text-white/55'
              }`}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold">
                      {bonusEligibility.eligible && matchedBonusRule
                        ? `${matchedBonusRule.watchedTokenSymbol} holder bonus unlocked`
                        : bonusEligibility.settings.enabled
                          ? 'Wallet bonus requirement'
                          : 'Wallet bonus program is paused'}
                    </div>
                    {displayedBonusRule ? (
                      <div className="mt-1 text-xs opacity-75">
                        Balance: {formatNumber(displayedBonusRule.balanceFormatted, 4)} {displayedBonusRule.symbol}.
                        Required: {displayedBonusRule.minimumBalance} {displayedBonusRule.symbol}.
                        Bonus: {displayedBonusRule.bonusValue}%.
                      </div>
                    ) : null}
                  </div>
                  {bonusEligibility.eligible ? (
                    <div className="font-mono text-base font-semibold">
                      +{formatNumber(bonusAmount, 2)} EXN
                    </div>
                  ) : null}
                </div>
                {bonusEligibility.eligible ? (
                  <div className="mt-2 text-xs opacity-75">
                    Bonus EXN is distributed separately by the treasury after on-chain purchase verification.
                  </div>
                ) : null}
              </div>
            ) : null}

            <button
              type="button"
              onClick={onPurchase}
              disabled={isPurchasing || !usdtAmount}
              className="mt-2 inline-flex min-h-14 items-center justify-center rounded-full bg-[#38BDF8] px-8 py-4 text-lg font-semibold text-black shadow-[0_0_35px_rgba(56,189,248,0.22)] transition-colors hover:bg-[#5bc8fb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPurchasing ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </span>
              ) : usdtAmount ? (
                'Purchase with USDT'
              ) : (
                'Enter Amount'
              )}
            </button>

            <p className="text-center text-xs font-mono uppercase tracking-[0.2em] text-white/25">
              BNB Smart Chain only. Minimum purchase: {minimumUsdt} USDT.
            </p>
          </div>
        </SpotlightCard>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <SpotlightCard className="p-5">
            <div className="text-xs font-mono uppercase tracking-[0.22em] text-white/35">Token Price</div>
            <div className="mt-3 text-5xl font-semibold tracking-tight text-white">${tokenPrice.toFixed(4)} <span className="text-base text-white/35">/ EXN</span></div>
          </SpotlightCard>

          <SpotlightCard className="p-5">
            <div className="text-xs font-mono uppercase tracking-[0.22em] text-[#38BDF8]">IDO Price</div>
            <div className="mt-3 text-5xl font-semibold tracking-tight text-[#38BDF8]">$0.060 <span className="text-base text-[#38BDF8]/45">/ EXN</span></div>
          </SpotlightCard>

          <SpotlightCard className="p-5 sm:col-span-2 xl:col-span-1">
            <div className="text-xs font-mono uppercase tracking-[0.22em] text-white/35">Vesting Schedule</div>
            <div className="mt-5 space-y-4 text-sm text-white/70">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span>TGE Unlock</span>
                <span className="font-mono text-white">20%</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span>Cliff Period</span>
                <span className="font-mono text-white">12 Months</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Linear Vesting</span>
                <span className="font-mono text-white">18 Months</span>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-5 sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.22em] text-[#38BDF8]">Recent Transactions</div>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">Latest activity</h3>
              </div>
              <button
                type="button"
                onClick={onCopyReferral}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 transition-colors hover:text-white"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? 'Copied' : 'Share'}
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {transactions.length ? (
                transactions.slice(0, 5).map((tx) => (
                  <div key={tx.hash} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{formatNumber(tx.amount, 0)} EXN</div>
                      <div className="mt-1 text-xs text-white/40">{new Date(tx.timestamp).toLocaleDateString()}</div>
                    </div>
                    <div>
                      {tx.status === 'pending' ? <Loader2 className="h-5 w-5 animate-spin text-[#38BDF8]" /> : null}
                      {tx.status === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : null}
                      {tx.status === 'failed' ? <XCircle className="h-5 w-5 text-red-400" /> : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center text-sm text-white/40">
                  No transactions yet. Once you purchase, your recent activity will appear here.
                </div>
              )}
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}
