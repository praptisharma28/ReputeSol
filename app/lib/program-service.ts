import { PublicKey, SystemProgram } from '@solana/web3.js';
import { getProgram, getUserPDA, userAccountExists } from './solana';
import { UserAccountData } from './types';

/**
 * Program Service
 *
 * Handles interactions with the deployed Solana program.
 * - Initialize new user accounts
 * - Update reputation scores
 * - Read current scores
 */

/**
 * Initialize a user account (create PDA)
 * This must be called before update_score
 */
export async function initializeUserAccount(walletAddress: string): Promise<string> {
  console.log(`[Program] Initializing user account for: ${walletAddress}`);

  const { program, authority } = await getProgram();
  const wallet = new PublicKey(walletAddress);
  const [userPDA] = getUserPDA(wallet);

  // Check if already exists
  const exists = await userAccountExists(wallet);
  if (exists) {
    console.log(`[Program] User account already exists`);
    return 'already_exists';
  }

  try {
    // Call initialize_user instruction
    const tx = await program.methods
      .initializeUser()
      .accounts({
        userAccount: userPDA,
        owner: wallet,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log(`[Program] User initialized. Tx: ${tx}`);
    return tx;
  } catch (error) {
    console.error('[Program] Error initializing user:', error);
    throw error;
  }
}

/**
 * Update user's reputation scores on-chain
 * Calls the update_score instruction
 *
 * @param walletAddress - User's wallet
 * @param gitcoinScore - Gitcoin score (0-100)
 * @param solanaScore - Solana on-chain score (0-100)
 */
export async function updateUserScore(
  walletAddress: string,
  gitcoinScore: number,
  solanaScore: number
): Promise<string> {
  console.log(
    `[Program] Updating score for ${walletAddress}: Gitcoin=${gitcoinScore}, Solana=${solanaScore}`
  );

  const { program, authority } = await getProgram();
  const wallet = new PublicKey(walletAddress);
  const [userPDA] = getUserPDA(wallet);

  // Ensure account exists first
  const exists = await userAccountExists(wallet);
  if (!exists) {
    console.log(`[Program] Account doesn't exist, initializing first...`);
    await initializeUserAccount(walletAddress);
  }

  try {
    // Call update_score instruction
    // Authority must sign this (backend wallet)
    const tx = await program.methods
      .updateScore(gitcoinScore, solanaScore)
      .accounts({
        userAccount: userPDA,
        authority: authority.publicKey,
      })
      .rpc();

    console.log(`[Program] Score updated. Tx: ${tx}`);
    return tx;
  } catch (error) {
    console.error('[Program] Error updating score:', error);
    throw error;
  }
}

/**
 * Read user's current score from on-chain PDA
 */
export async function getUserScore(walletAddress: string): Promise<UserAccountData | null> {
  console.log(`[Program] Fetching score for: ${walletAddress}`);

  const { program } = await getProgram();
  const wallet = new PublicKey(walletAddress);
  const [userPDA] = getUserPDA(wallet);

  try {
    const accountData = await program.account.userAccount.fetch(userPDA);

    return {
      owner: accountData.owner.toString(),
      totalScore: accountData.totalScore.toNumber(),
      gitcoinScore: accountData.gitcoinScore,
      solanaScore: accountData.solanaScore,
      lastUpdated: accountData.lastUpdated.toNumber(),
      bump: accountData.bump,
    };
  } catch (error) {
    console.log(`[Program] Account not found or error fetching`);
    return null;
  }
}
