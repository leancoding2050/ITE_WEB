"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

 
  // 檢查登錄狀態和用戶ID
  useEffect(() => {
    if (status === "authenticated" && session?.user.id !== userId) {
      router.push("/login");
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, userId, router]);

  if (status === "loading") {
    return <div>載入中...</div>;
  }

  if (!session || session.user.role !== "USER") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">歡迎，{session.user.name}</h1>
        <p className="text-lg">這是您的用戶儀表板。請使用導航欄訪問您的日曆、證書列表或課程列表。</p>
      </div>
    </div>
  );
}