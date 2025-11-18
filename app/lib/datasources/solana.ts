import { PublicKey } from '@solana/web3.js';
import { getConnection } from '../solana';
import { DataSourceSignal } from '../types';

/**
 * Solana On-Chain Datasource
 *
 * Fetches wallet activity metrics:
 * - Account age (days since first transaction)
 * - Transaction count
 * - SOL balance
 * - Token account count
 *
 * Scoring formula (0-100):
 * - Account age: (days / 365) * 30  (max 30 points)
 * - Transactions: (count / 1000) * 40  (max 40 points)
 * - Balance: (SOL / 10) * 30  (max 30 points)
 */

export async function fetchSolanaMetrics(wallet: string): Promise<DataSourceSignal> {
  const connection = getConnection();
  const publicKey = new PublicKey(wallet);

  try {
    // 1. Get all transaction signatures
    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit: 1000,
    });

    const txCount = signatures.length;

    // 2. Get account age (first transaction timestamp)
    let accountAgeDays = 0;
    if (signatures.length > 0) {
      const firstTx = signatures[signatures.length - 1];
      if (firstTx.blockTime) {
        const firstTxDate = firstTx.blockTime * 1000; // Convert to ms
        const now = Date.now();
        accountAgeDays = (now - firstTxDate) / (1000 * 60 * 60 * 24);
      }
    }

    // 3. Get SOL balance
    const balance = await connection.getBalance(publicKey);
    const solBalance = balance / 1e9; // Convert lamports to SOL

    // 4. Get token accounts count
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    });
    const tokenCount = tokenAccounts.value.length;

    // Calculate score components
    const ageScore = Math.min((accountAgeDays / 365) * 30, 30);
    const txScore = Math.min((txCount / 1000) * 40, 40);
    const balanceScore = Math.min((solBalance / 10) * 30, 30);

    const rawScore = ageScore + txScore + balanceScore;
    const normalizedScore = Math.min(Math.round(rawScore), 100);

    return {
      source: 'solana',
      raw_score: rawScore,
      normalized_score: normalizedScore,
      metadata: {
        account_age_days: Math.round(accountAgeDays),
        transaction_count: txCount,
        sol_balance: solBalance.toFixed(4),
        token_accounts: tokenCount,
        breakdown: {
          age_score: ageScore.toFixed(2),
          tx_score: txScore.toFixed(2),
          balance_score: balanceScore.toFixed(2),
        },
      },
      fetched_at: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching Solana metrics:', error);
    // Return default score on error
    return {
      source: 'solana',
      raw_score: 0,
      normalized_score: 0,
      metadata: { error: 'Failed to fetch Solana data' },
      fetched_at: Date.now(),
    };
  }
}
