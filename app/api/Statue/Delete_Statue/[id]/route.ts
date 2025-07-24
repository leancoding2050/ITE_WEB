// app/api/Type/Delete_HeaderType/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  // 從動態路由參數中獲取 id
  const { id } = params;

  // 驗證 id 是否存在
  if (!id) {
    return NextResponse.json({ message: '缺少 id 參數' }, { status: 400 });
  }

  try {
    // 檢查 HeaderType 是否存在
    const coursePorductStatue = await prisma.coursePorductStatue.findUnique({
      where: { id },
    });

    if (!coursePorductStatue) {
      return NextResponse.json({ message: '未找到指定的狀態' }, { status: 404 });
    }

    // 執行刪除操作
    await prisma.coursePorductStatue.delete({
      where: { id },
    });

    // 返回成功響應
    return NextResponse.json({ message: `成功刪除狀態: ${id}` }, { status: 200 });
  } catch (error) {
    console.error('刪除狀態時發生錯誤:', error);
    return NextResponse.json({ message: '伺服器錯誤，無法刪除狀態' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}