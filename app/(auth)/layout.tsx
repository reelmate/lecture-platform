import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <header className="py-6 px-8">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-blue-600">
          <BookOpen className="w-6 h-6" />
          강의 플랫폼
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
