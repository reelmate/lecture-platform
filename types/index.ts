export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  price: number;
  original_price: number | null;
  thumbnail_url: string | null;
  instructor_id: string | null;
  instructor_name: string | null;
  level: 'beginner' | 'intermediate' | 'advanced' | null;
  category: string | null;
  is_published: boolean;
  total_lessons: number;
  total_duration: number;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  section_id: string;
  course_id: string;
  title: string;
  description: string | null;
  bunny_video_id: string | null;
  duration: number | null;
  is_preview: boolean;
  order_index: number;
}

export interface Order {
  id: string;
  user_id: string;
  course_id: string;
  order_id: string;
  payment_key: string | null;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  paid_at: string | null;
  created_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  order_id: string;
  enrolled_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  completed: boolean;
  progress_seconds: number;
  last_watched_at: string;
}

export interface CourseWithSections extends Course {
  sections: (Section & { lessons: Lesson[] })[];
}
