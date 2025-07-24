// auth.ts
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from './lib/db';
import { z } from 'zod';

// 定義憑證驗證的 schema
const credentialsSchema = z.object({
  username: z.string().min(1, '用戶名不能為空'),
  password: z.string().min(1, '密碼不能為空'),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 天
    updateAge: 24 * 60 * 60, // 24 小時
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: '用戶名', type: 'text' },
        password: { label: '密碼', type: 'password' },
      },
      async authorize(credentials) {
        // 使用 zod 驗證憑證
        const parsedCredentials = credentialsSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          throw new Error('無效的輸入資料');
        }

        const { username, password } = parsedCredentials.data;

        // 查詢用戶
        const user = await db.user.findUnique({
          where: { username },
        });

        if (!user || !user.password) {
          throw new Error('用戶不存在或密碼無效');
        }

        // 驗證密碼
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          throw new Error('密碼錯誤');
        }

        // 返回用戶資料
        return {
          id: user.id,
          name: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id!;
        session.user.name = token.name ?? 'Unknown';
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});