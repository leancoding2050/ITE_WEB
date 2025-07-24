"use client";


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useParams, useRouter } from "next/navigation";
import { CreateTypeAction } from "@/app/actions/Create/Create_Type";
import { CreateSTypeSchema } from "@/app/actions/Create/Create_Type/schema";
import { useSession } from "next-auth/react";

interface GetTeacher {
  id: string;
  username: string;
  password: string;
  phone: string;
  name: string;
  role: string;
}
const CreateTypeForm_admin = () => { 
    const [isPending, startTransition] = useTransition();
    const router = useRouter();   
    const params = useParams();
    console.log("params : ",  params)
    const TeacherId = params.Teacherid as string;
    const [GetTeacherData , setGetTeacherData] = useState<GetTeacher| null>(null);
    const session = useSession();

    console.log("session : ", session , "-- End --")
    console.log("id : ",session.data?.user?.id , "-- End --" )
    const UserId = session.data?.user?.id || "";


    useEffect(()=>{
      const fetchTeacherData = async (UserId : string) => {
        const response = await fetch(`/api/user/Get_User_Lists_by_Id/${UserId}`);
        const data = await response.json();
        setGetTeacherData(data);
      };
        fetchTeacherData(UserId);
    },[UserId])


    console.log("GetTeacherData : ", GetTeacherData , "-- End --")



const UserRole = GetTeacherData?.role || "";

console.log("UserRole : ", UserRole , "-- End --")

      const statue_form = useForm<z.infer<typeof CreateSTypeSchema>>({
        resolver: zodResolver(CreateSTypeSchema),
        defaultValues: {
          typename: "",
          author:"",  // 作者 是用role 的權限
          role:"",
        },
      });


     
        statue_form.setValue("role", UserRole);
        statue_form.setValue("author", UserRole);
      

        const statue_form_onSubmit = (values: z.infer<typeof CreateSTypeSchema>) => {
          console.log("-- holiday輸入數據 -- :", values, "-- 結束 --");
          startTransition(async () => {
            try {
              const result = await CreateTypeAction(values);
              // 檢查是否有錯誤
              if (!result.error) {
                router.push(`/admin/TypeLists`); // 無錯誤表示成功，導航
              } else {
                console.error("提交失敗:", result.error);
                statue_form.setError("root", {
                  type: "manual",
                  message: result.error || "提交失敗，請重試",
                });
              }
            } catch (error) {
              console.error("提交時發生錯誤:", error);
              statue_form.setError("root", {
                type: "manual",
                message: "提交失敗，請重試",
              });
            }
          });
        };



console.log("Error:",statue_form.formState.errors,"-- End --" )

          return (
            <Form {...statue_form}>
              <form onSubmit={statue_form.handleSubmit(statue_form_onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={statue_form.control}
              name="typename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>類型</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="類型"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


                <Button type="submit" disabled={isPending} className="mt-4">
                  {isPending ? "提交中..." : "提交"}
                </Button>
                {statue_form.formState.errors.root && (
                  <p className="text-red-500 mt-2">{statue_form.formState.errors.root.message}</p>
                )}
              </form>
            </Form>
          );
    
};

export default CreateTypeForm_admin;