import { z } from "zod"; 
import  type { ActionState } from "@/lib/create-safe-action";
import { CreateAccountsSchema } from "./schema";
import type { Accounts } from "@prisma/client";

export type InputType = z.infer<typeof CreateAccountsSchema>;
export type ReturnType = ActionState<InputType , Accounts>