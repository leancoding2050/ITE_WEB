"use server"

import { db } from "@/lib/db" 
import { CreateAccountsSchema } from "./schema"
import type { InputType, ReturnType } from "./types";
import { CreateSafeAction } from "@/lib/create-safe-action";


const handler = async (data: InputType) : Promise<ReturnType> => { 

    const {  cilent_name , date , title , description , price , total , client_id} = data;

    let Accounts_data;

    try {
        Accounts_data = await db.accounts.create({
            data: {
                cilent_name,
                date,
                title,
                description,
                price,
                total,
                client_id
            }
        })
        
        console.log("-- Create Accounts on server-- : ",Accounts_data,"-- End --");

        return{
            data: Accounts_data
        }

    } catch (error) {
        console.log("error : ", error , "-- End --")

        return{ error: error instanceof Error ? error.message : "未知錯誤", }
    }
} 

export const CreateAccountsAction = CreateSafeAction(CreateAccountsSchema, handler)

// // app/actions/Create/Create_Accounts/index.ts
// 'use server';

// import { db } from '@/lib/db';
// import { CreateAccountsSchema } from './schema';
// import type { InputType, ReturnType } from './types';
// import { CreateSafeAction } from '@/lib/create-safe-action';

// // 更新 InputType，包含 statuename
// export type InputType = {
//   cilent_name: string; // 注意：應更正為 client_name
//   date: string;
//   title: string;
//   description: string;
//   price: number;
//   total: number;
//   client_id: string;
//   statuename: string; // 新增 statuename
// };

// // 更新 ReturnType，與 Prisma 模型一致
// export type ReturnType = {
//   data?: {
//     id: string;
//     cilent_name: string;
//     title: string;
//     description: string;
//     price: number;
//     total: number;
//     date: string;
//     client_id: string;
//     statuename: string;
//     createdAt: Date;
//     updatedAt: Date;
//   };
//   error?: string;
// };

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { cilent_name, date, title, description, price, total, client_id, statuename } = data;

//   let Accounts_data;

//   try {
//     Accounts_data = await db.accounts.create({
//       data: {
//         cilent_name,
//         date,
//         title,
//         description,
//         price,
//         total,
//         client_id,
//         statuename, // 提供 statuename
//       },
//     });

//     console.log('-- Create Accounts on server-- : ', Accounts_data, '-- End --');

//     return {
//       data: Accounts_data,
//     };
//   } catch (error) {
//     console.log('error : ', error, '-- End --');
//     return { error: error instanceof Error ? error.message : '未知錯誤' };
//   }
// };

// export const CreateAccountsAction = CreateSafeAction(CreateAccountsSchema, handler);