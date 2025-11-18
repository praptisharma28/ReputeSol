'use client';

/**
 * Dashboard Page
 *
 * Main page showing user's reputation score
 * - Connects wallet
 * - Fetches score from API
 * - Shows score + breakdown
 * - Refresh button to update
 */

import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ScoreCard } from '@/components/ScoreCard';
import { ScoreBreakdown } from '@/components/ScoreBreakdown';

interface ScoreData {
  total_score: number;
  gitcoin_score: number;
  solana_score: number;
  last_updated: number;
  last_updated_date: string;
}

export default function DashboardPage() {
  const { publicKey, connected } = useWallet();
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch score when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchScore();
    }
  }, [connected, publicKey]);

  // Fetch current score from API
  const fetchScore = async () => {
    if (!publicKey) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/score/${publicKey.toString()}`);

      if (response.status === 404) {
        // User not initialized yet
        setError('No score found. Click "Refresh Score" to calculate your reputation.');
        setScoreData(null);
      } else if (response.ok) {
        const data = await response.json();
        setScoreData(data);
      } else {
        setError('Failed to fetch score');
      }
    } catch (err) {
      setError('Error fetching score');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update score (fetch new data + update on-chain)
  const updateScore = async () => {
    if (!publicKey) return;

    setUpdating(true);
    setError(null);

    try {
      const response = await fetch('/api/score/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: publicKey.toString() }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Fetch updated score
        await fetchScore();
        alert(`Score updated! Transaction: ${data.transaction.slice(0, 8)}...`);
      } else {
        setError(data.error || 'Failed to update score');
      }
    } catch (err) {
      setError('Error updating score');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  // Not connected
  if (!connected) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
          <p className="text-xl text-gray-600">
            Connect your wallet to view your reputation score
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <button
            onClick={updateScore}
            disabled={updating}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {updating ? 'Updating...' : 'Refresh Score'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-24">
            <div className="text-2xl">Loading...</div>
          </div>
        ) : scoreData ? (
          <div className="space-y-8">
            <ScoreCard score={scoreData.total_score} maxScore={10000} />
            <ScoreBreakdown
              gitcoinScore={scoreData.gitcoin_score}
              solanaScore={scoreData.solana_score}
            />

            <div className="text-sm text-gray-500 text-center">
              Last updated: {new Date(scoreData.last_updated_date).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-xl text-gray-600 mb-6">
              No score calculated yet
            </p>
            <button
              onClick={updateScore}
              disabled={updating}
              className="bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {updating ? 'Calculating...' : 'Calculate My Score'}
            </button>
          </div>
        )}
      </main>
    </>
  );
}
