"use client"

import { useParams } from "next/navigation";

const TeacherAccountsPage = () => {

  const params = useParams();
  console.log("params : ",  params)
  const TeacherId = params.Teacherid as string;
  console.log("TeacherId : ",  TeacherId)
  

  return (
    <div>TeacherAccountsPage</div>
  )
}


export default TeacherAccountsPage