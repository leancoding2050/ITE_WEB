// // app/checkout/page.tsx
// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { createOrder, getCart } from '../actions/cart/shop-cart'


// export default function CheckoutPage() {
//   const [cart, setCart] = useState(null)
//   const router = useRouter()

//   useEffect(() => {
//     async function fetchCart() {
//       const cartData = await getCart()
//       setCart(cartData)
//     }
//     fetchCart()
//   }, [])

//   const handleSubmit = async () => {
//     try {
//       const { orderId } = await createOrder()
//       router.push(`/order-confirmation/${orderId}`)
//     } catch (error) {
//       console.error('結帳失敗:', error)
//     }
//   }

//   if (!cart) return <div>載入中...</div>

//   const total = cart.items.reduce(
//     (sum, item) => sum + item.quantity * item.product.price,
//     0
//   )

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">結帳</h1>
//       <div className="mb-4">
//         {cart.items.map(item => (
//           <div key={item.id} className="flex justify-between mb-2">
//             <span>{item.product.title} (x{item.quantity})</span>
//             <span>${(item.quantity * item.product.price).toFixed(2)}</span>
//           </div>
//         ))}
//         <div className="font-bold mt-2">
//           總計: ${total.toFixed(2)}
//         </div>
//       </div>
//       <button
//         onClick={handleSubmit}
//         className="bg-green-500 text-white px-4 py-2 rounded"
//       >
//         提交訂單
//       </button>
//     </div>
//   )
// }


//原本版本 05-08-2025

// app/(user)/user/[userId]/checkout/page.tsx
// 'use client';

// import { useEffect, useState, useTransition } from 'react';
// import { useParams } from 'next/navigation';
// import { loadStripe } from '@stripe/stripe-js';
// import { getCart } from '../../../../actions/cart/shop-cart';
// import axios from 'axios';

// // 定義與 Prisma Product 模型匹配的類型
// interface Product {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   real_price: number;
//   CourseProductTypeArray: string[];
//   CourseProductStatusArray: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   IsPublic: boolean;
//   courseId: string | null;
// }

// interface CartItem {
//   id: string;
//   cartId: string;
//   productId: string;
//   quantity: number;
//   createdAt: Date;
//   updatedAt: Date;
//   product: Product;
// }

// interface CartWithItems {
//   id: string;
//   userId: string;
//   createdAt: Date;
//   updatedAt: Date;
//   items: CartItem[];
// }

// // 初始化 Stripe.js
// if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
//   throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
// }
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// export default function CheckoutPage() {
//   const [cart, setCart] = useState<CartWithItems | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const params = useParams();
//   const userId = params.userId as string;
//   const [isPending, startTransition] = useTransition();

//   useEffect(() => {
//     async function fetchCart() {
//       try {
//         const cartData = await getCart();
//         setCart(cartData);
//       } catch {
//         setError('載入購物車失敗');
//       }
//     }
//     fetchCart();
//   }, []);

//   const handleSubmit = async () => {
//     if (!cart) return;

//     startTransition(async () => {
//       setError(null);
//       try {
//         const items = cart.items.map((item) => ({
//           name: item.product.title,
//           price: item.product.price, // 價格應為整數（分）
//           quantity: item.quantity,
//         }));

//         const response = await axios.post('/api/CheckoutSessions', { items, userId });
//         const sessionId = response.data.id;

//         const stripe = await stripePromise;
//         const { error } = await stripe!.redirectToCheckout({ sessionId });

//         if (error) {
//           setError(error.message ?? '重定向到 Stripe 失敗');
//         }
//       } catch (error) {
//         console.error('結帳錯誤:', error);
//         setError('結帳處理失敗');
//       }
//     });
//   };

//   if (!cart || isPending) return <div>{error ?? '載入中...'}</div>;

//   const total = cart.items.reduce(
//     (sum, item) => sum + item.quantity * item.product.price,
//     0
//   );

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">結帳</h1>
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       <div className="mb-4">
//         {cart.items.map((item) => (
//           <div key={item.id} className="flex justify-between mb-2">
//             <span>
//               {item.product.title} (x{item.quantity})
//             </span>
//             <span>${((item.quantity * item.product.price) / 100).toFixed(2)}</span>
//           </div>
//         ))}
//         <div className="font-bold mt-2">總計: ${(total / 100).toFixed(2)}</div>
//       </div>
//       <button
//         onClick={handleSubmit}
//         disabled={isPending || cart.items.length === 0}
//         className={`bg-green-500 text-white px-4 py-2 rounded ${
//           isPending || cart.items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
//         }`}
//       >
//         {isPending ? '處理中...' : '提交訂單'}
//       </button>
//     </div>
//   );
// }




"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import { getCart } from "../../../../actions/cart/shop-cart";
import { addStudentToCourse } from "../../../../actions/cart/add-student-to-course";
import axios from "axios";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  real_price: number;
  CourseProductTypeArray: string[];
  CourseProductStatusArray: string[];
  createdAt: Date;
  updatedAt: Date;
  IsPublic: boolean;
  courseId: string | null;
}

interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
}

interface CartWithItems {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  items: CartItem[];
}

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const userId = params.userId as string;
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchCart() {
      try {
        const cartData = await getCart();
        setCart(cartData);
      } catch {
        setError("載入購物車失敗");
      }
    }
    fetchCart();
  }, []);

  const handleSubmit = async () => {
    if (!cart || status !== "authenticated") {
      setError("請先登入");
      return;
    }

    if (userId !== session?.user?.id) {
      setError("無權操作：用戶 ID 不匹配");
      return;
    }

    startTransition(async () => {
      setError(null);
      try {
        // 傳遞 userId 給 addStudentToCourse
        const addStudentResult = await addStudentToCourse({ cartId: cart.id, userId });
        if (!addStudentResult.success) {
          setError(addStudentResult.error || "無法將用戶添加到課程");
          return;
        }

        // 創建 Stripe 結帳會話
        const items = cart.items.map((item) => ({
          name: item.product.title,
          real_price: item.product.real_price,
          quantity: item.quantity,
        }));

        const response = await axios.post("/api/CheckoutSessions", { items, userId });
        const sessionId = response.data.id;

        const stripe = await stripePromise;
        const { error } = await stripe!.redirectToCheckout({ sessionId });

        if (error) {
          setError(error.message ?? "重定向到 Stripe 失敗");
        }
      } catch (error: any) {
        console.error("結帳錯誤:", error);
        const errorMessage =
          error.response?.data?.details ||
          error.message ||
          "結帳處理失敗";
        setError(errorMessage);
      }
    });
  };

  if (status === "loading" || !cart) return <div>{error ?? "載入中..."}</div>;
  if (status === "unauthenticated") return <div>請先登入</div>;

  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.product.real_price,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">結帳</h1>
      <p>
        當前用戶: {session?.user.name} (角色: {session?.user.role})
      </p>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.product.title} (x{item.quantity})
            </span>
            <span>${((item.quantity * item.product.real_price) / 100).toFixed(2)}</span>
          </div>
        ))}
        <div className="font-bold mt-2">總計: ${(total / 100).toFixed(2)}</div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={isPending || cart.items.length === 0}
        className={`bg-green-500 text-white px-4 py-2 rounded ${
          isPending || cart.items.length === 0 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isPending ? "處理中..." : "提交訂單"}
      </button>
    </div>
  );
}