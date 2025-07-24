"use server";

import { db } from "@/lib/db";
import { CreateCourseSchema } from "./schema";
import { InputType, ReturnType, CourseReturnType } from "./types";
import { CreateSafeAction } from "@/lib/create-safe-action";


type TimeRangeValue = "morning" | "afternoon" | "evening" | "full_day";

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    const validatedData = CreateCourseSchema.parse(data);

    const {
      title,
      description,
      course_code,
      school_name,
      Number_of_days,
      time_hours,
      TimeRange = [],
      teacher,
      Ispublic,
      Isproduct,
      type,
      courseModulId,
      teacher_id,
      start_date,
      end_date,
      start_time,
      end_time,
      Coursedates = [],
      classroom, // 新增課室欄位
    } = validatedData;

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

    const teacherExists = await db.user.findUnique({
      where: { id: teacher_id },
      select: { id: true, name: true },
    });

    if (!teacherExists) {
      return {
        error: "教師 ID 不存在",
      };
    }

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

    const validTimeRangeValues: TimeRangeValue[] = ["morning", "afternoon", "evening", "full_day"];
    const isValidTimeRange = TimeRange.every((value) => validTimeRangeValues.includes(value));
    if (!isValidTimeRange) {
      return {
        error: "無效的 TimeRange 值",
      };
    }

    const course_data = await db.course.create({
      data: {
        title,
        description,
        course_code,
        school_name,
        Number_of_days,
        time_hours,
        TimeRange: TimeRange as string[],
        teacher,
        teacher_id,
        Ispublic,
        Isproduct,
        type,
        start_date,
        end_date,
        start_time,
        end_time,
        Coursedates,
        classroom, // 新增課室欄位
        CourseModul: courseModulId ? { connect: { id: courseModulId } } : undefined,
      },
    });

    const formattedCourseData: CourseReturnType = {
      id: course_data.id,
      title: course_data.title,
      description: course_data.description,
      course_code: course_data.course_code,
      school_name: course_data.school_name,
      Number_of_days: course_data.Number_of_days,
      time_hours: course_data.time_hours,
      TimeRange: course_data.TimeRange as TimeRangeValue[],
      teacher: course_data.teacher,
      teacher_id: course_data.teacher_id,
      Ispublic: course_data.Ispublic,
      type: course_data.type,
      courseModulId: course_data.courseModulId,
      start_date: course_data.start_date,
      end_date: course_data.end_date,
      start_time: course_data.start_time,
      end_time: course_data.end_time,
      Coursedates: course_data.Coursedates,
      classroom: course_data.classroom, // 新增課室欄位
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

export const CreateCourseAction = CreateSafeAction(CreateCourseSchema, handler);