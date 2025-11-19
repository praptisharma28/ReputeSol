'use client';

import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { useState } from 'react';

interface WalletScore {
  wallet: string;
  total_score: number;
  gitcoin_score: number;
  solana_score: number;
  breakdown?: any;
}

export default function Compare() {
  const [wallet1, setWallet1] = useState('');
  const [wallet2, setWallet2] = useState('');
  const [score1, setScore1] = useState<WalletScore | null>(null);
  const [score2, setScore2] = useState<WalletScore | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchScore = async (wallet: string): Promise<WalletScore | null> => {
    try {
      const res = await fetch(`/api/score/${wallet}`);
      if (!res.ok) return null;
      const data = await res.json();
      return {
        wallet,
        total_score: data.total_score || 0,
        gitcoin_score: data.gitcoin_score || 0,
        solana_score: data.solana_score || 0,
      };
    } catch {
      return null;
    }
  };

  const handleCompare = async () => {
    if (!wallet1 || !wallet2) return;
    setLoading(true);
    const [s1, s2] = await Promise.all([
      fetchScore(wallet1),
      fetchScore(wallet2),
    ]);
    setScore1(s1);
    setScore2(s2);
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">Compare Wallets</h1>
          <p className="text-xl text-gray-600">
            Compare reputation scores between two wallets
          </p>
        </div>

        <div className="bg-white border-2 border-black rounded-lg p-8 mb-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold mb-2">Wallet 1</label>
              <input
                type="text"
                value={wallet1}
                onChange={(e) => setWallet1(e.target.value)}
                placeholder="Enter wallet address..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Wallet 2</label>
              <input
                type="text"
                value={wallet2}
                onChange={(e) => setWallet2(e.target.value)}
                placeholder="Enter wallet address..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleCompare}
            disabled={loading || !wallet1 || !wallet2}
            className="w-full bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Compare'}
          </button>
        </div>

        {score1 && score2 && (
          <div className="grid grid-cols-2 gap-6">
            <WalletCard score={score1} />
            <WalletCard score={score2} />
          </div>
        )}
      </main>
    </>
  );
}

function WalletCard({ score }: { score: WalletScore }) {
  return (
    <div className="bg-white border-2 border-black rounded-lg p-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Wallet</p>
        <p className="font-mono text-sm break-all">{score.wallet}</p>
      </div>

      <div className="mb-6">
        <Badge score={score.total_score} size="lg" />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Total Score</p>
          <p className="text-4xl font-bold">{score.total_score}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Gitcoin</p>
            <p className="text-2xl font-bold text-blue-600">
              {score.gitcoin_score}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Solana</p>
            <p className="text-2xl font-bold text-purple-600">
              {score.solana_score}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
