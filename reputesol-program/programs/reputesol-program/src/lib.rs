use anchor_lang::prelude::*;

declare_id!("3jSgCkDsvWqaffHHy3wKJ6jYqXo2zxhVbg81gUbMhwgL");

#[program]
pub mod reputesol_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
