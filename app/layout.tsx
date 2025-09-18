import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Boba and Kiss - Find Your Perfect Match',
  description: 'A cute and playful dating app where boba meets love',
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
            <div className="bubble absolute top-20 left-10 text-pink-300/40 text-4xl animate-float">💋</div>
            <div className="bubble absolute top-32 right-16 text-pink-300/40 text-3xl animate-float-delay-1">💋</div>
            <div className="bubble absolute top-64 left-1/4 text-pink-300/40 text-5xl animate-float-delay-2">💋</div>
            <div className="bubble absolute top-48 right-1/4 text-pink-300/40 text-4xl animate-float-delay-3">💋</div>
            <div className="bubble absolute bottom-32 right-1/3 text-pink-300/40 text-5xl animate-float">💋</div>
            <div className="bubble absolute bottom-20 left-16 text-pink-300/40 text-3xl animate-float-delay-1">💋</div>
            <div className="bubble absolute top-1/2 left-1/3 text-pink-300/40 text-4xl animate-float-delay-2">💋</div>
            <div className="bubble absolute bottom-40 right-20 text-pink-300/40 text-3xl animate-float-delay-3">💋</div>
            <div className="bubble absolute top-36 left-2/3 text-pink-300/40 text-5xl animate-float">💋</div>
            <div className="bubble absolute bottom-60 left-1/4 text-pink-300/40 text-4xl animate-float-delay-2">💋</div>
            <div className="bubble absolute top-24 right-1/3 text-pink-300/40 text-3xl animate-float-delay-1">💋</div>
            <div className="bubble absolute bottom-48 right-1/4 text-pink-300/40 text-5xl animate-float-delay-3">💋</div>
            <div className="bubble absolute top-1/3 left-20 text-pink-300/40 text-4xl animate-float">💋</div>
            <div className="bubble absolute bottom-1/4 right-32 text-pink-300/40 text-3xl animate-float-delay-2">💋</div>
            <div className="bubble absolute top-3/4 left-1/3 text-pink-300/40 text-5xl animate-float-delay-1">💋</div>
            <div className="bubble absolute top-16 right-1/4 text-pink-300/40 text-4xl animate-float-delay-3">💋</div>
            <div className="bubble absolute bottom-16 left-2/3 text-pink-300/40 text-3xl animate-float">💋</div>
            <div className="bubble absolute top-1/2 right-40 text-pink-300/40 text-5xl animate-float-delay-2">💋</div>
            <div className="bubble absolute bottom-3/4 left-40 text-pink-300/40 text-4xl animate-float-delay-1">💋</div>
            <div className="bubble absolute top-40 right-2/3 text-pink-300/40 text-3xl animate-float-delay-3">💋</div>
          </div>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
