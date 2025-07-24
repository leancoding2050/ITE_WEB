"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CourseModul {
  id: string;
  title: string;
  description: string;
}

const TeachingMaterialsPage = () => {
  const params = useParams();
  const TeacherId = params.Teacherid as string;

  const [CourseModul, setCourseModul] = useState<CourseModul[] | null>(null);

  useEffect(() => {
    const fetchCourseModul = async () => {
      try {
        const res = await fetch(`/api/Course/Get_CourseModul_Lists`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setCourseModul(data);
      } catch (error) {
        console.error("fetchCourseModul error:", error);
      }
    };
    fetchCourseModul();
  }, []);

  console.log("CourseModul: ", CourseModul);

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 標題和創建按鈕 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">課程教材列表</h1>
          <Link
            href={`/teacher/${TeacherId}/TeachingMaterialsLists/CreateTeachingMaterials`}
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600 transition"
          >
            建立課程教材
          </Link>
        </div>

        {/* 課程教材列表 */}
        {CourseModul === null ? (
          <p className="text-gray-400">正在加載...</p>
        ) : CourseModul.length === 0 ? (
          <p className="text-gray-400">尚無課程教材</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CourseModul.map((modul) => (
              <div
                key={modul.id}
                className="bg-gray-700 p-4 rounded-md shadow-md hover:bg-gray-600 transition"
              >
                <h2 className="text-lg font-semibold">{modul.title}</h2>
                <p className="text-sm text-gray-300 mt-2">{modul.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachingMaterialsPage;