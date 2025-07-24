// import { z } from "zod";
// import { CreateCourseTeacherSchema } from "./schema";

// export type InputType = z.infer<typeof CreateCourseTeacherSchema>;

// export type CourseReturnType = z.infer<typeof CreateCourseTeacherSchema> & {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   Coursedates: string[];
//   classroom: string | null; // 新增課室欄位
// };

// export type ReturnType = {
//   data?: CourseReturnType;
//   error?: string;
// };


import { z } from "zod";
import { CreateCourseTeacherSchema } from "./schema";

export type InputType = z.infer<typeof CreateCourseTeacherSchema>;

export type CourseReturnType = {
  id: string;
  title: string;
  description: string;
  course_code: string;
  school_name: string;
  Number_of_days: number;
  time_hours: number;
  TimeRange: ("morning" | "afternoon" | "evening" | "full_day")[]; // 明確定義 TimeRange
  teacher: string[];
  teacher_id: string;
  Ispublic: boolean;
  Isproduct: boolean;
  type: string[];
  courseModulId: string | null;
  start_date: string | null;
  end_date: string | null;
  Coursedates: string[];
  classroom: string | null;
  weekday: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ReturnType = {
  data?: CourseReturnType;
  error?: string;
};