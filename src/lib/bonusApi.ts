export type BonusRule = {
  id: string;
  enabled: boolean;
  assetType: 'native' | 'erc20';
  watchedTokenAddress: string;
  watchedTokenSymbol: string;
  tokenName?: string;
  minimumBalance: string;
  bonusMode: 'percent' | 'fixed';
  bonusValue: string;
};

export type BonusSettings = {
  enabled: boolean;
  strategy?: 'best' | 'first';
  defaultBonusRulesVersion?: number;
  bonusRules: BonusRule[];
  assetType: 'native' | 'erc20';
  watchedTokenAddress: string;
  watchedTokenSymbol: string;
  minimumBalance: string;
  bonusMode: 'percent' | 'fixed';
  bonusValue: string;
  updatedAt?: string;
  updatedBy?: string;
};

export type BonusRuleCheck = BonusRule & {
  ruleId: string;
  eligible: boolean;
  balanceRaw: string;
  balanceFormatted: string;
  decimals: number;
  symbol: string;
  minimumRaw: string;
};

export type BonusEligibility = {
  eligible: boolean;
  matchedRule?: BonusRuleCheck | null;
  checkedRules?: BonusRuleCheck[];
  balanceRaw: string;
  balanceFormatted: string;
  decimals: number;
  symbol: string;
  minimumRaw: string;
  settings: BonusSettings;
};

export type BonusClaim = {
  id: string;
  purchaseTxHash: string;
  purchaseBlock: number;
  buyer: string;
  roundId: string;
  baseTokenFormatted: string;
  bonusFormatted: string;
  eligibility: BonusEligibility;
  ruleSnapshot: BonusSettings & {matchedRule?: BonusRuleCheck | null};
  status: 'eligible' | 'ineligible' | 'awaiting_signature' | 'paid' | 'payout_failed';
  bonusTxHash: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BonusDashboard = {
  settings: BonusSettings;
  claims: BonusClaim[];
  balances: {
    bnb: string;
    exn: string;
  };
  contracts: {
    treasury: string;
    exnToken: string;
    saleContract: string;
  };
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/bonus${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Bonus API request failed (${response.status})`);
  }
  return payload as T;
}

export function getPublicBonusSettings() {
  return request<BonusSettings>('/public/settings');
}

export function checkBonusEligibility(wallet: string) {
  return request<BonusEligibility>('/public/check', {
    method: 'POST',
    body: JSON.stringify({wallet}),
  });
}

export function registerBonusClaim(txHash: string) {
  return request<BonusClaim>('/public/claims', {
    method: 'POST',
    body: JSON.stringify({txHash}),
  });
}

export function requestAdminNonce(address: string) {
  return request<{message: string; expiresAt: string}>('/auth/nonce', {
    method: 'POST',
    body: JSON.stringify({address}),
  });
}

export function verifyAdminSignature(address: string, signature: string) {
  return request<{authenticated: boolean; address: string; treasury: string}>('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({address, signature}),
  });
}

export function getAdminSession() {
  return request<{authenticated: boolean; address: string; treasury: string}>('/admin/me');
}

export function logoutAdmin() {
  return request<{ok: true}>('/auth/logout', {method: 'POST'});
}

export function getBonusDashboard() {
  return request<BonusDashboard>('/admin/dashboard');
}

export function updateBonusSettings(settings: BonusSettings) {
  return request<BonusSettings>('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

export function prepareBonusPayout(claimId: string) {
  return request<{
    claimId: string;
    chainId: string;
    from: string;
    to: string;
    data: string;
    value: string;
    buyer: string;
    bonusFormatted: string;
  }>(`/admin/claims/${claimId}/prepare`, {method: 'POST'});
}

export function confirmBonusPayout(claimId: string, txHash: string) {
  return request<BonusClaim>(`/admin/claims/${claimId}/confirm`, {
    method: 'POST',
    body: JSON.stringify({txHash}),
  });
}

export function resetBonusClaim(claimId: string) {
  return request<BonusClaim>(`/admin/claims/${claimId}/reset`, {method: 'POST'});
}
