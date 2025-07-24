"use server"

import { db } from "@/lib/db" 
import { CreateCourseModulSchema } from "./schema"
import { InputType, ReturnType } from "./types";
// import { redirect } from "next/navigation";
import { CreateSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType) : Promise<ReturnType> => { 

    const {  title,description  ,TeacherId} = data;

    let coursemodul_data;

    try {
        coursemodul_data = await db.courseModul.create({
            data: {
                title,
                description,
                TeacherId,
            },
            }
        )
        
        console.log("-- Create coursemodul on server-- : ",coursemodul_data,"-- End --");

        return{
            data: coursemodul_data
        }

    } catch (error) {
        console.log("error : ", error , "-- End --")

        return{ error: error instanceof Error ? error.message : "未知錯誤", }
    }
} 

export const CreateCourseModulAction = CreateSafeAction(CreateCourseModulSchema, handler)