import { NextRequest, NextResponse } from 'next/server';
import { getUserScore } from '@/lib/program-service';

/**
 * GET /api/score/[wallet]
 *
 * Fetch the current reputation score for a wallet from on-chain PDA.
 *
 * Returns:
 * - User's total score
 * - Breakdown (gitcoin + solana scores)
 * - Last updated timestamp
 *
 * Example: GET /api/score/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const { wallet } = await params;

    console.log(`[API] GET /api/score/${wallet}`);

    // Validate wallet address (basic check)
    if (!wallet || wallet.length < 32) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Fetch score from on-chain PDA
    const scoreData = await getUserScore(wallet);

    if (!scoreData) {
      // User account not initialized yet
      return NextResponse.json(
        {
          wallet,
          initialized: false,
          message: 'User account not found. Call /api/score/update to initialize.',
        },
        { status: 404 }
      );
    }

    // Return score data
    return NextResponse.json({
      wallet: scoreData.owner,
      total_score: scoreData.totalScore,
      gitcoin_score: scoreData.gitcoinScore,
      solana_score: scoreData.solanaScore,
      last_updated: scoreData.lastUpdated,
      last_updated_date: new Date(scoreData.lastUpdated * 1000).toISOString(),
    });
  } catch (error: any) {
    console.error('[API] Error fetching score:', error);
    return NextResponse.json(
      { error: 'Failed to fetch score', details: error.message },
      { status: 500 }
    );
  }
}
