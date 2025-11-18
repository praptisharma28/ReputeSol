use anchor_lang::prelude::*;
use crate::state::UserAccount;
use crate::errors::ErrorCode;
use crate::constants::{AUTHORITY, GITCOIN_WEIGHT, SOLANA_WEIGHT};

//update a user's reputation scores
pub fn update_score(
    ctx: Context<UpdateScore>,
    gitcoin_score: u16,
    solana_score: u16,
) -> Result<()>{
    // validate scores are in valid range
    require!(gitcoin_score <= 100, ErrorCode::InvalidScore);
    require!(solana_score<= 100, ErrorCode::InvalidScore);

    let user_account = &mut ctx.accounts.user_account;
    let clock = Clock::get()?;
    user_account.gitcoin_score = gitcoin_score;
    user_account.solana_score = solana_score;

    // total
    user_account.total_score= (gitcoin_score as u64 * GITCOIN_WEIGHT) + (solana_score as u64 * SOLANA_WEIGHT);
    user_account.last_updated = clock.unix_timestamp;
    msg!("Score updated for: {}", user_account.owner);
    msg!("gitcoin: {}, solana: {}, total: {}", gitcoin_score, solana_score, user_account.total_score);
    Ok(())
}

#[derive(Accounts)]
pub struct UpdateScore<'info>{
    #[account(
        mut,
        seeds = [b"user", user_account.owner.key().as_ref()],
        bump = user_account.bump,
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(
        constraint = authority.key() == AUTHORITY @ ErrorCode::Unauthorized
    )]
    pub authority: Signer<'info>,
}