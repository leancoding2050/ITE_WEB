import { z } from "zod";
import { CreateCourseSchema } from "./schema";

export type InputType = z.infer<typeof CreateCourseSchema>;

export type CourseReturnType = z.infer<typeof CreateCourseSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  Coursedates: string[];
  classroom: string | null; // 新增課室欄位
};

export type ReturnType = {
  data?: CourseReturnType;
  error?: string;
};