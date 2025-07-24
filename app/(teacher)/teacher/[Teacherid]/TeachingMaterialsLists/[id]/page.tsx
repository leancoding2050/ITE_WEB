"use client"

import { useParams } from "next/navigation";

const TeachingMaterialsPageById = () => {
    const params = useParams();
    console.log("params : ",  params)
    const TeacherId = params.Teacherid as string;
    console.log("TeacherId : ",  TeacherId)
  return (
    <div>TeachingMaterialsPageById</div>
  )
}

export default TeachingMaterialsPageById