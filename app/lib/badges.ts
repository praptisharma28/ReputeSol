/**
 * Reputation Badge System
 */

export type BadgeTier = 'unranked' | 'bronze' | 'silver' | 'gold' | 'diamond';

export interface Badge {
  tier: BadgeTier;
  name: string;
  minScore: number;
  color: string;
  icon: string;
}

export const BADGES: Badge[] = [
  {
    tier: 'diamond',
    name: 'Diamond',
    minScore: 80,
    color: 'from-cyan-400 to-blue-500',
    icon: '💎',
  },
  {
    tier: 'gold',
    name: 'Gold',
    minScore: 60,
    color: 'from-yellow-400 to-yellow-600',
    icon: '🏆',
  },
  {
    tier: 'silver',
    name: 'Silver',
    minScore: 40,
    color: 'from-gray-300 to-gray-500',
    icon: '🥈',
  },
  {
    tier: 'bronze',
    name: 'Bronze',
    minScore: 20,
    color: 'from-orange-400 to-orange-600',
    icon: '🥉',
  },
  {
    tier: 'unranked',
    name: 'Unranked',
    minScore: 0,
    color: 'from-gray-500 to-gray-700',
    icon: '⚪',
  },
];

export function getBadgeForScore(score: number): Badge {
  for (const badge of BADGES) {
    if (score >= badge.minScore) {
      return badge;
    }
  }
  return BADGES[BADGES.length - 1];
}
