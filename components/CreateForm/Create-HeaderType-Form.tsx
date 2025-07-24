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
import { CreateHeaderTypeAction } from "@/app/actions/Create/Create_HeaderType";
import { CreateHeaderTypeSchema } from "@/app/actions/Create/Create_HeaderType/schema";

const CreateHeaderTypeForm = () => { 
    const [isPending, startTransition] = useTransition();
     const router = useRouter();

    const headertype_form = useForm<z.infer<typeof CreateHeaderTypeSchema>>({
        resolver: zodResolver(CreateHeaderTypeSchema),
            defaultValues: {
              HeaderTypeName: "",
        },
    });
    
    const headertype_form_onSubmit = (values: z.infer<typeof CreateHeaderTypeSchema>) => {
        console.log("-- 輸入數據 -- :", values, "-- 結束 --");
 startTransition(async () => {
            try {
              const result = await CreateHeaderTypeAction(values);
              // 檢查是否有錯誤
              if (!result.error) {
                router.push("/admin/HeaderTypeLists"); // 無錯誤表示成功，導航
              } else {
                console.error("提交失敗:", result.error);
                headertype_form.setError("root", {
                  type: "manual",
                  message: result.error || "提交失敗，請重試",
                });
              }
            } catch (error) {
              console.error("提交時發生錯誤:", error);
              headertype_form.setError("root", {
                type: "manual",
                message: "提交失敗，請重試",
              });
            }
          });
    };



    return (
        <div>
            <Form {...headertype_form}>
            <form onSubmit={headertype_form.handleSubmit(headertype_form_onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={headertype_form.control}
              name="HeaderTypeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>關建字</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="關建字"
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
                {headertype_form.formState.errors.root && (
                  <p className="text-red-500 mt-2">{headertype_form.formState.errors.root.message}</p>
                )}
              </form>
            </Form>
        </div>
    );

};

export default CreateHeaderTypeForm;