'use client';

import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  wallet: string;
  total_score: number;
  gitcoin_score: number;
  solana_score: number;
  last_updated: string;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demo - in production, fetch from API
    const mockData: LeaderboardEntry[] = [
      {
        wallet: '79xE...ou6w',
        total_score: 85,
        gitcoin_score: 45,
        solana_score: 40,
        last_updated: new Date().toISOString(),
      },
      {
        wallet: 'HUCu...Pou6',
        total_score: 72,
        gitcoin_score: 38,
        solana_score: 34,
        last_updated: new Date().toISOString(),
      },
      {
        wallet: 'GWdz...WBaR',
        total_score: 58,
        gitcoin_score: 30,
        solana_score: 28,
        last_updated: new Date().toISOString(),
      },
      {
        wallet: 'Abc1...xyz9',
        total_score: 45,
        gitcoin_score: 25,
        solana_score: 20,
        last_updated: new Date().toISOString(),
      },
      {
        wallet: 'Def2...uvw8',
        total_score: 32,
        gitcoin_score: 18,
        solana_score: 14,
        last_updated: new Date().toISOString(),
      },
    ];

    setTimeout(() => {
      setLeaderboard(mockData);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">Reputation Leaderboard</h1>
          <p className="text-xl text-gray-600">
            Top reputation holders on Solana
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse">Loading leaderboard...</div>
          </div>
        ) : (
          <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-black">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Rank</th>
                  <th className="px-6 py-4 text-left font-bold">Wallet</th>
                  <th className="px-6 py-4 text-left font-bold">Badge</th>
                  <th className="px-6 py-4 text-right font-bold">Total Score</th>
                  <th className="px-6 py-4 text-right font-bold">Gitcoin</th>
                  <th className="px-6 py-4 text-right font-bold">Solana</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr
                    key={entry.wallet}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <span className="text-2xl font-bold text-gray-400">
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {entry.wallet}
                    </td>
                    <td className="px-6 py-4">
                      <Badge score={entry.total_score} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-2xl">
                      {entry.total_score}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {entry.gitcoin_score}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {entry.solana_score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 text-center text-gray-600">
          <p>Updated every 5 minutes • {leaderboard.length} total entries</p>
        </div>
      </main>
    </>
  );
}
