import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const courses = await db.course.findMany({
      include: {
        CourseTimeRanges: true, // 包含 CourseTimeRanges
      },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("GetCourseLists error: ", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "獲取課程列表失敗" },
      { status: 500 }
    );
  }
}