// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import FullCalendar from "@fullcalendar/react";

// // 定義課程物件的型別，根據 Prisma 的 Course model
// type Course = {
//   id: string;
//   title: string;
//   course_code: string;
//   start_date: string;
//   description: string;
//   school_name: string;
//   end_date: string;
//   start_time: string;
//   end_time: string;
//   time_hours: number;
//   teacher: string[];
//   teacher_id: string;
//   Ispublic: boolean;
//   type: string[];
//   courseModulId: string | null;
//   createdAt: string;
//   updatedAt: string;
//   CourseModul?: {
//     id: string;
//     title: string;
//     description: string;
//   } | null;
// };

// const CourseListsPage = () => {
//   const params = useParams();
//   const teacherId = params.teacherId as string;
//   const [GetcourseLists, setGetcourseLists] = useState<Course[]>([]); // 明確指定型別為 Course[]
//   const [ GetTeacherData , setGetTeacherData ] = useState([]);


//   useEffect(() => {
    
//     const fetchCourseData = async () => {
//       const response = await fetch(`/api/Course/Get_Course_Lists`);
//       const data = await response.json();
//       setGetcourseLists(data);
//     };

//     const fetchTeacherData = async () => {
//       const response = await fetch("/api/user/Get_User_Lists");
//       const data = await response.json();
//     setGetTeacherData(data);
//     }


//     fetchCourseData();
//     fetchTeacherData();

//   }, []);
//   console.log("GetcourseLists :" , GetcourseLists, "-- End --");
//   console.log("GetTeacherData :" , GetTeacherData, "-- End --");


//   return (
//     <div>
//       <Link href={"/admin/CourseLists/ArrangeCourse"} >
//         排堂
//       </Link>


//       <h1>課程列表（排堂）</h1>

//     </div>
//   );
// };

// export default CourseListsPage;


"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

// 定義 User 物件的型別，根據 Prisma 的 User model
interface User {
  id: string;
  username: string;
  name: string | null;
  role: "USER" | "ADMIN" | "TEACHER";
  teacherholidaysDateTime: string[];
  createdAt: string;
  updatedAt: string;
  password: string;
  phone: string | null;
  phoneVerified: string | null;
}

// 定義 Course 物件的型別，根據 Prisma 的 Course model
interface Course {
  id: string;
  title: string;
  description: string;
  course_code: string;
  school_name: string;
  start_date: string | null;
  end_date: string | null;
  Coursedates: string[];
  Number_of_days: number;
  time_hours: number;
  TimeRange: string[];
  teacher: string[];
  teacher_id: string;
  Ispublic: boolean;
  Isproduct: boolean;
  type: string[];
  classroom: string | null;
  weekday: string | null;
  createdAt: string;
  updatedAt: string;
  CourseModul: {
    id: string;
    title: string;
    description: string;
    Teaching_Materials: string | null;
    createdAt: string;
    updatedAt: string;
    TeacherId: string;
  } | null;
  courseModulId: string | null;
}

const CourseListsPage = () => {
  const params = useParams();
  const teacherId = params.teacherId as string;
  const [GetcourseLists, setGetcourseLists] = useState<Course[]>([]);
  const [GetTeacherData, setGetTeacherData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`/api/Course/Get_Course_Lists`);
        if (!response.ok) {
          throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setGetcourseLists(data);
      } catch (error) {
        console.error("fetchCourseData error:", error);
        setError(error instanceof Error ? error.message : "無法獲取課程數據");
      }
    };

    const fetchTeacherData = async () => {
      try {
        const response = await fetch(`/api/user/Get_User_Lists`);
        if (!response.ok) {
          throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setGetTeacherData(data);
      } catch (error) {
        console.error("fetchTeacherData error:", error);
        setError(error instanceof Error ? error.message : "無法獲取教師數據");
      }
    };

    fetchCourseData();
    fetchTeacherData();
  }, []);

  console.log("GetcourseLists :", GetcourseLists, "-- End --");
  console.log("GetTeacherData :", GetTeacherData, "-- End --");

  // 合併課程和假期事件
  const calendarEvents = [
    // 課程事件
    ...GetcourseLists.flatMap((course) =>
      course.Coursedates.map((date) => ({
        title: `${course.title} - ${course.teacher.join(", ")} - ${course.classroom || "無教室"} - ${course.school_name}`,
        date: date,
        allDay: true,
        backgroundColor: "blue",
        borderColor: "blue",
      }))
    ),
    // 假期事件（僅限 role: TEACHER）
    ...GetTeacherData.filter((user) => user.role === "TEACHER").flatMap((user) =>
      user.teacherholidaysDateTime.map((date) => ({
        title: `${user.name || user.username} 放假`,
        date: date,
        allDay: true,
        backgroundColor: "red",
        borderColor: "red",
      }))
    ),
  ];

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!GetcourseLists || !GetTeacherData) {
    return <div>載入中...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link href={`/teacher/${teacherId}/course/AddCourse`} className="text-blue-500 hover:underline">
        新增課程
      </Link>
      <h1 className="text-2xl font-bold my-4">課程列表（排堂）</h1>

      <div className="grid gap-2">
        {GetcourseLists.length > 0 ? (
          GetcourseLists.map((course) =>
            course.Coursedates.map((date, index) => (
              <Link
                key={`${course.id}-${index}`}
                href={`/teacher/${teacherId}/course/${course.id}/EditCourse?date=${date}`}
                className="text-blue-500 hover:underline"
              >
                <div className="p-2 bg-gray-100 rounded">
                  {date} - {course.title} - {course.teacher.join(", ")} - {course.classroom || "無教室"} -{" "}
                  {course.school_name}
                </div>
              </Link>
            ))
          )
        ) : (
          <div className="text-gray-500">無課程數據</div>
        )}
      </div>

      <div className="mt-6" style={{ height: "600px" }}>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          locale="zh-tw"
          height="100%"
          eventClick={(info) => {
            alert(`事件: ${info.event.title}\n日期: ${info.event.startStr}`);
          }}
        />
      </div>
    </div>
  );
};

export default CourseListsPage;