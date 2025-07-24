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
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CreateCourseAction } from "@/app/actions/Create/Create_Course";
import { Switch } from "@/components/ui/switch";
import { useParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "../ui/textarea";
import { CreateCourseTeacherSchema } from "@/app/actions/Create/Create_CourseTeacher/schema";
import { CreateCourseTeacherAction } from "@/app/actions/Create/Create_CourseTeacher";


const Create_CourseTeacher_Form = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();
  const TeacherId = params.Teacherid as string;
  const [GetTypesData, setGetTypesData] = useState<
    { id: string; typename: string }[]
  >([]);
  const [GetCourseModul, setGetCourseModul] = useState<
    { id: string; title: string; description: string }[]
  >([]);
  const [GetTeacherData, setGetTeacherData] = useState<{ name: string } | null>(
    null
  );

  const timeOptions = [
    { id: "morning" as const, label: "上午" },
    { id: "afternoon" as const, label: "下午" },
    { id: "evening" as const, label: "晚上" },
    { id: "full_day" as const, label: "全日" },
  ] as const;

  type TimeRangeValue = "morning" | "afternoon" | "evening" | "full_day";

  const TCourse_create_form = useForm<z.infer<typeof CreateCourseTeacherSchema>>({
    resolver: zodResolver(CreateCourseTeacherSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      course_code: "",
      school_name: "",
      Number_of_days: 0,
      courseModulId: null,
      time_hours: 0,
      teacher: [],
      Ispublic: false,
      Isproduct: false,
      TimeRange: [],
      type: [],
      teacher_id: TeacherId,
      start_date: undefined,
      end_date: undefined,
      start_time: undefined,
      end_time: undefined,
    },
  });

  // 監聽 courseModulId 的變化，動態設置 description
  const selectedCourseModulId = TCourse_create_form.watch("courseModulId");
  useEffect(() => {
    if (selectedCourseModulId && selectedCourseModulId !== "none") {
      const selectedModul = GetCourseModul.find(
        (modul) => modul.id === selectedCourseModulId
      );
      if (selectedModul) {
        TCourse_create_form.setValue("description", selectedModul.description);
      }
    } else {
      TCourse_create_form.setValue("description", "");
    }
  }, [selectedCourseModulId, GetCourseModul, TCourse_create_form]);

  // 設置 teacher 字段的默認值
  useEffect(() => {
    if (GetTeacherData?.name) {
      TCourse_create_form.setValue("teacher", [GetTeacherData.name]);
    }
  }, [GetTeacherData, TCourse_create_form]);

  useEffect(() => {
    const fetchTypesData = async () => {
      try {
        const res = await fetch(`/api/Type/Get_Type_Lists`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const validData = data.filter((item: any) =>
            typeof item === "object" && "id" in item && "typename" in item
          );
          setGetTypesData(validData);
        } else {
          console.error("Get_Type_Lists API 返回非陣列資料", data);
          setGetTypesData([]);
        }
      } catch (error) {
        console.error("fetchTypesData error:", error);
        setGetTypesData([]);
      }
    };

    const fetchCourseModul = async () => {
      try {
        const res = await fetch(`/api/Course/Get_CourseModul_Lists`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const validData = data.filter((item: any) =>
            typeof item === "object" && "id" in item && "title" in item && "description" in item
          );
          setGetCourseModul(validData);
        } else {
          console.error("Get_CourseModul_Lists API 返回非陣列資料", data);
          setGetCourseModul([]);
        }
      } catch (error) {
        console.error("fetchCourseModul error:", error);
        setGetCourseModul([]);
      }
    };

    const fetchUserData = async (TeacherId: string) => {
      try {
        const res = await fetch(`/api/user/Get_User_Lists_by_Id/${TeacherId}`);
        const data = await res.json();
        if (data && typeof data === "object" && "name" in data) {
          setGetTeacherData(data);
        } else {
          console.error("fetchUserData 返回無效數據", data);
          setGetTeacherData(null);
        }
      } catch (error) {
        console.error("fetchUserData error:", error);
        setGetTeacherData(null);
      }
    };

    fetchUserData(TeacherId);
    fetchTypesData();
    fetchCourseModul();
  }, [TeacherId]);

  console.log("GetTypesData: ", GetTypesData);
  console.log("GetCourseModul: ", GetCourseModul);
  console.log("GetTeacherData: ", GetTeacherData);

  const TCourse_create_form_onSubmit: SubmitHandler<
    z.infer<typeof CreateCourseTeacherSchema>
  > = (values) => {
    console.log("-- 課程輸入數據 -- :", values, "-- 結束 --");
    startTransition(() => {
      CreateCourseTeacherAction(values).then((result) => {
        if (result.data) {
          router.push(`/teacher/${TeacherId}/CourseLists`);
        } else {
          console.error("Create course failed:", result.error);
          alert(result.error || "創建課程失敗，請稍後重試");
        }
      });
    });
  };

  console.log("Error: ", TCourse_create_form.formState.errors, "-- End --");

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6">創建課程</h1>
        <Form {...TCourse_create_form}>
          <form
            onSubmit={TCourse_create_form.handleSubmit(TCourse_create_form_onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={TCourse_create_form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">標題</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入課程標題"
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={TCourse_create_form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">描述</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        placeholder="輸入課程描述"
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={TCourse_create_form.control}
                name="course_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">課程代碼</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入課程代碼"
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={TCourse_create_form.control}
                name="school_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">學校名稱</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入學校名稱"
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={TCourse_create_form.control}
                name="Number_of_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">課程天數</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入課程天數"
                        type="number"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value || ""}
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={TCourse_create_form.control}
                name="TimeRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">時段</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {timeOptions.map((time) => (
                          <div key={time.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={time.id}
                              checked={field.value?.includes(time.id) || false}
                              onCheckedChange={(checked) => {
                                const currentValues = Array.isArray(field.value)
                                  ? (field.value as TimeRangeValue[])
                                  : [];
                                if (checked) {
                                  field.onChange([...currentValues, time.id]);
                                } else {
                                  field.onChange(
                                    currentValues.filter((v) => v !== time.id)
                                  );
                                }
                              }}
                              disabled={isPending}
                              className="border-gray-600 data-[state=checked]:bg-gray-600"
                            />
                            <label
                              htmlFor={time.id}
                              className="text-sm font-medium text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {time.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={TCourse_create_form.control}
                name="time_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">課程時數</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入課程時數"
                        type="number"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value || ""}
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={TCourse_create_form.control}
                name="teacher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">教師 (以逗號分隔)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="老師名稱"
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter((t) => t.length > 0)
                          )
                        }
                        value={field.value.join(", ")}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={TCourse_create_form.control}
                name="Ispublic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">是否公開</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                        className="data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-gray-700"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={TCourse_create_form.control}
                name="courseModulId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">課程模組</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                        value={field.value ?? "none"}
                        disabled={isPending}
                      >
                        <SelectTrigger className="bg-gray-700 text-white border-gray-600 focus:border-gray-500">
                          <SelectValue placeholder="選擇課程模組" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 text-white border-gray-600">
                          <SelectItem value="none">無模組</SelectItem>
                          {GetCourseModul.map((modul) => (
                            <SelectItem key={modul.id} value={modul.id}>
                              {modul.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={TCourse_create_form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">課程類型</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {GetTypesData.map((type) => (
                          <div key={type.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={type.id}
                              checked={field.value.includes(type.id)}
                              onCheckedChange={(checked) => {
                                const currentValues = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                if (checked) {
                                  field.onChange([...currentValues, type.id]);
                                } else {
                                  field.onChange(
                                    currentValues.filter((v) => v !== type.id)
                                  );
                                }
                              }}
                              disabled={isPending}
                              className="border-gray-600 data-[state=checked]:bg-gray-600"
                            />
                            <label
                              htmlFor={type.id}
                              className="text-sm font-medium text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {type.typename}
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <input
              type="hidden"
              value={TeacherId}
              {...TCourse_create_form.register("teacher_id")}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              提交
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Create_CourseTeacher_Form;


















              {/* <FormField
                control={Course_create_form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">開始日期（可選）</FormLabel>
                    <FormControl>
                      <DatePicker
                        format="YYYY-MM-DD"
                        value={field.value ? new Date(field.value) : null}
                        onChange={(value) => {
                          console.log("start_date value:", value);
                          field.onChange(
                            value ? value.toDate().toISOString().split("T")[0] : undefined
                          );
                        }}
                        disabled={isPending}
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              /> */}
              {/* <FormField
                control={Course_create_form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">結束日期（可選）</FormLabel>
                    <FormControl>
                      <DatePicker
                        format="YYYY-MM-DD"
                        value={field.value ? new Date(field.value) : null}
                        onChange={(value) => {
                          console.log("end_date value:", value);
                          field.onChange(
                            value ? value.toDate().toISOString().split("T")[0] : undefined
                          );
                        }}
                        disabled={isPending}
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              /> */}
              {/* <FormField
                control={Course_create_form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">開始時間（可選）</FormLabel>
                    <FormControl>
                      <DatePicker
                        disableDayPicker
                        format="HH:mm"
                        plugins={[<TimePicker position="bottom" />]}
                        value={field.value ? field.value : null}
                        onChange={(value) => {
                          console.log("start_time value:", value);
                          field.onChange(value ? value.format("HH:mm") : undefined);
                        }}
                        disabled={isPending}
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              /> */}
              {/* <FormField
                control={Course_create_form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">結束時間（可選）</FormLabel>
                    <FormControl>
                      <DatePicker
                        disableDayPicker
                        format="HH:mm"
                        plugins={[<TimePicker position="bottom" />]}
                        value={field.value ? field.value : null}
                        onChange={(value) => {
                          console.log("end_time value:", value);
                          field.onChange(value ? value.format("HH:mm") : undefined);
                        }}
                        disabled={isPending}
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              /> */}