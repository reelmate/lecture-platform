-- ============================================================
-- Online Lecture Platform Schema
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── Profiles ────────────────────────────────────────────────
create table profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now()
);

alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Courses ─────────────────────────────────────────────────
create table courses (
  id                uuid default gen_random_uuid() primary key,
  title             text not null,
  description       text,
  short_description text,
  price             integer not null default 0,
  original_price    integer,
  thumbnail_url     text,
  instructor_id     uuid references profiles(id),
  instructor_name   text,
  level             text check (level in ('beginner', 'intermediate', 'advanced')),
  category          text,
  is_published      boolean default false,
  total_lessons     integer default 0,
  total_duration    integer default 0,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

alter table courses enable row level security;
create policy "Published courses are viewable by everyone" on courses
  for select using (is_published = true);
create policy "Admins can do everything on courses" on courses
  using (auth.jwt() ->> 'role' = 'admin');

-- ── Sections ────────────────────────────────────────────────
create table sections (
  id          uuid default gen_random_uuid() primary key,
  course_id   uuid references courses(id) on delete cascade not null,
  title       text not null,
  order_index integer not null,
  created_at  timestamptz default now()
);

alter table sections enable row level security;
create policy "Sections viewable with published course" on sections
  for select using (
    exists (select 1 from courses where courses.id = sections.course_id and courses.is_published = true)
  );

-- ── Lessons ─────────────────────────────────────────────────
create table lessons (
  id              uuid default gen_random_uuid() primary key,
  section_id      uuid references sections(id) on delete cascade not null,
  course_id       uuid references courses(id) on delete cascade not null,
  title           text not null,
  description     text,
  bunny_video_id  text,
  duration        integer,
  is_preview      boolean default false,
  order_index     integer not null,
  created_at      timestamptz default now()
);

alter table lessons enable row level security;

-- Preview lessons are public; others require enrollment
create policy "Preview lessons are public" on lessons
  for select using (is_preview = true);

create policy "Enrolled users can view lessons" on lessons
  for select using (
    exists (
      select 1 from enrollments
      where enrollments.course_id = lessons.course_id
        and enrollments.user_id = auth.uid()
    )
  );

-- ── Orders ──────────────────────────────────────────────────
create table orders (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references profiles(id) not null,
  course_id   uuid references courses(id) not null,
  order_id    text unique not null,
  payment_key text,
  amount      integer not null,
  status      text default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
  paid_at     timestamptz,
  created_at  timestamptz default now()
);

alter table orders enable row level security;
create policy "Users can view their own orders" on orders
  for select using (auth.uid() = user_id);
create policy "Users can insert their own orders" on orders
  for insert with check (auth.uid() = user_id);

-- ── Enrollments ─────────────────────────────────────────────
create table enrollments (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references profiles(id) not null,
  course_id   uuid references courses(id) not null,
  order_id    uuid references orders(id),
  enrolled_at timestamptz default now(),
  unique(user_id, course_id)
);

alter table enrollments enable row level security;
create policy "Users can view their own enrollments" on enrollments
  for select using (auth.uid() = user_id);

-- ── Lesson Progress ─────────────────────────────────────────
create table lesson_progress (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references profiles(id) not null,
  lesson_id        uuid references lessons(id) on delete cascade not null,
  course_id        uuid references courses(id) on delete cascade not null,
  completed        boolean default false,
  progress_seconds integer default 0,
  last_watched_at  timestamptz default now(),
  unique(user_id, lesson_id)
);

alter table lesson_progress enable row level security;
create policy "Users can manage their own progress" on lesson_progress
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
