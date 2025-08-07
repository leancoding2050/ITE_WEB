import { z } from "zod"; 

export const CreateAccountsSchema = z.object({
    cilent_name: z.string(),
    title: z.string(),
    description: z.string(),
    price: z.number(),
    total: z.number(),
    date: z.string(),
    client_id: z.string(),
})

// // app/actions/Create/Create_Accounts/schema.ts
// import { z } from 'zod';

// export const CreateAccountsSchema = z.object({
//   cilent_name: z.string().min(1, '客戶名稱不能為空'),
//   date: z.string().min(1, '日期不能為空'),
//   title: z.string().min(1, '標題不能為空'),
//   description: z.string().min(1, '描述不能為空'),
//   price: z.number().positive('價格必須大於 0'),
//   total: z.number().positive('總額必須大於 0'),
//   client_id: z.string().min(1, '客戶 ID 不能為空'),
//   statuename: z.string().min(1, '狀態名稱不能為空'), // 新增 statuename
// });