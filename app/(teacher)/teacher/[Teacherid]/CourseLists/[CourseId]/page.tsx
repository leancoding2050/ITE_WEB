"use client"

import { useParams } from "next/navigation";

const CreateTeachingMaterialsPagebyId = () => {
    const params = useParams();
    console.log("params : ",  params)
    const TeacherId = params.Teacherid as string;
    console.log("TeacherId : ",  TeacherId)
  return (
    <div>
      CreateTeachingMaterialsPagebyId
    </div>
  )
}

export default CreateTeachingMaterialsPagebyId