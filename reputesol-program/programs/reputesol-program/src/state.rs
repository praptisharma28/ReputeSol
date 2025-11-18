use anchor_lang::prelude::*;

// User reputation account stored in a PDA
// Seeds: [b"user", ownder.key()]
#[account]
pub struct UserAccount{
    // wallet that owns this reputatuon account
    pub owner: Pubkey,
    pub total_score: u64,
    pub gitcoin_score: u16,
    pub solana_score: u16,
    pub last_updated:i64,
    pub bump:u8,
}

impl UserAccount{
    // 8 + 32[owner] + 8(total) + 2(gitcoin)+ 2(Solana) + 8(timestamp) +1 (bump)
    pub const LEN: usize = 8 + 32+8 + 2+ 2+ 8+1;
}