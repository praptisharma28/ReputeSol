'use client';

/**
 * Header Component
 *
 * Shows logo and wallet connect button
 * Black and white minimalist design
 */

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-black">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-70 transition">
          ReputeSol
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="hover:opacity-70 transition">
            Dashboard
          </Link>
          <WalletMultiButton className="!bg-black !hover:bg-gray-800" />
        </nav>
      </div>
    </header>
  );
}
