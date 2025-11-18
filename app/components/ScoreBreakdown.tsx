'use client';

/**
 * ScoreBreakdown Component
 *
 * Shows individual scores from each datasource
 * With progress bars for visual clarity
 */

interface ScoreBreakdownProps {
  gitcoinScore: number;
  solanaScore: number;
}

export function ScoreBreakdown({ gitcoinScore, solanaScore }: ScoreBreakdownProps) {
  return (
    <div className="border border-black p-8 rounded-lg">
      <h3 className="text-2xl font-bold mb-6">Score Breakdown</h3>

      {/* Gitcoin */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Gitcoin Passport</span>
          <span className="font-mono">{gitcoinScore}/100</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className="bg-black h-full transition-all duration-500"
            style={{ width: `${gitcoinScore}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Identity verification & sybil resistance
        </p>
      </div>

      {/* Solana */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Solana On-Chain</span>
          <span className="font-mono">{solanaScore}/100</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className="bg-black h-full transition-all duration-500"
            style={{ width: `${solanaScore}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Wallet activity, age, and holdings
        </p>
      </div>

      {/* Weights */}
      <div className="mt-6 pt-6 border-t border-gray-300 text-sm text-gray-600">
        <p>Weights: Gitcoin 50% • Solana 50%</p>
      </div>
    </div>
  );
}
