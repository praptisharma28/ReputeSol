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

    pub fn initialize(ctx: Context<InitializeUser>) -> Result<()> {
        instructions::initialize_user(ctx)
    }
    pub fn update_score(
        ctx: Context<UpdateScore>,
        gitcoin_score: u16,
        solana_core: u16,
    ) -> Result<()> {
        instructions::update_score(ctx, gitcoin_score, solana_core)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
