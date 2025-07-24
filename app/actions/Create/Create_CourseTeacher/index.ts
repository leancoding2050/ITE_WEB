"use server";

import { db } from "@/lib/db";
import { CreateCourseTeacherSchema } from "./schema";
import { InputType, ReturnType, CourseReturnType } from "./types";
import { CreateSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    // 驗證輸入資料
    const validatedData = CreateCourseTeacherSchema.parse(data);

    const {
      title,
      description,
      course_code,
      school_name,
      Number_of_days,
      time_hours,
      TimeRange = [], // 確保 TimeRange 有預設值
      teacher,
      Ispublic,
      Isproduct,
      type,
      courseModulId,
      teacher_id,
      start_date,
      end_date,
      Coursedates = [],
      classroom,
      weekday,
    } = validatedData;

    // 驗證 courseModulId 是否存在
    let courseModul = null;
    if (courseModulId) {
      courseModul = await db.courseModul.findUnique({
        where: { id: courseModulId },
        select: { id: true },
      });

      if (!courseModul) {
        return {
          error: "課程模組不存在",
        };
      }
    }

    // 驗證 teacher_id 是否存在
    const teacherExists = await db.user.findUnique({
      where: { id: teacher_id },
      select: { id: true, name: true },
    });

    if (!teacherExists) {
      return {
        error: "教師 ID 不存在",
      };
    }

    // 驗證教師名稱是否有效且角色為 TEACHER
    const validTeachers = await db.user.findMany({
      where: {
        name: { in: teacher },
        role: "TEACHER",
      },
      select: { name: true },
    });

    if (validTeachers.length !== teacher.length) {
      return {
        error: "部分教師名稱無效或不是教師角色",
      };
    }

    // 驗證課程類型是否有效
    const validTypes = await db.coursePorductType.findMany({
      where: {
        id: { in: type },
      },
      select: { id: true },
    });

    if (validTypes.length !== type.length) {
      return {
        error: "部分課程類型無效",
      };
    }

    // 驗證 TimeRange 值
    const validTimeRangeValues = ["morning", "afternoon", "evening", "full_day"];
    const isValidTimeRange = TimeRange.every((value) => validTimeRangeValues.includes(value));
    if (!isValidTimeRange) {
      return {
        error: "無效的 TimeRange 值",
      };
    }

    // 創建課程
    const course_data = await db.course.create({
      data: {
        title,
        description,
        course_code,
        school_name,
        Number_of_days,
        time_hours,
        TimeRange, // 直接使用 TimeRange
        teacher,
        teacher_id,
        Ispublic,
        Isproduct,
        type,
        start_date,
        end_date,
        Coursedates,
        classroom,
        weekday,
        CourseModul: courseModulId ? { connect: { id: courseModulId } } : undefined,
      },
    });

    // 格式化返回數據
    const formattedCourseData: CourseReturnType = {
      id: course_data.id,
      title: course_data.title,
      description: course_data.description,
      course_code: course_data.course_code,
      school_name: course_data.school_name,
      Number_of_days: course_data.Number_of_days,
      time_hours: course_data.time_hours,
      TimeRange: course_data.TimeRange as ("morning" | "afternoon" | "evening" | "full_day")[], // 確保類型一致
      teacher: course_data.teacher,
      teacher_id: course_data.teacher_id,
      Ispublic: course_data.Ispublic,
      Isproduct: course_data.Isproduct,
      type: course_data.type,
      courseModulId: course_data.courseModulId,
      start_date: course_data.start_date,
      end_date: course_data.end_date,
      Coursedates: course_data.Coursedates,
      classroom: course_data.classroom,
      weekday: course_data.weekday,
      createdAt: course_data.createdAt,
      updatedAt: course_data.updatedAt,
    };

    console.log("-- Create course on server -- : ", formattedCourseData, "-- End --");

    return {
      data: formattedCourseData,
    };
  } catch (error) {
    console.error("CreateCourseAction error: ", error);
    return {
      error: error instanceof Error ? error.message : "創建課程失敗，請稍後重試",
    };
  }
};

export const CreateCourseTeacherAction = CreateSafeAction(CreateCourseTeacherSchema, handler);