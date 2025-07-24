import { z } from "zod"; 
import { ActionState } from "@/lib/create-safe-action";
import { CreateProductSchema } from "./schema";
import { product } from "@prisma/client";




export type InputType = z.infer<typeof CreateProductSchema>;
export type ReturnType = ActionState<InputType , product>

