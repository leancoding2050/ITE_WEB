// import { z } from "zod";

// export const CreateProductSchema = z.object({
//   title: z.string().min(1, { message: "標題不能為空" }),
//   description: z.string().min(1, { message: "描述不能為空" }),
//   price: z.number().min(1, { message: "價格不能為空" }),
//   IsPublic: z.boolean(),
//   CoursePorductTypeArray: z.array(z.string()),
//   CoursePorductStatueArray: z.array(z.string()),
// });

import { z } from "zod";

export const CreateProductSchema = z.object({
  title: z.string().min(1, { message: "標題不能為空" }),
  description: z.string().min(1, { message: "描述不能為空" }),
  price: z.number().min(1, { message: "價格必須大於 0" }),
  IsPublic: z.boolean(),
  CoursePorductTypeArray: z.array(z.string()),
  CoursePorductStatueArray: z.array(z.string()),
  courseId: z.string().uuid("無效的課程 ID").nullable(),
}).refine((data) => data.CoursePorductTypeArray !== undefined, {
  message: "CoursePorductTypeArray 不能為 undefined",
  path: ["CoursePorductTypeArray"],
}).refine((data) => data.CoursePorductStatueArray !== undefined, {
  message: "CoursePorductStatueArray 不能為 undefined",
  path: ["CoursePorductStatueArray"],
});