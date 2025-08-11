"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

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

interface SelectedCourseTimeRange {
  id: string;
  timeRange: string;
  starttime: string | null;
  endtime: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  startDate: string | null;
  endDate: string | null;
  Coursedates: string[];
  numberOfDays: number;
  timeHours: number;
  timeRange: string[];
  teacher: string[];
  teacherId: string;
  isPublic: boolean;
  isProduct: boolean;
  Producted: boolean;
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
  CourseTimeRanges: SelectedCourseTimeRange[];
}

const CourseListsPage = () => {
  const [getCourseLists, setGetCourseLists] = useState<Course[]>([]);
  const [getTeacherData, setGetTeacherData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const coursesPerPage = 10;

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`/api/Course/Get_Course_Lists`);
        if (!response.ok) throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setGetCourseLists(data);
      } catch (error) {
        console.error("fetchCourseData error:", error);
        setError(error instanceof Error ? error.message : "無法獲取課程數據");
      }
    };

    const fetchTeacherData = async () => {
      try {
        const response = await fetch(`/api/user/Get_User_Lists`);
        if (!response.ok) throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setGetTeacherData(data);
      } catch (error) {
        console.error("fetchTeacherData error:", error);
        setError(error instanceof Error ? error.message : "無法獲取教師數據");
      }
    };

    fetchCourseData();
    fetchTeacherData();
  }, []);

  // 搜尋和過濾課程
  const filteredCourses = getCourseLists.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher.some((teacher) => teacher.toLowerCase().includes(searchQuery.toLowerCase())) ||
      course.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 分頁邏輯
  const totalCourses = filteredCourses.flatMap((course) => course.Coursedates).length;
  const totalPages = Math.ceil(totalCourses / coursesPerPage);
  const paginatedCourses = filteredCourses
    .flatMap((course) => course.Coursedates.map((date) => ({ course, date })))
    .slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage);

  // 日曆事件
  const calendarEvents = [
    ...getCourseLists.flatMap((course) =>
      course.Coursedates.map((date) => ({
        title: `${course.title} - ${course.teacher.join(", ")} - ${course.classroom || "無教室"} - ${course.schoolName}`,
        date,
        allDay: true,
        backgroundColor: "#2563eb",
        borderColor: "#2563eb",
      }))
    ),
    ...getTeacherData
      .filter((user) => user.role === "TEACHER")
      .flatMap((user) =>
        user.teacherholidaysDateTime.map((date) => ({
          title: `${user.name || user.username} 放假`,
          date,
          allDay: true,
          backgroundColor: "#dc2626",
          borderColor: "#dc2626",
        }))
      ),
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">課程列表（排堂）</h1>
          <Link
            href="/admin/CourseLists/ArrangeCourse"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            新增課程
          </Link>
        </div>

        {error && <div className="mb-4 text-red-500">{error}</div>}

        <div className="mb-4">
          <input
            type="text"
            placeholder="搜尋課程名稱、教師或學校..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-6">
          {paginatedCourses.length === 0 ? (
            <p className="p-4 text-gray-400">無課程數據或正在加載...</p>
          ) : (
            <div className="divide-y divide-gray-700">
              {paginatedCourses.map(({ course, date }) => (
                <Link
                  key={`${course.id}-${date}`}
                  href={`/admin/CourseLists/${course.id}/Edit`}
                  className="block px-4 py-3 hover:bg-gray-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">
                      {date} - {course.title}
                    </span>
                    <span className="text-sm text-gray-400">
                      {course.teacher.join(", ")} - {course.classroom || "無教室"} - {course.schoolName}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mb-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600 transition"
            >
              上一頁
            </button>
            <span className="px-3 py-2 text-gray-400">
              第 {currentPage} 頁 / 共 {totalPages} 頁
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600 transition"
            >
              下一頁
            </button>
          </div>
        )}

        <div className="flex justify-center mt-4">
          <Link
            href="/admin/CourseLists/edit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            在這改課程
          </Link>
        </div>

        <div className="bg-gray-800 shadow-lg rounded-lg p-4">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            locale="zh-tw"
            height="600px"
            eventClick={(info) => {
              alert(`事件: ${info.event.title}\n日期: ${info.event.startStr}`);
            }}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek",
            }}
            buttonText={{
              today: "今天",
              month: "月",
              week: "週",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseListsPage;
// "use client";

// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";

// // 定義 User 物件的型別，根據 Prisma 的 User model
// interface User {
//   id: string;
//   username: string;
//   name: string | null;
//   role: "USER" | "ADMIN" | "TEACHER";
//   teacherholidaysDateTime: string[];
//   createdAt: string;
//   updatedAt: string;
//   password: string;
//   phone: string | null;
//   phoneVerified: string | null;
// }

// // 定義 Course 物件的型別，根據 Prisma 的 Course model
// interface Course {
//   id: string;
//   title: string;
//   description: string;
//   course_code: string;
//   school_name: string;
//   start_date: string | null;
//   end_date: string | null;
//   Coursedates: string[];
//   Number_of_days: number;
//   time_hours: number;
//   TimeRange: string[];
//   teacher: string[];
//   teacher_id: string;
//   Ispublic: boolean;
//   Isproduct: boolean;
//   type: string[];
//   classroom: string | null;
//   weekday: string | null;
//   createdAt: string;
//   updatedAt: string;
//   CourseModul: {
//     id: string;
//     title: string;
//     description: string;
//     Teaching_Materials: string | null;
//     createdAt: string;
//     updatedAt: string;
//     TeacherId: string;
//   } | null;
//   courseModulId: string | null;
// }

// const CourseListsPage = () => {
//   const params = useParams();
//   const teacherId = params.teacherId as string;
//   const [GetcourseLists, setGetcourseLists] = useState<Course[]>([]);
//   const [GetTeacherData, setGetTeacherData] = useState<User[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   console.log(" teacherId :  ",teacherId)

//   useEffect(() => {
//     const fetchCourseData = async () => {
//       try {
//         const response = await fetch(`/api/Course/Get_Course_Lists`);
//         if (!response.ok) {
//           throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();
//         if (data.error) {
//           throw new Error(data.error);
//         }
//         setGetcourseLists(data);
//       } catch (error) {
//         console.error("fetchCourseData error:", error);
//         setError(error instanceof Error ? error.message : "無法獲取課程數據");
//       }
//     };

//     const fetchTeacherData = async () => {
//       try {
//         const response = await fetch(`/api/user/Get_User_Lists`);
//         if (!response.ok) {
//           throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();
//         if (data.error) {
//           throw new Error(data.error);
//         }
//         setGetTeacherData(data);
//       } catch (error) {
//         console.error("fetchTeacherData error:", error);
//         setError(error instanceof Error ? error.message : "無法獲取教師數據");
//       }
//     };

//     fetchCourseData();
//     fetchTeacherData();
//   }, []);

//   console.log("GetcourseLists :", GetcourseLists, "-- End --");
//   console.log("GetTeacherData :", GetTeacherData, "-- End --");

//   // 合併課程和假期事件
//   const calendarEvents = [
//     // 課程事件
//     ...GetcourseLists.flatMap((course) =>
//       course.Coursedates.map((date) => ({
//         title: `${course.title} - ${course.teacher.join(", ")} - ${course.classroom || "無教室"} - ${course.school_name}`,
//         date: date,
//         allDay: true,
//         backgroundColor: "blue",
//         borderColor: "blue",
//       }))
//     ),
//     // 假期事件（僅限 role: TEACHER）
//     ...GetTeacherData.filter((user) => user.role === "TEACHER").flatMap((user) =>
//       user.teacherholidaysDateTime.map((date) => ({
//         title: `${user.name || user.username} 放假`,
//         date: date,
//         allDay: true,
//         backgroundColor: "red",
//         borderColor: "red",
//       }))
//     ),
//   ];

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   if (!GetcourseLists || !GetTeacherData) {
//     return <div>載入中...</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <Link href={`/admin/CourseLists/ArrangeCourse`} className="text-blue-500 hover:underline">
//         新增課程
//       </Link>
//       <h1 className="text-2xl font-bold my-4">課程列表（排堂）</h1>

//       <div className="grid gap-2">
//         {GetcourseLists.length > 0 ? (
//           GetcourseLists.map((course) =>
//             course.Coursedates.map((date, index) => (
//               <Link
//                 key={`${course.id}-${index}`}
//                 href={`/admin/CourseLists/${course.id}/Edit`}
//                 className="text-blue-500 hover:underline"
//               >
//                 <div className="p-2 bg-gray-100 rounded">
//                   {date} - {course.title} - {course.teacher.join(", ")} - {course.classroom || "無教室"} -{" "}
//                   {course.school_name}
//                 </div>
//               </Link>
//             ))
//           )
//         ) : (
//           <div className="text-gray-500">無課程數據</div>
//         )}
//       </div>

//       <div className="mt-6" style={{ height: "600px" }}>
//         <FullCalendar
//           plugins={[dayGridPlugin]}
//           initialView="dayGridMonth"
//           events={calendarEvents}
//           locale="zh-tw"
//           height="100%"
//           eventClick={(info) => {
//             alert(`事件: ${info.event.title}\n日期: ${info.event.startStr}`);
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default CourseListsPage;