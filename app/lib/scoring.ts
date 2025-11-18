import { fetchGitcoinScore } from './datasources/gitcoin';
import { fetchSolanaMetrics } from './datasources/solana';
import { DataSourceSignal } from './types';

/**
 * Scoring Service
 *
 * Orchestrates fetching data from all sources and aggregating scores.
 *
 * Process:
 * 1. Fetch from both datasources in parallel (faster!)
 * 2. Extract normalized scores (already 0-100)
 * 3. Return breakdown for transparency
 *
 * Both scores are already normalized to 0-100 scale.
 * The final weighted calculation happens on-chain in the Solana program.
 */

export interface AggregatedScore {
  gitcoin: DataSourceSignal;
  solana: DataSourceSignal;
  gitcoinScore: number;  // 0-100
  solanaScore: number;   // 0-100
}

/**
 * Fetch and aggregate reputation data from all sources
 */
export async function aggregateReputationData(wallet: string): Promise<AggregatedScore> {
  console.log(`[Scoring] Fetching reputation data for wallet: ${wallet}`);

  // Fetch from both sources in parallel using Promise.allSettled
  // allSettled = won't fail if one source fails
  const [gitcoinResult, solanaResult] = await Promise.allSettled([
    fetchGitcoinScore(wallet),
    fetchSolanaMetrics(wallet),
  ]);

  // Extract data or use default if failed
  const gitcoin: DataSourceSignal =
    gitcoinResult.status === 'fulfilled'
      ? gitcoinResult.value
      : {
          source: 'gitcoin',
          raw_score: 0,
          normalized_score: 0,
          metadata: { error: 'Failed to fetch' },
          fetched_at: Date.now(),
        };

  const solana: DataSourceSignal =
    solanaResult.status === 'fulfilled'
      ? solanaResult.value
      : {
          source: 'solana',
          raw_score: 0,
          normalized_score: 0,
          metadata: { error: 'Failed to fetch' },
          fetched_at: Date.now(),
        };

  console.log(`[Scoring] Gitcoin score: ${gitcoin.normalized_score}`);
  console.log(`[Scoring] Solana score: ${solana.normalized_score}`);

  return {
    gitcoin,
    solana,
    gitcoinScore: Math.round(gitcoin.normalized_score),
    solanaScore: Math.round(solana.normalized_score),
  };
}
