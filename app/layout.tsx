import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agentwerke — Custom Claude Agents for Small Business',
  description:
    'We build custom Claude agents that handle the office work draining your team. Live in 2 weeks, $12K + $1K/mo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-zinc-900">{children}</body>
    </html>
  );
}
