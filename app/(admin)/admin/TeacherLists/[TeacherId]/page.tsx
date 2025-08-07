"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface TeacherDatabyId {
  id: string;
  username: string;
  password: string;
  phone: string;
  phoneVerified: boolean | null;
  name: string;
  role: string;
  teacherholidaysDateTime: string[];
  createdAt: string;
  updatedAt: string;
}

const TeacherDatabyIdPage = () => {
  const params = useParams();
  const TeacherId = params.TeacherId as string;

  const [GetTeacherData, setGetTeacherData] = useState<TeacherDatabyId | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await fetch(`/api/user/Get_User_Lists_by_Id/${TeacherId}`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setGetTeacherData(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "無法載入老師數據");
      }
    };
    fetchTeacherData();
  }, [TeacherId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-600 px-4 py-2 rounded-md">{error}</div>
      </div>
    );
  }

  if (!GetTeacherData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 shadow-lg rounded-md p-6">
          <h1 className="text-2xl font-bold mb-6">教師資料</h1>
          <div className="space-y-4">
            <div>
              <span className="font-medium">教師 ID:</span> {GetTeacherData.id}
            </div>
            <div>
              <span className="font-medium">用戶名:</span> {GetTeacherData.username}
            </div>
            <div>
              <span className="font-medium">姓名:</span> {GetTeacherData.name}
            </div>
            <div>
              <span className="font-medium">電話:</span> {GetTeacherData.phone}
            </div>
            <div>
              <span className="font-medium">角色:</span> {GetTeacherData.role}
            </div>
            <div>
              <span className="font-medium">創建時間:</span>{" "}
              {new Date(GetTeacherData.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">更新時間:</span>{" "}
              {new Date(GetTeacherData.updatedAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">假期:</span>{" "}
              {GetTeacherData.teacherholidaysDateTime.length > 0
                ? GetTeacherData.teacherholidaysDateTime.join(", ")
                : "無假期"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDatabyIdPage;