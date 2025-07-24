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
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { Switch } from "@/components/ui/switch";
import { CreateHomemadeAction } from "@/app/actions/Create/Create_Homemade";
import { CreateHomemadeSchema } from "@/app/actions/Create/Create_Homemade/schema";

const Create_Homemade_Form = () => {
  const [isPending, startTransition] = useTransition();
  const [dayStart, setDayStart] = useState("");
  const [dayEnd, setDayEnd] = useState("");
  const [error, setError] = useState<string | null>(null);

  const HomeMade_create_form = useForm<z.infer<typeof CreateHomemadeSchema>>({
    resolver: zodResolver(CreateHomemadeSchema),
    defaultValues: {
      title: "",
      description: "",
      Homemade_code: "",
      school_name: "",
      date_start: "",
      date_end: "",
      time_h: 0,
      teacher: [],
      Ispublic: false,
      time: "",
      day: "",
    },
  });

  const HomeMade_create_form_onSubmit = async (
    values: z.infer<typeof CreateHomemadeSchema>
  ) => {
    console.log("-- 自家課程输入数据 -- :", values, "-- 结束 --");
    setError(null);
    startTransition(async () => {
      try {
        const result = await CreateHomemadeAction(values);
        if (result.error) {
          setError(result.error);
        } else {
          console.log("課程創建成功:", result);
        }
      } catch (err) {
        setError("創建課程失敗，請稍後重試");
      }
    });
  };

  return (
    <>
      <Form {...HomeMade_create_form}>
        <form
          onSubmit={HomeMade_create_form.handleSubmit(HomeMade_create_form_onSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={HomeMade_create_form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>標題</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="標題"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={HomeMade_create_form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="描述"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={HomeMade_create_form.control}
              name="Homemade_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>課程代碼</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="課程代碼"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={HomeMade_create_form.control}
              name="school_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>學校名稱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="學校名稱"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={HomeMade_create_form.control}
              name="date_start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>開始日期</FormLabel>
                  <FormControl>
                    <Controller
                      name="date_start"
                      control={HomeMade_create_form.control}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          value={value ? new Date(value) : null}
                          format="YYYY-MM-DD"
                          onChange={(date) => {
                            const isoDate = date ? date.format("YYYY-MM-DD") : "";
                            onChange(isoDate);
                            setDayStart(isoDate);
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={HomeMade_create_form.control}
              name="date_end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>結束日期</FormLabel>
                  <FormControl>
                    <Controller
                      name="date_end"
                      control={HomeMade_create_form.control}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          value={value ? new Date(value) : null}
                          format="YYYY-MM-DD"
                          onChange={(date) => {
                            const isoDate = date ? date.format("YYYY-MM-DD") : "";
                            onChange(isoDate);
                            setDayEnd(isoDate);
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={HomeMade_create_form.control}
              name="time_h"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>時數</FormLabel>
                  <FormControl>
                    <Controller
                      name="time_h"
                      control={HomeMade_create_form.control}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          value={value ? new Date(value) : null}
                          onChange={(date) => onChange(date ? date.toDate() : null)}
                          // @ts-ignore 臨時解決 onlyTimePicker 類型錯誤
                          onlyTimePicker
                          format="HH:mm"
                          plugins={[<TimePicker position="bottom" />]}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={HomeMade_create_form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>時間</FormLabel>
                  <FormControl>
                    <Controller
                      name="time"
                      control={HomeMade_create_form.control}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          value={value ? new Date(value) : null}
                          onChange={(date) => onChange(date ? date.toDate() : null)}
                          // @ts-ignore 臨時解決 onlyTimePicker 類型錯誤
                          onlyTimePicker
                          format="HH:mm"
                          plugins={[<TimePicker position="bottom" />]}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={HomeMade_create_form.control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>星期</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="星期"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={HomeMade_create_form.control}
              name="teacher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>教師</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="教師（以逗號分隔）"
                      type="text"
                      onChange={(e) => {
                        const teachers = e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t);
                        field.onChange(teachers);
                      }}
                      value={field.value.join(", ")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={HomeMade_create_form.control}
              name="Ispublic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>是否公開</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button type="submit" disabled={isPending}>
            提交
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Create_Homemade_Form;