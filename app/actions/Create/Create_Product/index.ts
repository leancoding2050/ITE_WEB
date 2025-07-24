// "use server";

// import { db } from "@/lib/db";
// import { CreateProductSchema } from "./schema";
// import { InputType, ReturnType } from "./types";
// import { CreateSafeAction } from "@/lib/create-safe-action";

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { title, description, price ,IsPublic,CoursePorductTypeArray ,CoursePorductStatueArray} = data;

//   // 調試：檢查 price 的類型
//   console.log("-- Input price type -- :", typeof price, "-- Value -- :", price);

//   // 驗證 price 是否有效（Zod 已經處理，但添加防範措施）
//   if (typeof price !== "number" || isNaN(price) || price < 0) {
//     return { error: "價格必須是有效的非負數字" };
//   }

//   let product_data;

//   try {
//     product_data = await db.product.create({
//       data: {
//         title,
//         description,
//         price, // 直接使用 price，因為 CreateProductSchema 保證是數字
//         IsPublic,
//         CoursePorductTypeArray,
//         CoursePorductStatueArray,
//       },
//     });

//     console.log("-- Create Product on server -- :", product_data, "-- End --");

//     return {
//       data: product_data,
//     };
//   } catch (error) {
//     console.log("-- Error -- :", error, "-- End --");
//     return { error: error instanceof Error ? error.message : "未知錯誤" };
//   }
// };

// export const CreateProductAction = CreateSafeAction(CreateProductSchema, handler);


"use server";

import { db } from "@/lib/db";
import { CreateProductSchema } from "./schema";
import { InputType, ReturnType } from "./types";
import { CreateSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { title, description, price, IsPublic, CoursePorductTypeArray, CoursePorductStatueArray, courseId } = data;

  console.log("-- Input price type -- :", typeof price, "-- Value -- :", price);
  console.log("-- Input courseId -- :", courseId);

  // 驗證 price
  if (typeof price !== "number" || isNaN(price) || price < 0) {
    return { error: "價格必須是有效的非負數字" };
  }

  // 如果提供了 courseId，驗證課程是否存在
  if (courseId) {
    const courseExists = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!courseExists) {
      return { error: "無效的課程 ID，課程不存在" };
    }
  }

  try {
    const product_data = await db.product.create({
      data: {
        title,
        description,
        price,
        IsPublic,
        CoursePorductTypeArray,
        CoursePorductStatueArray,
        courseId,
      },
    });

    console.log("-- Create Product on server -- :", product_data, "-- End --");

    return {
      data: product_data,
    };
  } catch (error) {
    console.log("-- Error -- :", error, "-- End --");
    return { error: error instanceof Error ? error.message : "未知錯誤" };
  }
};

export const CreateProductAction = CreateSafeAction(CreateProductSchema, handler);