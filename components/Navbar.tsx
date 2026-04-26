'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <Image src="/logo.png" alt="릴메이트 로고" width={32} height={32} className="rounded" />
          릴메이트
        </Link>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
            강의 목록
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                내 강의실
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                로그인
              </Link>
              <Link href="/signup" className="text-sm py-2 px-4 rounded-lg font-semibold transition-colors" style={{ backgroundColor: '#F5E642', color: '#3D1F00' }}>
                무료 가입
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          <Link href="/" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>강의 목록</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>내 강의실</Link>
              <button onClick={handleLogout} className="block text-sm font-medium text-red-500">로그아웃</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>로그인</Link>
              <Link href="/signup" className="block text-sm font-medium text-blue-600" onClick={() => setMenuOpen(false)}>무료 가입</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
