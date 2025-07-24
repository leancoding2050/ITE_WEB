import { z } from "zod";


 export const EditTeacherHolidaySchema = z.object({
   TeacherId: z.string(),
    date: z.array(z.string()),
 })