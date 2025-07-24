import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const Accounts = await db.accounts.findMany({});
    return NextResponse.json(Accounts);
  } catch (error) {
    console.error("GetAccountsLists error: ", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "獲取Accounts列表失敗" },
      { status: 500 }
    );
  }
}