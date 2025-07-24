"use client"

import Link from "next/link";
import { useParams} from "next/navigation";
import { useEffect, useState } from "react";


interface TypeData {
id: string;
typename: string;
author: string;
}

const TypesListsPage = () => {
    const params = useParams();
    console.log("params : ",  params)
    const TeacherId = params.Teacherid as string;
    console.log("TeacherId : ",  TeacherId)
  const [getTyperData, setgetTyperData] = useState<TypeData []>([]);
  const [error, setError] = useState("");

  useEffect(()=>{
  const fetchData = async () => {
    try {
      const response = await fetch("/api/Type/Get_Type_Lists");
      if (!response.ok) {
        throw new Error(`請求失敗: ${response.status}`);
      }
      const data = await response.json();
      setgetTyperData(data);
    } catch (error) {
      setError("Error fetching data");
    }
  }
    fetchData()
  },[])

  console.log("getTyperData :" , getTyperData , " -- End -- ")

  if (error)
    return (
      <div className="ml-[50px] p-4 text-[#FF0000] font-noto-sans-tc">錯誤: {error}</div>
    );
  if (!getTyperData)
    return (
      <div className="ml-[50px] p-4 text-[#1D475D] font-noto-sans-tc">無數據</div>
    );


  return (

    <div>
      <Link href={`/teacher/${TeacherId}/TypesLists/CreateTypes`} >
        建立類型
      </Link>

        TypesListsPage
            {getTyperData.map((typeitem) => {
        return (
          <div key={typeitem.id}>
            <Link href={`/admin/TypeLists/${typeitem.id}/edit`}>
              {typeitem.typename}
            </Link>
          </div>
        )


      })}


      </div>
  
  )
}

export default TypesListsPage