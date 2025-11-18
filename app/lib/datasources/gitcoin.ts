import axios from 'axios';
import { DataSourceSignal } from '../types';

/**
 * Gitcoin Passport Datasource
 *
 * Fetches Gitcoin Passport score for a wallet.
 * Gitcoin Passport is a sybil-resistance tool that verifies
 * human uniqueness through various "stamps" (connected accounts).
 *
 * Score is already 0-100, so no normalization needed.
 *
 * API Docs: https://docs.passport.gitcoin.co/
 * Get API key: https://scorer.gitcoin.co/
 */

const GITCOIN_API_URL = 'https://api.scorer.gitcoin.co';

export async function fetchGitcoinScore(wallet: string): Promise<DataSourceSignal> {
  const apiKey = process.env.GITCOIN_API_KEY;
  const scorerId = process.env.GITCOIN_SCORER_ID;

  // If API key not configured, return 0
  if (!apiKey || !scorerId) {
    console.warn('Gitcoin API key not configured, returning default score');
    return {
      source: 'gitcoin',
      raw_score: 0,
      normalized_score: 0,
      metadata: { error: 'API key not configured' },
      fetched_at: Date.now(),
    };
  }

  try {
    // Fetch score from Gitcoin API
    const response = await axios.get(
      `${GITCOIN_API_URL}/registry/score/${scorerId}/${wallet}`,
      {
        headers: {
          'X-API-Key': apiKey,
        },
      }
    );

    const score = response.data.score || 0;
    const evidence = response.data.evidence || {};

    return {
      source: 'gitcoin',
      raw_score: score,
      normalized_score: Math.min(Math.round(score), 100),
      metadata: {
        passport_address: response.data.address,
        stamp_scores: evidence.rawScore || null,
        threshold: evidence.threshold || null,
        stamps_count: Object.keys(evidence).length,
      },
      fetched_at: Date.now(),
    };
  } catch (error: any) {
    console.error('Error fetching Gitcoin score:', error.message);

    // If user doesn't have a passport, return 0
    if (error.response?.status === 404) {
      return {
        source: 'gitcoin',
        raw_score: 0,
        normalized_score: 0,
        metadata: { error: 'No Gitcoin Passport found for this wallet' },
        fetched_at: Date.now(),
      };
    }

    // Other errors - return 0
    return {
      source: 'gitcoin',
      raw_score: 0,
      normalized_score: 0,
      metadata: { error: 'Failed to fetch Gitcoin data' },
      fetched_at: Date.now(),
    };
  }
}
