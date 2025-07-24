'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { addToCart } from '@/app/actions/cart/shop-cart';

interface ProductDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

type PageProps = {
  params: {
    productsId: string;
  };
};

export default function ProductPage({ params }: PageProps) {
  const param_id = useParams();
  const productId = param_id.productsId as string;
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const [getProduct, setGetProduct] = useState<ProductDetail | null>(null);

  useEffect(() => {
    const fetchProductDataLists = async (productId: string) => {
      try {
        const response = await fetch(`/api/product/Get_Product_Lists_by_ID/${productId}`);
        if (!response.ok) {
          throw new Error('無法獲取商品數據');
        }
        const data = await response.json();
        setGetProduct(data);
      } catch (error) {
        console.error('獲取商品數據失敗:', error);
      }
    };

    fetchProductDataLists(productId);
  }, [productId]);

  const handleAddToCart = async () => {
    if (getProduct) {
      await addToCart(productId, quantity, getProduct); // 傳遞三個參數
      router.push('/cart');
    }
  };

  if (!getProduct) {
    return <div>載入中...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">商品詳情</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{getProduct.title}</h2>
        <p className="text-gray-600">{getProduct.description}</p>
        <p className="text-lg font-bold">價格: ${getProduct.price}</p>
      </div>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min="1"
        className="border p-2 mr-2"
      />
      <button
        onClick={handleAddToCart}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        加入購物車
      </button>
    </div>
  );
}