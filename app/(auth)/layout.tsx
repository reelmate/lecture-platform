import Link from 'next/link';
import Image from 'next/image';
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <header className="py-6 px-8">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-blue-600">
          <Image src="/logo.png" alt="릴메이트" width={40} height={40} />
          릴메이트
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}