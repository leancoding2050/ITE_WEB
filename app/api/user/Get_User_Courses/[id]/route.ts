// "use server";

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import getServerSession from "next-auth"
// import { authOptions } from "@/auth";
// import { Session } from "next-auth"; // 匯入 Session 型別

// interface CourseWithDetails {
//   id: string;
//   title: string;
//   description: string;
//   courseCode: string;
//   schoolName: string;
//   Students: string[];
//   teacherId: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// interface ErrorResponse {
//   error: string;
//   statusCode?: number;
// }

// // 明確定義自定義 Session 型別（與 auth.ts 一致）
// interface CustomSession extends Session {
//   user: {
//     id: string;
//     name: string | null;
//     role: string; // UserRole 會被序列化為 string
//     email: string | null;
//     emailVerified: Date | null;
//   };
// }

// export async function GET(req: NextRequest): Promise<NextResponse<CourseWithDetails[] | ErrorResponse>> {
//   try {
//     const session = await getServerSession(authOptions) as CustomSession | null;
//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "未授權：請先登入" },
//         { status: 401 }
//       );
//     }

//     const userId = session.user.id;

//     // 獲取用戶的 name
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { name: true },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "找不到用戶" }, { status: 404 });
//     }

//     const userName = user.name || "匿名用戶";

//     // 查詢用戶作為教師的課程（通過 teacherId）
//     const teacherCourses = await prisma.course.findMany({
//       where: { teacherId: userId },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         courseCode: true,
//         schoolName: true,
//         Students: true,
//         teacherId: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     // 查詢用戶作為學生的課程（通過 Students 字段）
//     const studentCourses = await prisma.course.findMany({
//       where: { Students: { has: userName } },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         courseCode: true,
//         schoolName: true,
//         Students: true,
//         teacherId: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     // 合併並去重課程（避免教師和學生的課程重複）
//     const uniqueCourses = [
//       ...teacherCourses,
//       ...studentCourses.filter(
//         (sc) => !teacherCourses.some((tc) => tc.id === sc.id)
//       ),
//     ];

//     return NextResponse.json(uniqueCourses);
//   } catch (error) {
//     console.error("獲取用戶課程失敗:", error);
//     return NextResponse.json(
//       {
//         error: error instanceof Error ? error.message : "無法獲取用戶課程",
//         statusCode: 500,
//       },
//       { status: 500 }
//     );
//   }
// }




"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"; // 使用 NextAuth v5 的 auth 方法
import { UserRole } from "@prisma/client"; 

interface CourseWithDetails {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  Students: string[];
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ErrorResponse {
  error: string;
  statusCode?: number;
}

// 与 auth.ts 中一致的 Session 类型
interface CustomSession {
  user: {
    id: string;
    name: string | null;
    role: UserRole;
    email: string | null;
    emailVerified: Date | null;
  };
}

export async function GET(req: NextRequest): Promise<NextResponse<CourseWithDetails[] | ErrorResponse>> {
  try {
    // 使用 NextAuth v5 的 auth() 方法获取 session
    const sessionData = await auth();
    
    // 处理 session 数据为 CustomSession 类型
    const session = sessionData as unknown as CustomSession | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授權：請先登入" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 獲取用戶的 name
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "找不到用戶" }, { status: 404 });
    }

    const userName = user.name || "匿名用戶";

    // 查詢用戶作為教師的課程（通過 teacherId）
    const teacherCourses = await prisma.course.findMany({
      where: { teacherId: userId },
      select: {
        id: true,
        title: true,
        description: true,
        courseCode: true,
        schoolName: true,
        Students: true,
        teacherId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // 查詢用戶作為學生的課程（通過 Students 字段）
    const studentCourses = await prisma.course.findMany({
      where: { Students: { has: userName } },
      select: {
        id: true,
        title: true,
        description: true,
        courseCode: true,
        schoolName: true,
        Students: true,
        teacherId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // 合併並去重課程（避免教師和學生的課程重複）
    const uniqueCourses = [
      ...teacherCourses,
      ...studentCourses.filter(
        (sc) => !teacherCourses.some((tc) => tc.id === sc.id)
      ),
    ];

    return NextResponse.json(uniqueCourses);
  } catch (error) {
    console.error("獲取用戶課程失敗:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "無法獲取用戶課程",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}