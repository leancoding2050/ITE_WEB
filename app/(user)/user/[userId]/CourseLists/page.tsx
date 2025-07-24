"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Course {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
}

export default function UserCalendarPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id !== userId) {
      router.push("/login");
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, userId, router]);

  useEffect(() => {
    async function fetchCourses() {
      const response = await fetch(`/api/user/${userId}/courses`);
      const data = await response.json();
      setCourses(data);
    }
    if (status === "authenticated") {
      fetchCourses();
    }
  }, [status, userId]);

  if (status === "loading") {
    return <div>載入中...</div>;
  }

  if (!session || session.user.role !== "USER") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">我的日曆</h1>
        <div className="grid gap-4">
          {courses.map((course) => (
            <div key={course.id} className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p>開始日期: {course.start_date}</p>
              <p>結束日期: {course.end_date}</p>
              <p>時間: {course.start_time} - {course.end_time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}