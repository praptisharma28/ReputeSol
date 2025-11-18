import type { Metadata } from 'next';
import './globals.css';
import { AppWalletProvider } from '../components/WalletProvider';

export const metadata: Metadata = {
  title: 'ReputeSol - On-Chain Reputation for Solana',
  description: 'Decentralized reputation system built on Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black min-h-screen">
        <AppWalletProvider>
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}
