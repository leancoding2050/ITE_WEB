"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductLists {
  id: number;
  title: string;
  description: string;
  price: number;
  real_price?: number;
  IsPublic?: boolean;
  image: string;
  category: string;
  created_at: string;
  updated_at: string;
}

const ProductListsPagebyId = () => {
  const params = useParams();
  const ProductId = params.ProductId as string;

  const [GetProductDatabyId, setGetProductDatabyId] = useState<ProductLists | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDataLists = async () => {
      try {
        const res = await fetch(`/api/product/Get_Product_Lists_by_ID/${ProductId}`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setGetProductDatabyId(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "無法載入產品數據");
      }
    };
    fetchProductDataLists();
  }, [ProductId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-600 px-4 py-2 rounded-md">{error}</div>
      </div>
    );
  }

  if (!GetProductDatabyId) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 shadow-lg rounded-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">產品詳情</h1>
            <Link
              href={`/admin/ProductLists/${ProductId}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              編輯產品
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex-1">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">產品 ID:</span> {GetProductDatabyId.id}
                  </div>
                  <div>
                    <span className="font-medium">標題:</span> {GetProductDatabyId.title}
                  </div>
                  <div>
                    <span className="font-medium">描述:</span> {GetProductDatabyId.description}
                  </div>
                  <div>
                    <span className="font-medium">價格:</span> {GetProductDatabyId.price}
                  </div>
                  <div>
                    <span className="font-medium">實際價格:</span>{" "}
                    {GetProductDatabyId.real_price ?? "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">公開狀態:</span>{" "}
                    {GetProductDatabyId.IsPublic ? "公開" : "不公開"}
                  </div>
                  <div>
                    <span className="font-medium">類別:</span> {GetProductDatabyId.category}
                  </div>
                  <div>
                    <span className="font-medium">創建時間:</span>{" "}
                    {new Date(GetProductDatabyId.created_at).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">更新時間:</span>{" "}
                    {new Date(GetProductDatabyId.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="font-medium">產品圖片:</span>
                <Image
                  src={GetProductDatabyId.image}
                  alt={GetProductDatabyId.title}
                  className="mt-2 w-full max-w-xs rounded-md shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListsPagebyId;