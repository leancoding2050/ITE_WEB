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
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CreateProductSchema } from "@/app/actions/Create/Create_Product/schema";
import { CreateProductAction } from "@/app/actions/Create/Create_Product";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

// 定義課程物件的型別，根據 Prisma 的 Course model
interface Course {
  id: string;
  title: string;
  description: string;
  course_code: string;
  school_name: string;
  Coursedates: string[];
  teacher: string[];
  teacher_id: string;
  createdAt: string;
  updatedAt: string;
}

// 定義表單的輸入類型，與 CreateProductSchema 一致
interface FormValues {
  title: string;
  description: string;
  price: number;
  IsPublic: boolean;
  CoursePorductTypeArray: string[];
  CoursePorductStatueArray: string[];
  courseId: string | null;
}

const Create_Product_Form = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [GetCourseListsData, setGetCourseListsData] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseListsData = async () => {
      try {
        const response = await fetch("/api/Course/Get_Course_Lists");
        if (!response.ok) {
          throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setGetCourseListsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "無法獲取課程數據");
      }
    };
    fetchCourseListsData();
  }, []);

  console.log("GetCourseListsData : ", GetCourseListsData, "-- End --");

  const user_Product_form = useForm<FormValues>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      IsPublic: false,
      CoursePorductTypeArray: [],
      CoursePorductStatueArray: [],
      courseId: null,
    },
  });

  // 當選擇課程時，自動填充 title 和 description
  const handleCourseSelect = (course: Course) => {
    setSelectedCourseId(course.id);
    user_Product_form.setValue("title", course.title);
    user_Product_form.setValue("description", course.description);
    user_Product_form.setValue("courseId", course.id);
  };

  const user_Product_form_onSubmit = (values: FormValues) => {
    console.log(
      "-- 商品輸入數據 -- :",
      values,
      "-- price type -- :",
      typeof values.price,
      "-- 結束 --"
    );
    startTransition(async () => {
      try {
        const result = await CreateProductAction(values);
        console.log("-- 服務端響應 -- :", result, "-- 結束 --");
        if (!result.error) {
          router.push(`/admin/ProductLists`);
        } else {
          user_Product_form.setError("root", {
            type: "manual",
            message: result.error || "提交失敗，請重試",
          });
        }
      } catch (error) {
        console.error("提交時發生錯誤:", error);
        user_Product_form.setError("root", {
          type: "manual",
          message: "提交失敗，請重試",
        });
      }
    });
  };

  console.log("-- 產品表單狀態 -- :", user_Product_form.formState.errors, "-- 結束 --");

  return (
    <div className="container mx-auto p-4 flex gap-6">
      {/* 左邊課程列表 */}
      <div className="w-1/3">
        <h2 className="text-xl font-semibold mb-4">選擇課程</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {GetCourseListsData.length > 0 ? (
          <div className="grid gap-2">
            {GetCourseListsData.map((course) => (
              <div
                key={course.id}
                className={`p-3 border rounded cursor-pointer hover:bg-gray-100 ${
                  selectedCourseId === course.id ? "bg-blue-100 border-blue-500" : ""
                }`}
                onClick={() => handleCourseSelect(course)}
              >
                <h3 className="font-medium">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.description}</p>
                <p className="text-sm text-gray-500">課程代碼: {course.course_code}</p>
                <p className="text-sm text-gray-500">學校: {course.school_name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">無課程數據</div>
        )}
      </div>

      {/* 右邊表單 */}
      <div className="w-2/3">
        <h1 className="text-2xl font-bold mb-4">創建產品</h1>
        <Form {...user_Product_form}>
          <form onSubmit={user_Product_form.handleSubmit(user_Product_form_onSubmit)} className="space-y-4">
            <FormField
              control={user_Product_form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>標題</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="標題" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={user_Product_form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="描述" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={user_Product_form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>價格</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="價格"
                      type="number"
                      min="0"
                      step="1"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={user_Product_form.control}
              name="IsPublic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>是否公開</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 隱藏的 courseId 欄位 */}
            <FormField
              control={user_Product_form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem hidden>
                  <FormControl>
                    <Input {...field} value={field.value || ""} type="hidden" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              提交
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Create_Product_Form;