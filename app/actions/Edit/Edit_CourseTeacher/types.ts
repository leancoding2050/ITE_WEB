

// import { z } from 'zod';
// import { EditCourseTeacherSchema } from './schema';

// export type InputType = z.infer<typeof EditCourseTeacherSchema>;

// export type CourseTimeRangeReturnType = {
//   id: string;
//   timeRange: 'morning' | 'afternoon' | 'evening' | 'full_day';
//   starttime: string | null;
//   endtime: string | null;
//   createdAt: Date;
//   updatedAt: Date;
// };

// export type CourseReturnType = {
//   id: string;
//   title: string;
//   description: string;
//   courseCode: string;
//   schoolName: string;
//   numberOfDays: number;
//   timeHours: number;
//   timeRanges: CourseTimeRangeReturnType[];
//   teacher: string[];
//   teacherId: string;
//   isPublic: boolean;
//   isProduct: boolean;
//   type: string[];
//   courseModuleId: string | null;
//   startDate: string | null;
//   endDate: string | null;
//   courseDates: string[];
//   classroom: string | null;
//   weekday: string | null;
//   createdAt: Date;
//   updatedAt: Date;
//   Producted: boolean;
// };

// export type ReturnType = {
//   data?: CourseReturnType;
//   error?: string;
// };


import { z } from 'zod';
import { EditCourseTeacherSchema } from './schema';

export type InputType = z.infer<typeof EditCourseTeacherSchema>;

export type CourseTimeRangeReturnType = {
  id: string;
  timeRange: 'morning' | 'afternoon' | 'evening' | 'full_day';
  starttime: string | null;
  endtime: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CourseReturnType = {
  id: string;
  courseId: string; // 新增 courseId 字段
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  numberOfDays: number;
  timeHours: number;
  timeRanges: CourseTimeRangeReturnType[];
  teacher: string[];
  teacherId: string;
  isPublic: boolean;
  isProduct: boolean;
  type: string[];
  courseModuleId: string | null;
  startDate: string | null;
  endDate: string | null;
  courseDates: string[];
  classroom: string | null;
  weekday: string | null;
  createdAt: Date;
  updatedAt: Date;
  Producted: boolean;
};

export type ReturnType = {
  data?: CourseReturnType;
  error?: string;
};