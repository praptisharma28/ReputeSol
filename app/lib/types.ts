// Types for the ReputeSol backend

/**
 * DataSourceSignal: Raw data from a single source (Gitcoin or Solana)
 * - raw_score: The original value from the API
 * - normalized_score: Converted to 0-100 scale
 * - metadata: Extra info like transaction count, account age, etc.
 */
export interface DataSourceSignal {
  source: string;
  raw_score: number;
  normalized_score: number;
  metadata?: Record<string, any>;
  fetched_at: number;
}

/**
 * ReputationScore: The complete score object returned by our API
 * Used by frontend to display user's reputation
 */
export interface ReputationScore {
  wallet: string;
  total_score: number;          // 0-10000 (scaled by 100)
  gitcoin_score: number;         // 0-100
  solana_score: number;          // 0-100
  last_updated: number;
  breakdown: {
    gitcoin: DataSourceSignal;
    solana: DataSourceSignal;
  };
}

/**
 * UserAccountData: Matches the on-chain PDA structure
 * This is what we read from the Solana program
 */
export interface UserAccountData {
  owner: string;
  totalScore: number;
  gitcoinScore: number;
  solanaScore: number;
  lastUpdated: number;
  bump: number;
}
