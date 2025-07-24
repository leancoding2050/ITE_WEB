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


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { getCart } from '../actions/cart/shop-cart';
import axios from 'axios';
import { Cart, CartItem, Product } from '@prisma/client';

// 定義 Cart 的類型
type CartWithItems = Cart & {
  items: (CartItem & { product: Product })[];
};

// 初始化 Stripe.js
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCart() {
      try {
        const cartData = await getCart();
        setCart(cartData);
      } catch (err) {
        setError('載入購物車失敗');
      }
    }
    fetchCart();
  }, []);

  const handleSubmit = async () => {
    if (!cart) return;

    setLoading(true);
    setError(null);
    try {
      const items = cart.items.map(item => ({
        name: item.product.title,
        price: item.product.price, // 價格應為整數（分）
        quantity: item.quantity,
      }));

      // 使用正確的 API 路徑（注意大小寫）
      const response = await axios.post('/api/CheckoutSessions', { items });
      const sessionId = response.data.id;

      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        setError(error.message ?? '重定向到 Stripe 失敗');
        setLoading(false);
      }
    } catch (error) {
      console.error('結帳錯誤:', error);
      setError('結帳處理失敗');
      setLoading(false);
    }
  };

  if (!cart) return <div>{error ?? '載入中...'}</div>;

  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">結帳</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        {cart.items.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.product.title} (x{item.quantity})</span>
            <span>${((item.quantity * item.product.price) / 100).toFixed(2)}</span>
          </div>
        ))}
        <div className="font-bold mt-2">
          總計: ${(total / 100).toFixed(2)}
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading || cart.items.length === 0}
        className={`bg-green-500 text-white px-4 py-2 rounded ${
          loading || cart.items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? '處理中...' : '提交訂單'}
      </button>
    </div>
  );
}