"use server";

import { signOut } from "@/auth";

export async function serverLogout() {
  try {
    await signOut({ redirect: false });
    return { success: true };
  } catch (error) {
    return { error: "登出失敗，請稍後重試" };
  }
}