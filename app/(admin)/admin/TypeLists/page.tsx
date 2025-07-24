"use client"

import Link from "next/link"
import { useEffect, useState } from "react";

interface TypeData {
id: string;
typename: string;
author: string;
}

const TypeListsPage = () => {

  const [getTyperData, setgetTyperData] = useState<TypeData []>([]);
  const [error, setError] = useState("");

  useEffect(()=>{
  const fetchData = async () => {
    try {
      const response = await fetch("/api/Type/Get_Type_Lists");
      if (!response.ok) {
        throw new Error(`請求失敗: ${response.status}`);
      }
      const data = await response.json();
      setgetTyperData(data);
    } catch (error) {
      setError("Error fetching data");
    }
  }
    fetchData()
  },[])

  console.log("getTyperData :" , getTyperData , " -- End -- ")

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這個狀態嗎？")) return;

    try {
      const response = await fetch(`/api/Statue/Delete_Statue/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setgetTyperData((prev) => prev.filter((item) => item.id !== id));
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
  if (!getTyperData)
    return (
      <div className="ml-[50px] p-4 text-[#1D475D] font-noto-sans-tc">無數據</div>
    );


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
      <Link href={"/admin/TypeLists/CreateType"} className="text-blue-600 hover:underline">
        建立類型
      </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">TypeListsPage</h1>
          <div className="space-y-4">
      {getTyperData.map((typeitem) => {
        return (
          <div key={typeitem.id} className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm">

              <span>{typeitem.typename}</span>
            <button
              onClick={() => handleDelete(typeitem.id)}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              刪除
            </button>
            
          </div>
        )


      })}

        {getTyperData.length === 0 && (
          <p className="text-gray-500 text-center">暫無關鍵字</p>
        )}
      </div>
    </div>
  )
}


export default TypeListsPage