import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const UpdateCourseSchema = z.object({
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  timeRanges: z
    .array(
      z.object({
        timeRange: z.enum(["morning", "afternoon", "evening", "full_day"]),
        start_time: z.string().optional().nullable(),
        end_time: z.string().optional().nullable(),
      })
    )
    .optional(),
  Coursedates: z.array(z.string()).optional(),
  weekday: z.string().optional().nullable(),
  classroom: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // 等待解析動態路由參數
    const { id } = await context.params;

    // 解析請求的 body
    const body = await req.json();
    
    // 記錄用戶提交的數據
    console.log("-- 接收到的課程更新數據 -- :", body, "-- 結束 --");

    // 驗證輸入數據
    const validatedData = UpdateCourseSchema.parse(body);

    // 檢查課程是否存在
    const course = await db.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json({ error: "課程不存在" }, { status: 404 });
    }

    // 更新課程基本資料
    const updatedCourse = await db.course.update({
      where: { id },
      data: {
        start_date: validatedData.start_date,
        end_date: validatedData.end_date,
        Coursedates: validatedData.Coursedates,
        weekday: validatedData.weekday,
        classroom: validatedData.classroom,
      },
    });

    // 清空現有的 CourseTimeRange 記錄
    await db.courseTimeRange.deleteMany({
      where: { courseId: id },
    });

    // 創建新的 CourseTimeRange 記錄
    if (validatedData.timeRanges && validatedData.timeRanges.length > 0) {
      await db.courseTimeRange.createMany({
        data: validatedData.timeRanges.map((tr) => ({
          courseId: id,
          timeRange: tr.timeRange,
          start_time: tr.start_time,
          end_time: tr.end_time,
        })),
      });
    }

    // 獲取更新後的課程，包含 CourseTimeRanges
    const finalCourse = await db.course.findUnique({
      where: { id },
      include: { CourseTimeRanges: true },
    });

    return NextResponse.json(finalCourse);
  } catch (error) {
    console.error("UpdateCourse error: ", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "更新課程失敗" },
      { status: 500 }
    );
  }
}