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
import { useParams ,useRouter} from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { EditADminCourseSchema } from "@/app/actions/Edit/Edit_AdminCourse/schema";
import { EditAdminCourseAction } from "@/app/actions/Edit/Edit_AdminCourse";

interface Teacher {
  id: string;
  username: string;
  role: "TEACHER" | "USER" | "ADMIN"; // 與 UserRole 枚舉一致
}

const EditAdminCourseForm = () => {
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // 定義表單
  const form = useForm<z.infer<typeof EditADminCourseSchema>>({
    resolver: zodResolver(EditADminCourseSchema),
    defaultValues: {
      courseId,
      teacher: [],
      schoolName: "",
      classroom: undefined, // 與 schema 一致
    },
  });

  // 獲取課程數據
  useEffect(() => {
    const fetchCourseDataById = async () => {
      try {
        const res = await fetch(`/api/Course/Get_Course_Lists_by_Id/${courseId}`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        // 直接使用 data 設置表單預設值
        form.reset({
          courseId,
          teacher: data.teacher || [],
          schoolName: data.schoolName || "",
          classroom: data.classroom || undefined,
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "無法載入課程數據");
      }
    };

    fetchCourseDataById();
  }, [courseId, form]);

  // 獲取教師列表（role 為 TEACHER）
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch("/api/user/teacher/teacherLists");
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setTeachers(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "無法載入教師列表");
      }
    };

    fetchTeachers();
  }, []);

  // 提交表單
  const onSubmit = (values: z.infer<typeof EditADminCourseSchema>) => {
    startTransition(async () => {
      const result = await EditAdminCourseAction(values);
      
      
      if (result.error) {
        toast.error(result.error);
        
      } else {
        toast.success("課程更新成功");
        router.push(`/admin/CourseLists/`);
      }
    });
  };

  console.log("bug : ", form.formState.errors  , "-- End --");
  console.log("teachers : ", teachers  , "-- End --");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="schoolName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>學校名稱</FormLabel>
              <FormControl>
                <Input placeholder="輸入學校名稱" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classroom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>課室</FormLabel>
              <FormControl>
                <Input
                  placeholder="輸入課室"
                  {...field}
                  value={field.value ?? ""}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
  control={form.control}
  name="teacher"
  render={({ field }) => (
    <FormItem>
      <FormLabel>教師</FormLabel>
      <div className="space-y-2">
        {teachers
          .filter((teacher) => teacher.role === "TEACHER") // 確保只有 TEACHER 角色顯示
          .map((teacher) => (
            <FormItem
              key={teacher.id}
              className="flex items-center space-x-2"
            >
              <FormControl>
                <Checkbox
                  checked={field.value.includes(teacher.id)}
                  onCheckedChange={(checked) => {
                    const newValue = checked
                      ? [...field.value, teacher.id]
                      : field.value.filter((id) => id !== teacher.id);
                    field.onChange(newValue);
                  }}
                  disabled={isPending}
                />
              </FormControl>
              <FormLabel className="font-normal">
                {teacher.username}
              </FormLabel>
            </FormItem>
          ))}
      </div>
      <FormMessage />
    </FormItem>
  )}
/>
        <Button type="submit" disabled={isPending}>
          {isPending ? "正在提交..." : "提交"}
        </Button>
      </form>
    </Form>
  );
};

export default EditAdminCourseForm;