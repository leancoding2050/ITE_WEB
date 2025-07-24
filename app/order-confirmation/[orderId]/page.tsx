// app/order-confirmation/[orderId]/page.tsx

import { db } from "@/lib/db"


export default async function OrderConfirmation({ params }) {
  const order = await db.order.findUnique({
    where: { id: params.orderId },
    include: { items: { include: { product: true } } },
  })

  if (!order) return <div>訂單未找到</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">訂單確認</h1>
      <p>訂單編號: {order.id}</p>
      <div className="mb-4">
        {order.items.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.product.title} (x{item.quantity})</span>
            <span>${(item.quantity * item.price).toFixed(2)}</span>
          </div>
        ))}
        <div className="font-bold mt-2">
          總計: ${order.total.toFixed(2)}
        </div>
      </div>
    </div>
  )
}