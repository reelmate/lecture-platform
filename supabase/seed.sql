-- Sample seed data (run after schema.sql)
-- Replace instructor_id with a real user UUID after creating an account

insert into courses (title, short_description, description, price, original_price, thumbnail_url, instructor_name, level, category, is_published, total_lessons, total_duration)
values
(
  'Next.js 14 완전 정복',
  'App Router부터 배포까지 실무 중심으로 배우는 Next.js 14 강의',
  '# Next.js 14 완전 정복

## 강의 소개
이 강의는 Next.js 14의 App Router를 기반으로 실무에서 바로 사용할 수 있는 풀스택 개발 능력을 기릅니다.

## 배울 내용
- Next.js 14 App Router 구조 이해
- Server Components vs Client Components
- Server Actions로 폼 처리
- 데이터 페칭 및 캐싱 전략
- 인증/인가 구현
- Vercel 배포

## 수강 대상
- React 기본 문법을 아는 개발자
- Next.js로 프로젝트를 시작하고 싶은 분',
  89000,
  150000,
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  '김개발',
  'intermediate',
  '웹 개발',
  true,
  24,
  720
),
(
  'TypeScript 실전 마스터',
  '타입스크립트로 안전하고 확장 가능한 코드 작성법',
  '# TypeScript 실전 마스터

## 강의 소개
JavaScript 개발자를 위한 TypeScript 심화 과정입니다.

## 배울 내용
- 타입 시스템 심화
- 제네릭 활용
- 유틸리티 타입
- 실전 프로젝트 적용',
  69000,
  120000,
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
  '박타입',
  'intermediate',
  '프로그래밍',
  true,
  18,
  540
),
(
  'React 상태관리 완벽 가이드',
  'Zustand, React Query, Jotai로 복잡한 상태를 우아하게 관리하기',
  '# React 상태관리 완벽 가이드

## 강의 소개
현업에서 자주 쓰는 상태관리 라이브러리를 비교 분석합니다.',
  59000,
  99000,
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
  '이리액트',
  'advanced',
  '웹 개발',
  true,
  15,
  450
);
