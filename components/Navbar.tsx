import Link from 'next/link';
import Image from 'next/image';
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <img src="/logo.png" alt="릴메이트 로고" style={{width:'32px',height:'32px',objectFit:'cover',borderRadius:'4px'}} />
            릴메이트
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}