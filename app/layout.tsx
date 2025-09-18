import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'LoveBoba - Find Your Perfect Match',
  description: 'A cute and playful dating app with boba tea vibes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* Floating decorative elements */}
            <div className="floating-heart absolute top-20 left-10 text-pink-300 text-2xl">💖</div>
            <div className="floating-boba absolute top-32 right-16 text-purple-300 text-3xl">🧋</div>
            <div className="floating-heart absolute top-64 left-1/4 text-green-300 text-xl">💕</div>
            <div className="floating-boba absolute bottom-32 right-1/3 text-pink-300 text-2xl">🧋</div>
            <div className="floating-heart absolute bottom-20 left-16 text-purple-300 text-xl">💋</div>
          </div>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}