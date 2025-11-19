use anchor_lang::prelude::*;

pub mod state;
pub mod errors;
pub mod constants;
pub mod instructions;

use instructions::*;

declare_id!("3jSgCkDsvWqaffHHy3wKJ6jYqXo2zxhVbg81gUbMhwgL");

#[program]
pub mod reputesol_program {
    use super::*;

    /// Initialize a new user reputation account
    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        instructions::initialize_user(ctx)
    }

    /// Update a user's reputation scores (authority only)
    pub fn update_score(
        ctx: Context<UpdateScore>,
        gitcoin_score: u16,
        solana_score: u16,
    ) -> Result<()> {
        instructions::update_score(ctx, gitcoin_score, solana_score)
    }
}
