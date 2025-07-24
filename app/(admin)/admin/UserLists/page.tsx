"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface UserDataLists {
  id: string;
  username: string;
  phone: string;
  name: string;
  email: string;
  role:string;
}

const UserListsPage = () => {
  const [GetuserDataLists, setGetuserDataLists] = useState<UserDataLists[]>([]);

  useEffect(() => {
    const fetchUserDataLists = async () => {
      const response = await fetch("/api/user/Get_User_Lists");
      const data = await response.json();
      setGetuserDataLists(data);
    };
    fetchUserDataLists();
  }, []);

  console.log("GetuserDataLists :", GetuserDataLists, "-- End --");

  return (
    <div>
      UserListsPage
      <br />
      <Link href={"/UserLists/createUser"}>建立用戶</Link>
      <br />
      {GetuserDataLists?.map((users) => {
        return (
          <div key={users.id}> {/* 添加 key 屬性，使用 users.id 作為唯一標識 */}
            <br />
            名稱: {users.name}
            <br />
            櫂限: {users.role}
            <br />
            用戶名: {users.username}
            <br />
          </div>
        );
      })}
      <br />
    </div>
  );
};

export default UserListsPage;