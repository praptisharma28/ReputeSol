import { NextRequest, NextResponse } from 'next/server';
import { aggregateReputationData } from '@/lib/scoring';
import { updateUserScore } from '@/lib/program-service';

/**
 * POST /api/score/update
 *
 * Main endpoint that orchestrates the full reputation update flow:
 * 1. Fetch data from Gitcoin + Solana
 * 2. Aggregate and normalize scores
 * 3. Update on-chain PDA via Solana program
 *
 * Request body:
 * {
 *   "wallet": "user_wallet_address"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "transaction": "signature",
 *   "scores": { gitcoin: 75, solana: 60 }
 * }
 */

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { wallet } = body;

    console.log(`[API] POST /api/score/update for wallet: ${wallet}`);

    // Validate wallet
    if (!wallet || typeof wallet !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid wallet address' },
        { status: 400 }
      );
    }

    // Step 1: Fetch and aggregate data from all sources
    console.log('[API] Step 1: Fetching reputation data...');
    const aggregatedData = await aggregateReputationData(wallet);

    const gitcoinScore = aggregatedData.gitcoinScore;
    const solanaScore = aggregatedData.solanaScore;

    console.log(`[API] Aggregated scores - Gitcoin: ${gitcoinScore}, Solana: ${solanaScore}`);

    // Step 2: Update on-chain via Solana program
    console.log('[API] Step 2: Updating on-chain score...');
    const txSignature = await updateUserScore(wallet, gitcoinScore, solanaScore);

    console.log(`[API] Success! Transaction: ${txSignature}`);

    // Return success response
    return NextResponse.json({
      success: true,
      transaction: txSignature,
      scores: {
        gitcoin: gitcoinScore,
        solana: solanaScore,
        total: gitcoinScore * 50 + solanaScore * 50, // Weighted total (matches on-chain)
      },
      breakdown: {
        gitcoin: aggregatedData.gitcoin,
        solana: aggregatedData.solana,
      },
      explorer_url: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
    });
  } catch (error: any) {
    console.error('[API] Error updating score:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update score',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
