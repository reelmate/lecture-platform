import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: '강의 플랫폼', template: '%s | 강의 플랫폼' },
  description: '최고의 온라인 강의로 성장하세요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
