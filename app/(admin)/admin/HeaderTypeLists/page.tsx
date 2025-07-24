"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface HeaderTypeData {
  id: string;
  HeaderTypeName: string;
}

const HeaderTypePage = () => {
  const [GetHeaderTypeDataLists, setGetHeaderTypeDataLists] = useState<HeaderTypeData[]>([]);

  useEffect(() => {
    const fetchHeaderTypeDataLists = async () => {
      try {
        const response = await fetch("/api/Type/Get_HeaderType_Lists");
        const data = await response.json();
        setGetHeaderTypeDataLists(data);
      } catch (error) {
        console.error("Error fetching header types:", error);
      }
    };
    fetchHeaderTypeDataLists();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這個關鍵字嗎？")) return;

    try {
      const response = await fetch(`/api/Type/Delete_HeaderType/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setGetHeaderTypeDataLists((prev) => prev.filter((item) => item.id !== id));
        alert("關鍵字已成功刪除！");
      } else {
        alert("刪除失敗，請稍後再試。");
      }
    } catch (error) {
      console.error("Error deleting header type:", error);
      alert("刪除時發生錯誤，請稍後再試。");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href={"/admin/HeaderTypeLists/CreateHeaderType"} className="text-blue-600 hover:underline">
          建立關鍵字
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">關鍵字 頁面</h1>
      <div className="space-y-4">
        {GetHeaderTypeDataLists.map((headertype) => (
          <div key={headertype.id} className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm">
            <span>{headertype.HeaderTypeName}</span>
            <button
              onClick={() => handleDelete(headertype.id)}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              刪除
            </button>
          </div>
        ))}
        {GetHeaderTypeDataLists.length === 0 && (
          <p className="text-gray-500 text-center">暫無關鍵字</p>
        )}
      </div>
    </div>
  );
};

export default HeaderTypePage;