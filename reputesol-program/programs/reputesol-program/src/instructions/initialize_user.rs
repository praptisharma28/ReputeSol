use anchor_lang::prelude::*;
use crate::state::UserAccount;

//intialize a new reputation account for a user
pub fn initialize_user(ctx: Context<InitializeUser>)-> Result<()>{
    let user_account = &mut ctx.accounts.user_account;
    let clock = Clock::get()?;
    user_account.owner = ctx.accounts.owner.key();
    user_account.total_score = 0;
    user_account.gitcoin_score=0;
    user_account.solana_score=0;
    user_account.last_updated = clock.unix_timestamp;
    user_account.bump= ctx.bumps.user_account;

    msg!("User account initialized for: {}", user_account.owner);
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeUser<'info>{
    #[account(
        init,
        payer = owner,
        space = UserAccount::LEN,
        seeds = [b"user", owner.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}