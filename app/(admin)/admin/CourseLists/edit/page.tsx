"use client ";

import Edit_Course_Form_Calendar from "@/components/EditForm/Edit-AdminCourse-Form-Calendar";
import Link from "next/link";

const EditCoursePage = () => {
  return (
    <>
      <div>
        <Link href={'/admin/CourseLists'}>
          返回
        </Link>

        <Edit_Course_Form_Calendar />


      </div>
    </>
  )
} 


export default EditCoursePage;