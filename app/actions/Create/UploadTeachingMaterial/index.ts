// "use server";

// import { revalidatePath } from "next/cache";
// import { prisma } from "@/lib/prisma";
// import { auth} from "@/auth";

// import { createOssClient } from "@/lib/oss-client";


// export async function uploadTeachingMaterial(formData: FormData) {
//   try {
//     const session = await auth();
    
//     // 修正 session.user 的類型檢查
//     if (!session || !session.user || !["TEACHER", "ADMIN"].includes((session.user as any).role)) {
//       return { 
//         success: false, 
//         message: "無權限上傳檔案" 
//       };
//     }

//     const file = formData.get("file") as File;
//     const materialId = formData.get("materialId") as string;
//     const teacherId = formData.get("teacherId") as string;

//     if (!file || !materialId || !teacherId) {
//       return { 
//         success: false, 
//         message: "缺少必要參數" 
//       };
//     }

//     // 驗證 CourseModule 和 TeacherId
//     const courseModule = await prisma.courseModul.findUnique({
//       where: { 
//         id: materialId, 
//         TeacherId: teacherId 
//       },
//     });
    
//     if (!courseModule) {
//       return { 
//         success: false, 
//         message: "無效的教材或教師 ID" 
//       };
//     }

//     // 創建 OSS 客戶端
//     const ossClient = createOssClient();
    
//     // 上傳檔案到 OSS
//     const objectKey = `teaching-materials/${teacherId}/${Date.now()}-${file.name}`;
//     const arrayBuffer = await file.arrayBuffer();
//     const result = await ossClient.put(objectKey, Buffer.from(arrayBuffer));

//     // 更新資料庫
//     await prisma.courseModul.update({
//       where: { id: materialId },
//       data: {
//         Teaching_Materials: result.url,
//         originalFileName: file.name,
//         updatedAt: new Date(),
//       },
//     });

//     // 重新驗證頁面緩存
//     revalidatePath(`/teaching-materials/${teacherId}/${materialId}`);

//     return { 
//       success: true, 
//       url: result.url, 
//       message: "檔案上傳成功" 
//     };
//   } catch (error) {
//     console.error("上傳檔案失敗:", error);
    
//     let errorMessage = "上傳檔案失敗";
//     if (error instanceof Error) {
//       if (error.message === 'OSS 環境變數未正確設置') {
//         errorMessage = "伺服器配置錯誤";
//       } else {
//         errorMessage = error.message;
//       }
//     }
    
//     return { 
//       success: false, 
//       message: errorMessage 
//     };
//   }
// }


"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createOssClient } from "@/lib/oss-client";

export async function uploadTeachingMaterial(formData: FormData) {
  try {
    const session = await auth();
    
    // 檢查 session 和 user 角色
    if (!session || !session.user || !["TEACHER", "ADMIN"].includes(session.user.role)) {
      return {
        success: false,
        message: "無權限上傳檔案",
      };
    }

    const file = formData.get("file") as File;
    const materialId = formData.get("materialId") as string;

    if (!file || !materialId) {
      return {
        success: false,
        message: "缺少必要參數",
      };
    }

    // 驗證 CourseModul
    const courseModule = await prisma.courseModul.findUnique({
      where: { id: materialId },
    });

    if (!courseModule) {
      return {
        success: false,
        message: "無效的教材 ID",
      };
    }

    // 驗證當前用戶是否有權限修改（可選，根據需求）
    if (session.user.id !== courseModule.TeacherId && session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "無權限修改此教材",
      };
    }

    // 創建 OSS 客戶端
    const ossClient = createOssClient();

    // 上傳檔案到 OSS
    const objectKey = `teaching-materials/${courseModule.TeacherId}/${Date.now()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    const result = await ossClient.put(objectKey, Buffer.from(arrayBuffer));

    // 更新資料庫
    await prisma.courseModul.update({
      where: { id: materialId },
      data: {
        Teaching_Materials: result.url,
        originalFileName: file.name,
        updatedAt: new Date(),
      },
    });

    // 重新驗證頁面緩存
    revalidatePath(`/teaching-materials/${courseModule.TeacherId}/${materialId}`);

    return {
      success: true,
      url: result.url,
      message: "檔案上傳成功",
    };
  } catch (error) {
    console.error("上傳檔案失敗:", error);

    let errorMessage = "上傳檔案失敗";
    if (error instanceof Error) {
      if (error.message === "OSS 環境變數未正確設置") {
        errorMessage = "伺服器配置錯誤";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}