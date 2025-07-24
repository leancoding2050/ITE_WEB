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
import DatePicker from "react-multi-date-picker";
import { useParams, useRouter } from "next/navigation";
import { EditTeacherHolidayAction } from "@/app/actions/Edit/Edit_TeacherHoliday";
import { EditTeacherHolidaySchema } from "@/app/actions/Edit/Edit_TeacherHoliday/schema";

interface TeacherHoliday {
  id: string;
  date: string[];
  createdAt?: string;
  updatedAt?: string;
}

const EditTeacherHolidayForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();
  console.log("params : ", params, " -- End -- ");
  const Teacherid = params.Teacherid as string;
  const Teacherholidaysid = params.teacherholidaysid as string;
  const [getTeacherHoliday, setGetTeacherHoliday] = useState<TeacherHoliday | null>(null);

  useEffect(() => {
    const fetchTeacherHoliday = async (Teacherholidaysid: string) => {
      try {
        const res = await fetch(`/api/Holiday/Get_TeacherHoliday_Lists_by_Id/${Teacherholidaysid}`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setGetTeacherHoliday(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTeacherHoliday(Teacherholidaysid);
  }, [Teacherholidaysid]);

  const Edit_teacher_holiday_form = useForm<z.infer<typeof EditTeacherHolidaySchema>>({
    resolver: zodResolver(EditTeacherHolidaySchema),
    defaultValues: {
      id: Teacherholidaysid,
      date: [],
    },
  });

  // 當 getTeacherHoliday 更新時，設置表單的 date 值
  useEffect(() => {
    if (getTeacherHoliday && getTeacherHoliday.date) {
      Edit_teacher_holiday_form.reset({
        id: Teacherholidaysid,
        date: getTeacherHoliday.date,
      });
    }
  }, [getTeacherHoliday, Edit_teacher_holiday_form, Teacherholidaysid]);

  const Edit_teacher_holiday_form_onSubmit = (values: z.infer<typeof EditTeacherHolidaySchema>) => {
    console.log("-- holiday輸入數據 -- :", values, "-- 結束 --");
    startTransition(async () => {
      try {
        const result = await EditTeacherHolidayAction(values);
        if (!result.error) {
          router.push(`/teacher/${Teacherid}/calendar`);
        } else {
          console.error("提交失敗:", result.error);
          Edit_teacher_holiday_form.setError("root", {
            type: "manual",
            message: result.error || "提交失敗，請重試",
          });
        }
      } catch (error) {
        console.error("提交時發生錯誤:", error);
        Edit_teacher_holiday_form.setError("root", {
          type: "manual",
          message: "提交失敗，請重試",
        });
      }
    });
  };

  console.log("-- getTeacherHoliday -- : ", getTeacherHoliday, " -- END -- ");
  console.log("-- BUG -- : ", Edit_teacher_holiday_form.formState.errors, " -- END -- ");

  return (
    <Form {...Edit_teacher_holiday_form}>
      <form onSubmit={Edit_teacher_holiday_form.handleSubmit(Edit_teacher_holiday_form_onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={Edit_teacher_holiday_form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>選擇假期日期</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={(dates) => {
                      const formattedDates = dates
                        ? dates.map((date: any) => date.format("YYYY-MM-DD"))
                        : [];
                      field.onChange(formattedDates);
                    }}
                    multiple
                    format="YYYY-MM-DD"
                    placeholder="選擇日期"
                    className="w-full"
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
        {Edit_teacher_holiday_form.formState.errors.root && (
          <p className="text-red-500 mt-2">{Edit_teacher_holiday_form.formState.errors.root.message}</p>
        )}
      </form>
    </Form>
  );
};

export default EditTeacherHolidayForm;