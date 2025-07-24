"use client"


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
import { CreateERBSchema } from "@/app/actions/Create/Create_ERB/schema";
import { CreateERBAction } from "@/app/actions/Create/Create_ERB";



const Create_ERB_Form = () => {
    const [ isPending , startTransition ] = useTransition();  
  const [dayStart, setDayStart] = useState("");
  const [dayEnd, setDayEnd] = useState("");


    const ERB_create_form = useForm<z.infer<typeof CreateERBSchema>>({
      resolver: zodResolver(CreateERBSchema),
      defaultValues: {
        title: "",
        description: "",
        school_name:"",
        time_h:0,
        time:'',
        teacher:[],
        Ispublic:false,
        date_start:"",
        date_end:"",
      },
    })


    const ERB_create_form_onSubmit = (values: z.infer<typeof CreateERBSchema>) => {
        console.log("-- ERB输入数据 -- :", values, "-- 结束 --");
    startTransition(() => {
      CreateERBAction(values);
    });

    }


  return (
    <>
     <Form {...ERB_create_form} >
            <form onSubmit={ERB_create_form.handleSubmit(ERB_create_form_onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={ERB_create_form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="title"
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
              control={ERB_create_form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="description"
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
              control={ERB_create_form.control}
              name="school_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>school_name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="school_name"
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
              control={ERB_create_form.control}
              name="date_start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>開始日期</FormLabel>
                  <FormControl>
                    <Controller
                      name="date_start"
                      control={ERB_create_form.control}
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
              control={ERB_create_form.control}
              name="date_end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>結束日期</FormLabel>
                  <FormControl>
                    <Controller
                      name="date_end"
                      control={ERB_create_form.control}
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
              control={ERB_create_form.control}
              name="time_h"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>時數</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="時數"
                      type="number"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={ERB_create_form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>時間</FormLabel>
                  <FormControl>
                    <Controller
                      name="time"
                      control={ERB_create_form.control}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          value={value ? new Date(value) : null}
                          onChange={(date) => onChange(date ? date.toDate() : null)}
                          // @ts-ignore 臨時解決 onlyTimePicker 類型錯誤
                          onlyTimePicker
                          format="HH:mm:ss"
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
              control={ERB_create_form.control}
              name="teacher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>teacher</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="teacher"
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
              control={ERB_create_form.control}
              name="Ispublic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ispublic</FormLabel>
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

              <Button type="submit" >
                提交
              </Button>

            </form>
          </Form>
    </>
  )
}

export default Create_ERB_Form