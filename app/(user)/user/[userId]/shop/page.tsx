"use client"

import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ProductLists {
  id: string;
  title: string;
  description: string;
  price: number;
  CoursePorductTypeArray: string[];
  CoursePorductStatueArray: string[];
}

interface CoursePorductTypeLists {
  id: string;
  typename: string;
  author: string;
}

interface CoursePorductStatueLists {
  id: string;
  statuename: string;
}

const ShopPage = () => {
  const { data: session, status, update } = useSession()
  const params = useParams()
  console.log(params)
  const userId = params.userId as string;
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [GetProductListsData, setGetProductListsData] = useState<ProductLists[]>([])
  const [GetCoursePorductTypeData, setGetCoursePorductTypeData] = useState<CoursePorductTypeLists[]>([])
  const [GetCoursePorductStatueData, setGetCoursePorductStatueData] = useState<CoursePorductStatueLists[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredProducts, setFilteredProducts] = useState<ProductLists[]>([])

  useEffect(() => {
    const fetchProductDataLists = async () => {
      const response = await fetch("/api/product/Get_Product_Lists");
      const data = await response.json();
      setGetProductListsData(data);
      setFilteredProducts(data);
    };

    const fetchCoursePorductStatueDataLists = async () => {
      const response = await fetch("/api/Statue/Get_Statue_Lists");
      const data = await response.json();
      setGetCoursePorductStatueData(data);
    };

    const fetchGetCoursePorductTypeDataLists = async () => {
      const response = await fetch("/api/Type/Get_Type_Lists");
      const data = await response.json();
      setGetCoursePorductTypeData(data);
    };

    fetchProductDataLists();
    fetchCoursePorductStatueDataLists();
    fetchGetCoursePorductTypeDataLists();
  }, [])

  useEffect(() => {
    const filterProducts = () => {
      let filtered = GetProductListsData;

      // 類型篩選
      if (selectedTypes.length > 0) {
        filtered = filtered.filter(product => 
          selectedTypes.every(type => product.CoursePorductTypeArray.includes(type))
        );
      }

      // 狀態篩選
      if (selectedStatuses.length > 0) {
        filtered = filtered.filter(product => 
          selectedStatuses.every(status => product.CoursePorductStatueArray.includes(status))
        );
      }

      // 搜索篩選
      if (searchQuery) {
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [selectedTypes, selectedStatuses, searchQuery, GetProductListsData])

  const handleTypeChange = (typeId: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  const handleStatusChange = (statusId: string) => {
    setSelectedStatuses(prev =>
      prev.includes(statusId)
        ? prev.filter(s => s !== statusId)
        : [...prev, statusId]
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleProductClick = (e: React.MouseEvent<HTMLAnchorElement>, productId: string) => {
    if (!session) {
      e.preventDefault();
      alert('請先登入以查看商品詳情！');
      router.push('/auth/signin');
    }
  };

  if (status === 'loading') {
    return <div className="text-center py-10">載入中...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">錯誤: {error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">商店頁面</h1>

      {/* 複合搜尋列 */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 搜索輸入框 */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">搜索商品</label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="輸入商品名稱或描述..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 類型篩選 */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">類型篩選</label>
            <div className="flex flex-wrap gap-2">
              {GetCoursePorductTypeData.map(type => (
                <label key={type.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.id)}
                    onChange={() => handleTypeChange(type.id)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-sm">{type.typename}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 狀態篩選 */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">狀態篩選</label>
            <div className="flex flex-wrap gap-2">
              {GetCoursePorductStatueData.map(status => (
                <label key={status.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status.id)}
                    onChange={() => handleStatusChange(status.id)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-sm">{status.statuename}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
            <Link href={`/user/${userId}/shop/${product.id}`} onClick={(e) => handleProductClick(e, product.id)}>
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-blue-600 font-bold mt-2">HK${product.price}</p>
            </Link>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <p className="text-center col-span-full text-gray-500">未找到符合條件的商品</p>
        )}
      </div>
    </div>
  )
}

export default ShopPage