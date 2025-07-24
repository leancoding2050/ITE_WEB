"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const params = useParams();
  const userId = params.userId as string | undefined;
  const teacherId = params.Teacherid as string | undefined;

  // 定義不同角色的導航項目
  const adminNavItems = [
    { name: "帳戶", href: "/admin/Accounts" },
    // { name: "日曆", href: "/admin/Calendar" },
    { name: "課程列表", href: "/admin/CourseLists" },
    { name: "數據列表", href: "/admin/DataLists" },
    { name: "產品列表", href: "/admin/ProductLists" },
    { name: "教師列表", href: "/admin/TeacherLists" },
    { name: "使用者列表", href: "/admin/UserLists" },
    { name: "狀態列表", href: "/admin/StatueLists" },
    { name: "類型清單", href: "/admin/TypeLists" },
    { name: "關建字清單", href: "/admin/HeaderTypeLists" },
  ];

  const teacherNavItems = teacherId
    ? [
        { name: "帳戶", href: `/teacher/${teacherId}/Accounts` },
        { name: "日曆", href: `/teacher/${teacherId}/calendar` },
        { name: "課程列表", href: `/teacher/${teacherId}/CourseLists` },
        { name: "教師教材列表", href: `/teacher/${teacherId}/TeachingMaterialsLists` },
        { name: "類型列表", href: `/teacher/${teacherId}/TypesLists` },
      ]
    : [];

  const userNavItems = userId
    ? [
        { name: "商城", href: `/user/${userId}/shop` },
        { name: "日曆", href: `/user/${userId}/calendar` },
        { name: "證書列表", href: `/user/${userId}/certificateList` },
        { name: "課程列表", href: `/user/${userId}/courseLists` },
      ]
    : [];

  const publicNavItems = [
    { name: "首頁", href: "/" },
    { name: "登錄", href: "/login" },
    { name: "註冊", href: "/register" },
    { name: "關於ITE", href: "/about" },
  ];

  // 根據 session 和角色選擇導航項目
  const navItems =
    status === "authenticated" && session?.user?.role === "ADMIN"
      ? adminNavItems
      : status === "authenticated" && session?.user?.role === "TEACHER"
      ? teacherNavItems
      : status === "authenticated" && session?.user?.role === "USER"
      ? userNavItems
      : publicNavItems;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              MyApp
            </Link>
          </div>

          {/* 桌面版導航 */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                {item.name}
              </Link>
            ))}
            {status === "authenticated" && (
              <button
                onClick={handleSignOut}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                登出
              </button>
            )}
          </div>

          {/* 移動版菜單按鈕 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700"
            >
              <span className="sr-only">開啟主菜單</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移動版菜單 */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {status === "authenticated" && (
              <button
                onClick={handleSignOut}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              >
                登出
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}