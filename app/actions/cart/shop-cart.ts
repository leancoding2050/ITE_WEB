// app/actions/cart/shop-cart.ts
'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { Cart, CartItem, Product } from '@prisma/client'

interface ProductDetail {
  id: string
  title: string
  description: string
  price: number
  createdAt?: string
  updatedAt?: string
}

// 定義 Cart 類型，包含 items
type CartWithItems = Cart & {
  items: CartItem[]
}

export async function addToCart(productId: string, quantity: number, getProduct: ProductDetail) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('未授權')

  // 查詢現有購物車，確保包含 items
  let cart: CartWithItems | null = await db.cart.findFirst({
    where: { userId: session.user.id },
    include: { items: true },
  })

  if (!cart) {
    // 創建新購物車，初始化空的 items 陣列
    cart = await db.cart.create({
      data: { userId: session.user.id },
      include: { items: true }, // 確保返回的 cart 包含 items
    })
  }

  const existingItem = await db.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  })

  if (existingItem) {
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    })
  } else {
    await db.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    })
  }

  return { success: true }
}

export async function removeFromCart(cartItemId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('未授權')

  await db.cartItem.delete({
    where: { id: cartItemId },
  })

  return { success: true }
}

export async function createOrder() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('未授權')

  const cart = await db.cart.findFirst({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  })

  if (!cart || cart.items.length === 0) throw new Error('購物車為空')

  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  )

  const order = await db.order.create({
    data: {
      userId: session.user.id,
      total,
      items: {
        create: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  })

  await db.cartItem.deleteMany({ where: { cartId: cart.id } })

  return { orderId: order.id, total }
}

export async function getCart() {
  const session = await auth()
  if (!session?.user?.id) return null

  return db.cart.findFirst({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  })
}