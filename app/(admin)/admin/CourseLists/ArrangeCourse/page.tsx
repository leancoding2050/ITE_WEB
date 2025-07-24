// "use client";

// import { useEffect, useState, useRef } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { format, parseISO, addDays, differenceInDays, getDay, addWeeks } from "date-fns";
// import { CreateCourseSchema } from "@/app/actions/Create/Create_Course/schema";

// // // 定義表單 schema，新增週份和課室欄位
// // const CourseDateSchema = z.object({
// //   start_date: z.string().optional().nullable(),
// //   end_date: z.string().optional().nullable(),
// //   start_time: z.string().optional().nullable(),
// //   end_time: z.string().optional().nullable(),
// //   weekday: z.string().optional().nullable(), // 新增週份欄位
// //   classroom: z.string().optional().nullable(), // 新增課室欄位
// // });

// type CourseDateForm = z.infer<typeof CreateCourseSchema>;

// type Course = {
//   id: string;
//   title: string;
//   description: string;
//   course_code: string;
//   school_name: string;
//   Number_of_days: number;
//   time_hours: number;
//   TimeRange: string[];
//   teacher: string[];
//   teacher_id: string;
//   Ispublic: boolean;
//   type: string[];
//   courseModulId: string | null;
//   start_date: string | null;
//   end_date: string | null;
//   start_time: string | null;
//   end_time: string | null;
//   Coursedates: string[];
//   classroom: string | null; // 新增課室欄位
//   createdAt: string;
//   updatedAt: string;
// };

// const ArrangeCoursePage = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
//   const [calendarDates, setCalendarDates] = useState<string[]>([]);
//   const [dateRangeError, setDateRangeError] = useState<string | null>(null);
//   const calendarRef = useRef<FullCalendar>(null);

//   // 表單鉤子
//   const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<CourseDateForm>({
//     resolver: zodResolver(CreateCourseSchema),
//     defaultValues: {
//       weekday: null,
//       classroom: null,
//     },
//   });

//   // 監聽表單中的 start_date、end_date 和 weekday
//   const startDate = watch("start_date");
//   const endDate = watch("end_date");
//   const selectedWeekday = watch("weekday");

//   // 定義星期對應（0: 星期日, 1: 星期一, ..., 6: 星期六）
//   const weekdays = [
//     { value: "0", label: "星期日" },
//     { value: "1", label: "星期一" },
//     { value: "2", label: "星期二" },
//     { value: "3", label: "星期三" },
//     { value: "4", label: "星期四" },
//     { value: "5", label: "星期五" },
//     { value: "6", label: "星期六" },
//   ];

//   // 獲取課程數據
//   useEffect(() => {
//     const fetchCourseData = async () => {
//       try {
//         const response = await fetch("/api/Course/Get_Course_Lists");
//         if (!response.ok) {
//           throw new Error(`請求失敗: ${response.status}`);
//         }
//         const data = await response.json();
//         setCourses(data);
//         if (data.length > 0) {
//           setSelectedCourse(data[0]);
//           setCalendarDates(data[0].Coursedates || []);
//           reset({
//             start_date: data[0].start_date || "",
//             end_date: data[0].end_date || "",
//             start_time: data[0].start_time || "",
//             end_time: data[0].end_time || "",
//             classroom: data[0].classroom || "", // 新增課室欄位
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchCourseData();
//   }, [reset]);

//   // 當選擇課程時，更新表單和月曆
//   useEffect(() => {
//     if (selectedCourse) {
//       reset({
//         start_date: selectedCourse.start_date || "",
//         end_date: selectedCourse.end_date || "",
//         start_time: selectedCourse.start_time || "",
//         end_time: selectedCourse.end_time || "",
//         weekday: null,
//         classroom: selectedCourse.classroom || "", // 新增課室欄位
//       });
//       setCalendarDates(selectedCourse.Coursedates || []);
//     }
//   }, [selectedCourse, reset]);

//   // 當 start_date 和 weekday 變化時，自動生成指定星期的日期
//   useEffect(() => {
//     if (selectedCourse && startDate && selectedWeekday !== null && typeof startDate === "string") {
//       const start = parseISO(startDate);
//       const targetWeekday = selectedWeekday ? parseInt(selectedWeekday) : NaN;
//       const newDates: string[] = [];
//       let currentDate = start;
//       let count = 0;

//       // 找到第一個符合指定星期的日期
//       while (getDay(currentDate) !== targetWeekday) {
//         currentDate = addDays(currentDate, 1);
//       }

//       // 生成指定星期的日期，直到滿足 Number_of_days
//       while (count < selectedCourse.Number_of_days) {
//         newDates.push(format(currentDate, "yyyy-MM-dd"));
//         currentDate = addWeeks(currentDate, 1); // 跳到下一個同星期
//         count++;
//       }

//       setCalendarDates(newDates);
//     } else if (selectedCourse && startDate && !selectedWeekday) {
//       // 如果未選擇 weekday，恢復連續日期
//       const start = parseISO(startDate);
//       const newDates: string[] = [];
//       for (let i = 0; i < selectedCourse.Number_of_days; i++) {
//         const date = addDays(start, i);
//         newDates.push(format(date, "yyyy-MM-dd"));
//       }
//       setCalendarDates(newDates);
//     }
//   }, [startDate, selectedWeekday, selectedCourse]);

//   // 當 start_date 或 end_date 變化時，檢查日期範圍是否滿足 Number_of_days
//   useEffect(() => {
//     if (selectedCourse && startDate && endDate && typeof startDate === "string" && typeof endDate === "string") {
//       const start = parseISO(startDate);
//       const end = parseISO(endDate);
//       const daysDifference = differenceInDays(end, start) + 1; // 包含開始和結束日期
//       if (daysDifference < selectedCourse.Number_of_days) {
//         setDateRangeError(
//           `日期範圍（${daysDifference} 天）少於課程持續天數（${selectedCourse.Number_of_days} 天）`
//         );
//       } else {
//         setDateRangeError(null);
//       }
//     } else {
//       setDateRangeError(null);
//     }
//   }, [startDate, endDate, selectedCourse]);

//   // 提交表單更新課程日期
//   const onSubmit = async (data: CourseDateForm) => {
//     if (!selectedCourse) return;

//     // 檢查日期範圍是否有效
//     if (dateRangeError) {
//       alert(dateRangeError);
//       return;
//     }

//     try {
//       const response = await fetch(`/api/Course/Update_Course/${selectedCourse.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...data, Coursedates: calendarDates }),
//       });
//       if (!response.ok) {
//         throw new Error(`更新失敗: ${response.status}`);
//       }
//       const updatedCourse = await response.json();
//       setCourses(courses.map((course) =>
//         course.id === updatedCourse.id ? updatedCourse : course
//       ));
//       setSelectedCourse(updatedCourse);
//     } catch (error) {
//       console.error("Error updating course:", error);
//     }
//   };

//   // 處理日期點擊（新增或移除日期）
//   const handleDateClick = (arg: { dateStr: string }) => {
//     const clickedDate = arg.dateStr;

//     // 檢查是否在 start_date 和 end_date 範圍內
//     if (startDate && endDate && typeof startDate === "string" && typeof endDate === "string") {
//       const start = parseISO(startDate);
//       const end = parseISO(endDate);
//       const clicked = parseISO(clickedDate);
//       if (clicked < start || clicked > end) {
//         alert("只能在開始日期和結束日期之間選擇日期");
//         return;
//       }
//     }

// // 如果選擇了 weekday，檢查點擊的日期是否為指定星期
// if (selectedWeekday !== null && selectedWeekday !== undefined && !isNaN(parseInt(selectedWeekday))) {
//   const clicked = parseISO(clickedDate);
//   if (getDay(clicked) !== parseInt(selectedWeekday)) {
//     alert(`只能選擇${weekdays.find(w => w.value === selectedWeekday)?.label}的日期`);
//     return;
//   }
// }

//     let updatedDates: string[];
//     if (calendarDates.includes(clickedDate)) {
//       // 移除日期
//       updatedDates = calendarDates.filter((date) => date !== clickedDate);
//     } else {
//       // 新增日期
//       updatedDates = [...calendarDates, clickedDate];
//     }

//     // 確保日期數量不超過 Number_of_days
//     if (selectedCourse && updatedDates.length > selectedCourse.Number_of_days) {
//       alert(`課程日期數量不能超過 ${selectedCourse.Number_of_days} 天`);
//       return;
//     }

//     setCalendarDates(updatedDates);
//   };

//   // 處理拖放事件
//   const handleEventDrop = (info: any) => {
//     const newDate = format(info.event.start!, "yyyy-MM-dd");
//     const oldDate = info.oldEvent.start ? format(info.oldEvent.start, "yyyy-MM-dd") : null;

//     // 檢查新日期是否在 start_date 和 end_date 範圍內
//     if (startDate && endDate && typeof startDate === "string" && typeof endDate === "string") {
//       const start = parseISO(startDate);
//       const end = parseISO(endDate);
//       const newDateParsed = parseISO(newDate);
//       if (newDateParsed < start || newDateParsed > end) {
//         alert("只能在開始日期和結束日期之間拖放日期");
//         info.revert();
//         return;
//       }
//     }

// // 如果選擇了 weekday，檢查新日期是否為指定星期
// if (selectedWeekday !== null && selectedWeekday !== undefined && !isNaN(parseInt(selectedWeekday))) {
//   const newDateParsed = parseISO(newDate);
//   if (getDay(newDateParsed) !== parseInt(selectedWeekday)) {
//     alert(`只能拖放到${weekdays.find(w => w.value === selectedWeekday)?.label}的日期`);
//     info.revert();
//     return;
//   }
// }

//     let updatedDates = [...calendarDates];
//     if (oldDate && calendarDates.includes(oldDate)) {
//       updatedDates = updatedDates.filter((date) => date !== oldDate);
//     }
//     if (!updatedDates.includes(newDate)) {
//       updatedDates.push(newDate);
//     }

//     // 確保日期數量不超過 Number_of_days
//     if (selectedCourse && updatedDates.length > selectedCourse.Number_of_days) {
//       alert(`課程日期數量不能超過 ${selectedCourse.Number_of_days} 天`);
//       info.revert();
//       return;
//     }

//     setCalendarDates(updatedDates);
//   };

//   // 將 Coursedates 轉換為 FullCalendar 事件
//   const calendarEvents = calendarDates.map((date) => ({
//     title: selectedCourse?.title || "課程",
//     date,
//     allDay: true,
//     backgroundColor: "#2563eb",
//     borderColor: "#2563eb",
//     textColor: "#ffffff",
//   }));

//   console.log(" courses :", courses ,"-- End --")


//   return (
//     <div className="bg-gray-800 text-white min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-2xl font-bold mb-6">安排課程</h1>
//         {dateRangeError && (
//           <div className="bg-red-600 text-white p-4 rounded-md mb-6">
//             {dateRangeError}
//           </div>
//         )}
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* 左邊：課程列表和表單 */}
//           <div className="md:w-1/2 flex flex-col gap-6">
//             {/* 課程列表 */}
//             <div className="bg-gray-700 rounded-md p-4 shadow-lg">
//               <h2 className="text-lg font-semibold mb-4">課程列表</h2>
//               <div className="space-y-2 max-h-96 overflow-y-auto">
//                 {courses.map((course) => (
//                   <div
//                     key={course.id}
//                     onClick={() => setSelectedCourse(course)}
//                     className={`p-3 rounded-md cursor-pointer hover:bg-gray-600 ${
//                       selectedCourse?.id === course.id ? "bg-gray-600" : ""
//                     }`}
//                   >
//                     <p className="font-medium">{course.title}</p>
//                     <p className="text-sm text-gray-300">{course.course_code}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* 表單 */}
//             {selectedCourse && (
//               <div className="bg-gray-700 rounded-md p-4 shadow-lg">
//                 <h2 className="text-lg font-semibold mb-4">課程詳情</h2>
//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium">開始日期</label>
//                     <input
//                       type="date"
//                       {...register("start_date")}
//                       className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
//                     />
//                     {errors.start_date && (
//                       <p className="text-red-500 text-sm">{errors.start_date.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium">結束日期</label>
//                     <input
//                       type="date"
//                       {...register("end_date")}
//                       className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
//                     />
//                     {errors.end_date && (
//                       <p className="text-red-500 text-sm">{errors.end_date.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium">開始時間</label>
//                     <input
//                       type="time"
//                       {...register("start_time")}
//                       className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
//                     />
//                     {errors.start_time && (
//                       <p className="text-red-500 text-sm">{errors.start_time.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium">結束時間</label>
//                     <input
//                       type="time"
//                       {...register("end_time")}
//                       className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
//                     />
//                     {errors.end_time && (
//                       <p className="text-red-500 text-sm">{errors.end_time.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium">週份</label>
//                     <select
//                       {...register("weekday")}
//                       className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
//                     >
//                       <option value="">選擇星期</option>
//                       {weekdays.map((weekday) => (
//                         <option key={weekday.value} value={weekday.value}>
//                           {weekday.label}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.weekday && (
//                       <p className="text-red-500 text-sm">{errors.weekday.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium">課室</label>
//                     <input
//                       type="text"
//                       {...register("classroom")}
//                       className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
//                       placeholder="輸入課室名稱（可選）"
//                     />
//                     {errors.classroom && (
//                       <p className="text-red-500 text-sm">{errors.classroom.message}</p>
//                     )}
//                   </div>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
//                   >
//                     更新課程
//                   </button>
//                 </form>
//               </div>
//             )}
//           </div>

//           {/* 右邊：月曆 */}
//           <div className="md:w-1/2">
//             <div className="bg-gray-700 rounded-md p-4 shadow-lg">
//               <h2 className="text-lg font-semibold mb-4">課程月曆</h2>
//               <FullCalendar
//                 ref={calendarRef}
//                 plugins={[dayGridPlugin, interactionPlugin]}
//                 initialView="dayGridMonth"
//                 events={calendarEvents}
//                 dateClick={handleDateClick}
//                 editable={true}
//                 selectable={true}
//                 eventBackgroundColor="#2563eb"
//                 eventBorderColor="#2563eb"
//                 eventTextColor="#ffffff"
//                 headerToolbar={{
//                   left: "prev,next today",
//                   center: "title",
//                   right: "dayGridMonth,dayGridWeek,dayGridDay",
//                 }}
//                 height="auto"
//                 eventDrop={handleEventDrop}
//                 validRange={
//                   startDate && endDate
//                     ? {
//                         start: parseISO(startDate),
//                         end: addDays(parseISO(endDate), 1), // 包含 end_date
//                       }
//                     : undefined
//                 }
//               />
//             </div>
//             <style jsx>{`
//               :global(.fc) {
//                 background-color: #4b5563;
//                 border-radius: 0.375rem;
//                 padding: 1rem;
//               }
//               :global(.fc-toolbar) {
//                 background-color: #374151;
//                 color: #ffffff;
//                 border-radius: 0.375rem 0.375rem 0 0;
//               }
//               :global(.fc-button) {
//                 background-color: #2563eb !important;
//                 border: none !important;
//                 border-radius: 0.25rem;
//                 margin: 0.25rem;
//               }
//               :global(.fc-button:hover) {
//                 background-color: #1e40af !important;
//               }
//               :global(.fc-daygrid-day) {
//                 background-color: #4b5563;
//                 color: #ffffff;
//               }
//               :global(.fc-daygrid-day-number) {
//                 color: #ffffff;
//               }
//               :global(.fc-col-header-cell) {
//                 background-color: #374151;
//                 color: #ffffff;
//               }
//               :global(.fc-day-disabled) {
//                 background-color: #1f2937 !important;
//                 opacity: 0.5;
//               }
//             `}</style>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ArrangeCoursePage;



"use client";

import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO, addDays, differenceInDays, getDay, addWeeks } from "date-fns";
import { useRouter } from "next/navigation"; // 引入 useRouter

// 定義表單 schema
const CourseDateSchema = z.object({
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  weekday: z.string().optional().nullable(),
  classroom: z.string().optional().nullable(),
});

type CourseDateForm = z.infer<typeof CourseDateSchema>;

type Course = {
  id: string;
  title: string;
  description: string;
  course_code: string;
  school_name: string;
  Number_of_days: number;
  time_hours: number;
  TimeRange: string[];
  teacher: string[];
  teacher_id: string;
  Ispublic: boolean;
  type: string[];
  courseModulId: string | null;
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  Coursedates: string[];
  weekday: string | null; // ✅ 新增此行
  classroom: string | null;
  createdAt: string;
  updatedAt: string;
};

const timeRangeOptions = {
  morning: { label: "上午", start: "09:00", end: "13:00" },
  afternoon: { label: "下午", start: "14:00", end: "18:00" },
  evening: { label: "晚上", start: "19:00", end: "22:00" },
  full_day: { label: "全天", start: "00:00", end: "23:59" },
};

const ArrangeCoursePage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [calendarDates, setCalendarDates] = useState<string[]>([]);
  const [dateRangeError, setDateRangeError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const router = useRouter(); // 初始化 router

  // 表單鉤子
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<CourseDateForm>({
    resolver: zodResolver(CourseDateSchema),
    defaultValues: {
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      weekday: null,
      classroom: null,
    },
  });

  // 監聽表單中的 start_date、end_date 和 weekday
  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const selectedWeekday = watch("weekday");
  // const startTime = watch("start_time");
  // const endTime = watch("end_time");

  // 定義星期對應
  const weekdays = [
    { value: "0", label: "星期日" },
    { value: "1", label: "星期一" },
    { value: "2", label: "星期二" },
    { value: "3", label: "星期三" },
    { value: "4", label: "星期四" },
    { value: "5", label: "星期五" },
    { value: "6", label: "星期六" },
  ];

  // 獲取課程數據
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch("/api/Course/Get_Course_Lists");
        if (!response.ok) {
          throw new Error(`請求失敗: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0]);
          setCalendarDates(data[0].Coursedates || []);
          setSelectedTimeRange(data[0].TimeRange[0] || null);
          reset({
            start_date: data[0].start_date || "",
            end_date: data[0].end_date || "",
            start_time: data[0].start_time || "",
            end_time: data[0].end_time || "",
            weekday: data[0].weekday || null,
            classroom: data[0].classroom || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCourseData();
  }, [reset]);

  // 當選擇課程時，更新表單和月曆
  useEffect(() => {
    if (selectedCourse) {
      setSelectedTimeRange(selectedCourse.TimeRange[0] || null);
      reset({
        start_date: selectedCourse.start_date || "",
        end_date: selectedCourse.end_date || "",
        start_time: selectedCourse.start_time || "",
        end_time: selectedCourse.end_time || "",
        weekday: selectedCourse.weekday || null,
        classroom: selectedCourse.classroom || "",
      });
      setCalendarDates(selectedCourse.Coursedates || []);
    }
  }, [selectedCourse, reset]);

  // 當 start_date 和 weekday 變化時，自動生成指定星期的日期
  useEffect(() => {
    if (selectedCourse && startDate && startDate !== "") {
      const start = parseISO(startDate);
      const newDates: string[] = [];

      if (selectedWeekday && selectedWeekday !== "") {
        const targetWeekday = parseInt(selectedWeekday);
        let currentDate = start;
        let count = 0;

        while (getDay(currentDate) !== targetWeekday) {
          currentDate = addDays(currentDate, 1);
        }

        while (count < selectedCourse.Number_of_days) {
          newDates.push(format(currentDate, "yyyy-MM-dd"));
          currentDate = addWeeks(currentDate, 1);
          count++;
        }
      } else {
        for (let i = 0; i < selectedCourse.Number_of_days; i++) {
          const date = addDays(start, i);
          newDates.push(format(date, "yyyy-MM-dd"));
        }
      }

      setCalendarDates(newDates);
    } else {
      setCalendarDates([]);
    }
  }, [startDate, selectedWeekday, selectedCourse]);

  // 當 start_date 或 end_date 變化時，檢查日期範圍是否滿足 Number_of_days
  useEffect(() => {
    if (selectedCourse && startDate && startDate !== "" && endDate && endDate !== "") {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const daysDifference = differenceInDays(end, start) + 1;
      if (daysDifference < selectedCourse.Number_of_days) {
        setDateRangeError(
          `日期範圍（${daysDifference} 天）少於課程持續天數（${selectedCourse.Number_of_days} 天）`
        );
      } else {
        setDateRangeError(null);
      }
    } else {
      setDateRangeError(null);
    }
  }, [startDate, endDate, selectedCourse]);

  // 當選擇 TimeRange 時，設置對應的開始和結束時間範圍
  const handleTimeRangeSelect = (timeRange: string) => {
    setSelectedTimeRange(timeRange);
    const { start, end } = timeRangeOptions[timeRange as keyof typeof timeRangeOptions];
    setValue("start_time", start);
    setValue("end_time", end);
  };

  // 提交表單更新課程
  const onSubmit = async (data: CourseDateForm) => {
    if (!selectedCourse) return;

    if (dateRangeError) {
      alert(dateRangeError);
      return;
    }

    try {
      const response = await fetch(`/api/Course/Update_Course/${selectedCourse.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, Coursedates: calendarDates }),
      });
      if (!response.ok) {
        throw new Error(`更新失敗: ${response.status}`);
      }
      const updatedCourse = await response.json();
      setCourses(courses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      ));
      setSelectedCourse(updatedCourse);
      alert("課程更新成功");
      router.push("/admin/CourseLists"); // 成功後跳轉到 /admin/CourseLists
    } catch (error) {
      console.error("Error updating course:", error);
      alert("更新課程失敗，請稍後重試");
    }
  };

  // 處理日期點擊（新增或移除日期）
  const handleDateClick = (arg: { dateStr: string }) => {
    const clickedDate = arg.dateStr;

    if (startDate && startDate !== "" && endDate && endDate !== "") {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const clicked = parseISO(clickedDate);
      if (clicked < start || clicked > end) {
        alert("只能在開始日期和結束日期之間選擇日期");
        return;
      }
    }

    if (selectedWeekday && selectedWeekday !== "") {
      const clicked = parseISO(clickedDate);
      if (getDay(clicked) !== parseInt(selectedWeekday)) {
        alert(`只能選擇${weekdays.find(w => w.value === selectedWeekday)?.label}的日期`);
        return;
      }
    }

    let updatedDates: string[];
    if (calendarDates.includes(clickedDate)) {
      updatedDates = calendarDates.filter((date) => date !== clickedDate);
    } else {
      updatedDates = [...calendarDates, clickedDate];
    }

    if (selectedCourse && updatedDates.length > selectedCourse.Number_of_days) {
      alert(`課程日期數量不能超過 ${selectedCourse.Number_of_days} 天`);
      return;
    }

    setCalendarDates(updatedDates);
  };

  // 處理拖放事件
  const handleEventDrop = (info: any) => {
    const newDate = format(info.event.start!, "yyyy-MM-dd");
    const oldDate = info.oldEvent.start ? format(info.oldEvent.start, "yyyy-MM-dd") : null;

    if (startDate && startDate !== "" && endDate && endDate !== "") {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const newDateParsed = parseISO(newDate);
      if (newDateParsed < start || newDateParsed > end) {
        alert("只能在開始日期和結束日期之間拖放日期");
        info.revert();
        return;
      }
    }

    if (selectedWeekday && selectedWeekday !== "") {
      const newDateParsed = parseISO(newDate);
      if (getDay(newDateParsed) !== parseInt(selectedWeekday)) {
        alert(`只能拖放到${weekdays.find(w => w.value === selectedWeekday)?.label}的日期`);
        info.revert();
        return;
      }
    }

    let updatedDates = [...calendarDates];
    if (oldDate && calendarDates.includes(oldDate)) {
      updatedDates = updatedDates.filter((date) => date !== oldDate);
    }
    if (!updatedDates.includes(newDate)) {
      updatedDates.push(newDate);
    }

    if (selectedCourse && updatedDates.length > selectedCourse.Number_of_days) {
      alert(`課程日期數量不能超過 ${selectedCourse.Number_of_days} 天`);
      info.revert();
      return;
    }

    setCalendarDates(updatedDates);
  };

  // 將 Coursedates 轉換為 FullCalendar 事件
  const calendarEvents = calendarDates.map((date) => ({
    title: selectedCourse?.title || "課程",
    date,
    allDay: true,
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
    textColor: "#ffffff",
  }));

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">安排課程</h1>
        {dateRangeError && (
          <div className="bg-red-600 text-white p-4 rounded-md mb-6">
            {dateRangeError}
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 flex flex-col gap-6">
            <div className="bg-gray-700 rounded-md p-4 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">課程列表</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className={`p-3 rounded-md cursor-pointer hover:bg-gray-600 ${
                      selectedCourse?.id === course.id ? "bg-gray-600" : ""
                    }`}
                  >
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-gray-300">{course.course_code}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedCourse && (
              <div className="bg-gray-700 rounded-md p-4 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">課程詳情</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">開始日期</label>
                    <input
                      type="date"
                      {...register("start_date")}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                    />
                    {errors.start_date && (
                      <p className="text-red-500 text-sm">{errors.start_date.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">結束日期</label>
                    <input
                      type="date"
                      {...register("end_date")}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                    />
                    {errors.end_date && (
                      <p className="text-red-500 text-sm">{errors.end_date.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">時間段</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedCourse.TimeRange.map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() => handleTimeRangeSelect(range)}
                          className={`px-4 py-2 rounded-md ${
                            selectedTimeRange === range
                              ? "bg-blue-600"
                              : "bg-gray-600 hover:bg-gray-500"
                          }`}
                        >
                          {timeRangeOptions[range as keyof typeof timeRangeOptions].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedTimeRange && (
                    <>
                      <div>
                        <label className="block text-sm font-medium">開始時間</label>
                        <input
                          type="time"
                          {...register("start_time")}
                          min={timeRangeOptions[selectedTimeRange as keyof typeof timeRangeOptions].start}
                          max={timeRangeOptions[selectedTimeRange as keyof typeof timeRangeOptions].end}
                          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                        />
                        {errors.start_time && (
                          <p className="text-red-500 text-sm">{errors.start_time.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium">結束時間</label>
                        <input
                          type="time"
                          {...register("end_time")}
                          min={timeRangeOptions[selectedTimeRange as keyof typeof timeRangeOptions].start}
                          max={timeRangeOptions[selectedTimeRange as keyof typeof timeRangeOptions].end}
                          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                        />
                        {errors.end_time && (
                          <p className="text-red-500 text-sm">{errors.end_time.message}</p>
                        )}
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium">週份</label>
                    <select
                      {...register("weekday")}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                    >
                      <option value="">選擇星期</option>
                      {weekdays.map((weekday) => (
                        <option key={weekday.value} value={weekday.value}>
                          {weekday.label}
                        </option>
                      ))}
                    </select>
                    {errors.weekday && (
                      <p className="text-red-500 text-sm">{errors.weekday.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">課室</label>
                    <input
                      type="text"
                      {...register("classroom")}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                      placeholder="輸入課室名稱（可選）"
                    />
                    {errors.classroom && (
                      <p className="text-red-500 text-sm">{errors.classroom.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    更新課程
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="md:w-1/2">
            <div className="bg-gray-700 rounded-md p-4 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">課程月曆</h2>
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                dateClick={handleDateClick}
                editable={true}
                selectable={true}
                eventBackgroundColor="#2563eb"
                eventBorderColor="#2563eb"
                eventTextColor="#ffffff"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,dayGridWeek,dayGridDay",
                }}
                height="auto"
                eventDrop={handleEventDrop}
                validRange={
                  startDate && startDate !== "" && endDate && endDate !== ""
                    ? {
                        start: parseISO(startDate),
                        end: addDays(parseISO(endDate), 1),
                      }
                    : undefined
                }
              />
            </div>
            <style jsx>{`
              :global(.fc) {
                background-color: #4b5563;
                border-radius: 0.375rem;
                padding: 1rem;
              }
              :global(.fc-toolbar) {
                background-color: #374151;
                color: #ffffff;
                border-radius: 0.375rem 0.375rem 0 0;
              }
              :global(.fc-button) {
                background-color: #2563eb !important;
                border: none !important;
                border-radius: 0.25rem;
                margin: 0.25rem;
              }
              :global(.fc-button:hover) {
                background-color: #1e40af !important;
              }
              :global(.fc-daygrid-day) {
                background-color: #4b5563;
                color: #ffffff;
              }
              :global(.fc-daygrid-day-number) {
                color: #ffffff;
              }
              :global(.fc-col-header-cell) {
                background-color: #374151;
                color: #ffffff;
              }
              :global(.fc-day-disabled) {
                background-color: #1f2937 !important;
                opacity: 0.5;
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrangeCoursePage;