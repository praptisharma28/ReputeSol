'use client';

import { getBadgeForScore } from '@/lib/badges';

interface BadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({ score, size = 'md' }: BadgeProps) {
  const badge = getBadgeForScore(score);

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-xl',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${badge.color} text-white font-bold ${sizeClasses[size]}`}
    >
      <span>{badge.icon}</span>
      <span>{badge.name}</span>
    </div>
  );
}
