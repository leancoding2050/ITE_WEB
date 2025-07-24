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
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { CreateStatueAction } from "@/app/actions/Create/Create_statue";
import { CreateStatueSchema } from "@/app/actions/Create/Create_statue/schema";


const CreateStatueForm = () => { 
    const [isPending, startTransition] = useTransition();
    const router = useRouter();


      const statue_form = useForm<z.infer<typeof CreateStatueSchema>>({
        resolver: zodResolver(CreateStatueSchema),
        defaultValues: {
          statuename: "",
        },
      });


        const statue_form_onSubmit = (values: z.infer<typeof CreateStatueSchema>) => {
          console.log("-- holiday輸入數據 -- :", values, "-- 結束 --");
          startTransition(async () => {
            try {
              const result = await CreateStatueAction(values);
              // 檢查是否有錯誤
              if (!result.error) {
                router.push("/admin/StatueLists"); // 無錯誤表示成功，導航
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

          return (
            <Form {...statue_form}>
              <form onSubmit={statue_form.handleSubmit(statue_form_onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={statue_form.control}
              name="statuename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>狀態</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="狀態"
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

export default CreateStatueForm;