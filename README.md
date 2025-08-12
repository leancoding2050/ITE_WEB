This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



14-7-2025

今天完成了teacher 的create CourseModul client side 及 server side的 bug
今天完成了teacher 的create Course client side 及 server side的 bug
今天完成了teacher login 後 的跳頁，及navber 的顯示
明天可能做user login 後頁面，及shop page加入用戶資訊的欄表


15-18-7-2025

是在進行排堂功能的 構思 ,client side及server side 的建立

19-7-2025
完成了整個課堂排堂功能（client side及server side），但是要再進一 步測試 ，

接下來在client side 進行些顯示問題想看看可以進行修改

之後接下來要做payment stripe 要測試 ，及admin page 的各頁面的修改

20－23 －7 －2025

23 -在制作老師, admin 的FullCalendar 顯示問題 并接下來應該繼續進行修改client side 頁面

22 - 老師的假期要轉入model User 中 使用 才是合理使用情況，之後修改了create teacherhoilday 的client side schema serser side function and edit teacherholiday client side schema serser side function

21 - 使用model teacherholiday 來做create teacherhoilday 的client side schema serser side function and edit teacherholiday client side schema serser side function 并在FullCalendar 顯示 以及payment function 成功 但未進行比錢功能測試及修復大部分client side頁面

24－7－2025
在typelists  statuelists 及 headertypeLists 加入了刪除鍵
之後要確定course的分類是誰決定 (admin / teacher?) 決定 (NITTP/自家/ERB)


26-7-2025

建立了帳目用的Accounts server side function ,但是要有比錢後才可以看到效果 (過多數天吧)


30-7-2025

修改了 admin 中 的老師ID , product的 CSS ,首面shop 的商品出現了 ,明天要加入product的修改頁面, 以及看看shop 的bug

12-08-2025

早上做了deploy 下午出現了以下

12-Aug 2025 ITE BUG

#Admin 使用者列表的使用者按Detail 出 404
#User 比吾到錢
#User 商城Filter 左合適條件後 Del左啲字 產品出吾翻來
#User 加左購物錢會吾知Show起邊 Del左佢？
#User 付款紀錄
#Teacher 我的資料顯示404
