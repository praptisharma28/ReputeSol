use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode{
    #[msg("Unauthorized: Only the authoity wallet can update scores")]
Unauthorized,
#[msg("Invalid score, score must be between 0 and 100")]
InvalidScore,}