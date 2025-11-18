/**
 * Landing Page
 *
 * Hero section with CTA to dashboard
 */

import { Header } from '@/components/Header';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 py-32 text-center">
          <h1 className="text-7xl font-bold mb-6 leading-tight">
            On-Chain Reputation
            <br />
            for Solana
          </h1>

          <p className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Build your decentralized reputation score based on Gitcoin Passport and Solana activity
          </p>

          <Link
            href="/dashboard"
            className="inline-block bg-black text-white px-12 py-5 rounded-lg text-xl font-semibold hover:bg-gray-800 transition"
          >
            View Dashboard →
          </Link>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-24 border-t border-black">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-3">Sybil Resistant</h3>
              <p className="text-gray-600">
                Gitcoin Passport verification ensures unique human identity
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3">On-Chain Activity</h3>
              <p className="text-gray-600">
                Your Solana wallet history, age, and holdings contribute to your score
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3">Transparent & Verifiable</h3>
              <p className="text-gray-600">
                All scores stored on-chain in a PDA. Anyone can verify
              </p>
            </div>
          </div>
        </section>

        {/* Technical Info */}
        <section className="max-w-6xl mx-auto px-6 py-24 border-t border-black">
          <div className="bg-gray-100 p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Technical Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
              <div>
                <span className="text-gray-600">Program ID:</span><br/>
                <span className="break-all">3jSgCkDsvWqaffHHy3wKJ6jYqXo2zxhVbg81gUbMhwgL</span>
              </div>
              <div>
                <span className="text-gray-600">Network:</span><br/>
                Devnet
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
