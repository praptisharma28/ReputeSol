'use client';

/**
 * ScoreCard Component
 *
 * Displays the main reputation score in a large, prominent way
 * Black background, white text for emphasis
 */

import { Badge } from './Badge';

interface ScoreCardProps {
  score: number;
  maxScore: number;
}

export function ScoreCard({ score, maxScore }: ScoreCardProps) {
  // Convert from 0-10000 scale to 0-100 display
  const displayScore = (score / 100).toFixed(2);
  const percentage = ((score / maxScore) * 100).toFixed(1);

  return (
    <div className="bg-black text-white p-12 rounded-lg text-center">
      <h2 className="text-sm uppercase tracking-wide mb-4 opacity-70">
        Your Reputation Score
      </h2>
      <div className="text-8xl font-bold mb-2">{displayScore}</div>
      <div className="text-xl opacity-70">out of 100</div>

      <div className="mt-6 flex justify-center">
        <Badge score={score / 100} size="lg" />
      </div>

      <div className="mt-8 flex justify-center gap-4 text-sm">
        <div>
          <span className="opacity-70">Percentile:</span> <strong>{percentage}%</strong>
        </div>
      </div>
    </div>
  );
}
