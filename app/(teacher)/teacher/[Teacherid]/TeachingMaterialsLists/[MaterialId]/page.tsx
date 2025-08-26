// "use client"

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// interface CourseModul {
//   id: string;
//   title: string;
//   description: string;
//   TeacherId: string; // 添加 TeacherId 字段
//   Teaching_Materials: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// const TeachingMaterialsPageById = () => {
//     const params = useParams();
//     console.log("params : ",  params)
//     const TeacherId = params.Teacherid as string;
//     console.log("TeacherId : ",  TeacherId)
//     const MaterialId = params.MaterialId as string;
//     console.log("MaterialId : ",  MaterialId)
//     const [ GetCousrseModul , setGetCousrseModul ] = useState<CourseModul[] | null>(null);
  
//     useEffect(() => { 
//       const fetchCourseModul = async (MaterialId : string) => {
//         try {
//           const res = await fetch(`/api/Course/Get_CourseModul_lists_by_Id/${MaterialId}`);
//           if (!res.ok) {
//             throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
//           }
//           const data: CourseModul[] = await res.json();
//           // 過濾出 TeacherId 與 params.Teacherid 
//           setGetCousrseModul(data);

//         } catch (error) {
//           console.error("fetchCourseModul error:", error);
//         }
//       }

//     fetchCourseModul(MaterialId)

//     }, [MaterialId])

//     console.log("GetCousrseModul : ",  GetCousrseModul)

//   return (
//     <div>TeachingMaterialsPageById</div>
//   )
// }

// export default TeachingMaterialsPageById


"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface CourseModul {
  id: string;
  title: string;
  description: string;
  TeacherId: string;
  Teaching_Materials: string | null;
  originalFileName: string | null;
  createdAt: string;
  updatedAt: string;
}

const TeachingMaterialsPageById = () => {
  const params = useParams();
  const MaterialId = params.MaterialId as string;
  const [GetCousrseModul, setGetCousrseModul] = useState<CourseModul | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 獲取 CourseModul 數據並生成簽名 URL
  useEffect(() => {
    const fetchCourseModul = async (materialId: string) => {
      try {
        const res = await fetch(`/api/Course/Get_CourseModul_lists_by_Id/${materialId}`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data: CourseModul = await res.json();

        // 如果沒有 Teaching_Materials，直接設置數據
        if (!data.Teaching_Materials) {
          setGetCousrseModul(data);
          return;
        }

        // 為 Teaching_Materials 生成簽名 URL
        const objectKey = data.Teaching_Materials.split(
          "ite-teacher-fold.oss-cn-hongkong.aliyuncs.com/"
        )[1];
        const ossRes = await fetch("/api/oss/get-signed-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            objectKey,
            fileName: data.originalFileName,
          }),
        });
        if (!ossRes.ok) throw new Error("無法獲取簽名 URL");
        const ossData = await ossRes.json();

        setGetCousrseModul({ ...data, Teaching_Materials: ossData.url });
      } catch (error) {
        setError(error instanceof Error ? error.message : "無法載入教材數據");
      }
    };

    fetchCourseModul(MaterialId);
  }, [MaterialId]);

  // 處理檔案上傳
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("materialId", MaterialId);

      const response = await fetch("/api/upload-teaching-material", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`上傳失敗: ${response.statusText}`);
      }

      const result = await response.json();
      // 更新本地數據
      setGetCousrseModul((prev) =>
        prev ? { ...prev, Teaching_Materials: result.url, originalFileName: file.name } : prev
      );
      alert("檔案上傳成功！");
    } catch (error) {
      setError(error instanceof Error ? error.message : "檔案上傳失敗");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-600 px-4 py-2 rounded-md">{error}</div>
      </div>
    );
  }

  if (!GetCousrseModul) {
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
          <h1 className="text-2xl font-bold mb-6">教材資料</h1>
          <div className="space-y-4">
            <div>
              <span className="font-medium">標題:</span> {GetCousrseModul.title}
            </div>
            <div>
              <span className="font-medium">描述:</span> {GetCousrseModul.description}
            </div>
            <div>
              <span className="font-medium">創建時間:</span>{" "}
              {new Date(GetCousrseModul.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">更新時間:</span>{" "}
              {new Date(GetCousrseModul.updatedAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">教材檔案:</span>{" "}
              {GetCousrseModul.Teaching_Materials ? (
                <a
                  href={GetCousrseModul.Teaching_Materials}
                  download={GetCousrseModul.originalFileName}
                  className="text-blue-400 hover:underline"
                >
                  下載 ({GetCousrseModul.originalFileName})
                </a>
              ) : (
                "無檔案"
              )}
            </div>
            <div className="mt-2">
              <label className="font-medium">更新檔案:</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="ml-2"
                disabled={uploading}
              />
              {uploading && <span className="ml-2 text-gray-400">上傳中...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingMaterialsPageById;