"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface UserData {
  id: string;
  username: string;
  name: string;
  email: string | null;
  emailVerified: string | null;
  phone: string | null;
  phoneVerified: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  teacherholidaysDateTime: string[];
}

export default function UserPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/user/Get_User_Lists_by_Id/${userId}`);
        if (!response.ok) {
          throw new Error(`請求失敗: ${response.status}`);
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("無法獲取用戶數據");
      } finally {
        setIsLoading(false);
      }
    }
    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status, userId]);

  // 檢查登錄狀態和用戶ID
  useEffect(() => {
    if (status === "authenticated" && session?.user.id !== userId) {
      router.push("/login");
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, userId, router]);

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="flex items-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
          </svg>
          載入中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "USER") {
    return null;
  }

  console.log("userData:", userData, " -- End -- ");

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 標題 */}
        <h1 className="text-2xl font-bold mb-6">歡迎，{session.user.name}</h1>

        {/* 用戶數據展示 */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">用戶資料</h2>
          {userData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">用戶 ID</p>
                <p className="text-base">{userData.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">用戶名</p>
                <p className="text-base">{userData.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">姓名</p>
                <p className="text-base">{userData.name || "未設置"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">電子郵件</p>
                <p className="text-base">{userData.email || "未設置"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">電話</p>
                <p className="text-base">{userData.phone || "未設置"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">角色</p>
                <p className="text-base">{userData.role}</p>
              </div>

            </div>
          )}
          {!userData && <p className="text-gray-400">無用戶數據</p>}
        </div>

        {/* 導航鏈接 */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <Link
            href={`/user/${userId}/Calendar`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            查看我的日曆
          </Link>
          <Link
            href={`/user/${userId}/CourseLists`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            查看我的課程
          </Link>
        </div>
      </div>
    </div>
  );
}