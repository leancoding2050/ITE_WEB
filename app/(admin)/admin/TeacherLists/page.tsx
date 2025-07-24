"use client"

import Link from "next/link"
import { useEffect, useState } from "react";

interface TeacherData {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role : string;
    createdAt: string;
    updatedAt: string;
}

const TeacherListsPage = () => {

    const [getTeacherDataLists, setgetTeacherDataLists] = useState<TeacherData []>([]);
    
    useEffect(() => { 
        
    const fetchTeacherData = async () => {
        const response = await fetch("/api/user/Get_User_Lists");
        const data = await response.json();
        setgetTeacherDataLists(data);
    }
        fetchTeacherData();
    }, [])
    
    console.log("getTeacherDataLists : ", getTeacherDataLists , "-- End --")



    return (
        <>
        <div>
            <Link href={"/admin/TeacherLists/CreateTeacher"}  >
                建立老師
            </Link>
            <br />
            TeacherListsPage

            {getTeacherDataLists && getTeacherDataLists.map((teacher) => {
                if(teacher.role === "TEACHER"){
                return (
                    <div key={teacher.id}>
                        <Link href={`/admin/TeacherLists/${teacher.id}`}>
                           name : {teacher.name}
                        </Link>
                    </div>
                );
                }



            

            })}

        </div>
        </>
    )
}

export default TeacherListsPage