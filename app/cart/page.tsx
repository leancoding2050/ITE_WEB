// app/cart/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCart, removeFromCart } from '../actions/cart/shop-cart'
import { useSession } from 'next-auth/react'

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const router = useRouter()
  const { data: session, status } = useSession()

useEffect(() => {
    async function fetchCart() {
      if (status === 'authenticated') {
        const cartData = await getCart()
        setCart(cartData)
      }
    }
    fetchCart()
  }, [status])

  const handleRemove = async (cartItemId: string) => {
    await removeFromCart(cartItemId)
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== cartItemId),
    }))
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

if (status === 'loading') return <div>載入中...</div>
  if (status === 'unauthenticated') return <div>請先登入</div>

  if (!cart) return <div>載入中...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">購物車</h1>
      {cart.items.length === 0 ? (
        <p>您的購物車為空</p>
      ) : (
        <>
          {cart.items.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-2 p-2 border-b">
              <div>
                <h2>{item.product.title}</h2>
                <p>數量: {item.quantity}</p>
                <p>價格: ${item.product.price}</p>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                移除
              </button>
            </div>
          ))}
          <button
            onClick={handleCheckout}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            前往結帳
          </button>
        </>
      )}
    </div>
  )
}



