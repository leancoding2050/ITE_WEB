import { z } from "zod";

export const CreateCourseSchema = z.object({
  title: z.string().min(1, "標題不可為空"),
  description: z.string().min(1, "描述不可為空"),
  course_code: z.string().min(1, "課程代碼不可為空"),
  school_name: z.string().min(1, "學校名稱不可為空"),
  Number_of_days: z.number().int().min(1, "課程天數必須為正整數"),
  TimeRanges: z.array(
    z.object({
      timeRange: z.enum(["morning", "afternoon", "evening", "full_day"]),
      start_time: z.string().optional().nullable(),
      end_time: z.string().optional().nullable(),
    })
  ).optional(),
  time_hours: z.number().int().min(0, "課程時數必須為正整數"),
  teacher: z.array(z.string().min(1, "教師名稱不可為空")).min(1, "至少需要一名教師"),
  Ispublic: z.boolean(),
  Isproduct: z.boolean(),
  type: z.array(z.string().min(1, "課程類型不可為空")),
  courseModulId: z.string().nullable(),
  teacher_id: z.string().uuid("教師 ID 必須是有效的 UUID"),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  Coursedates: z.array(z.string()).optional(),
  weekday: z.string().optional().nullable(), // 新增週份欄位
  classroom: z.string().optional().nullable(), // 新增課室欄位
});