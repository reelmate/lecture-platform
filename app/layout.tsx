import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: { default: '릴메이트', template: '%s | 릴메이트' },
  description: '최고의 온라인 강의로 성장하세요.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <footer style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: '#999', borderTop: '1px solid #eee', marginTop: '40px' }}>
          상호명: 키윰 | 사업자등록번호: 814-41-00455 | 대표: 주윤주 | 이메일: kiyumtv@gmail.com
        </footer>
      </body>
    </html>
  );
}