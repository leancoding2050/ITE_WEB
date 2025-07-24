"use client"

import Link from "next/link"
import { useEffect, useState } from "react";

interface StatueData {
  id: string;
  statuename :string;
}
const StatueListsPage = () => {

    const [getStatueData, setgetStatueData] = useState<StatueData []>([]);
    const [error, setError] = useState("");

      useEffect(()=>{
      const fetchStatueData = async () => {
        try {
          const response = await fetch("/api/Statue/Get_Statue_Lists");
          if (!response.ok) {
            throw new Error(`請求失敗: ${response.status}`);
          }
          const data = await response.json();
          setgetStatueData(data);
        } catch (error) {
          setError("Error fetching data");
        }
      }
        fetchStatueData()
      },[])
    
      console.log("getStatueData :" , getStatueData , " -- End -- ")

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這個狀態嗎？")) return;

    try {
      const response = await fetch(`/api/Statue/Delete_Statue/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setgetStatueData((prev) => prev.filter((item) => item.id !== id));
        alert("狀態已成功刪除！");
      } else {
        alert("刪除失敗，請稍後再試。");
      }
    } catch (error) {
      console.error("Error deleting header type:", error);
      alert("刪除時發生錯誤，請稍後再試。");
    }
  };


  if (error)
    return (
      <div className="ml-[50px] p-4 text-[#FF0000] font-noto-sans-tc">錯誤: {error}</div>
    );
  if (!getStatueData)
    return (
      <div className="ml-[50px] p-4 text-[#1D475D] font-noto-sans-tc">無數據</div>
    );



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
      <Link href={"/admin/StatueLists/CreateStatue"}className="text-blue-600 hover:underline">
        建立狀態
      </Link>
    </div>
      <h1 className="text-2xl font-bold mb-6">StatueListsPage</h1>
    <div className="space-y-4">
      {getStatueData.map((statueitem) => (
          <div key={statueitem.id} className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm">

              <span>{statueitem.statuename}</span>
            <button
              onClick={() => handleDelete(statueitem.id)}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              刪除
            </button>
            
          </div>
        ))}
        {getStatueData.length === 0 && (
          <p className="text-gray-500 text-center">暫無關鍵字</p>
        )}
</div>
    </div>
  )
}

export default StatueListsPage