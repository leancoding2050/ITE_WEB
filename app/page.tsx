// 'use client';

// import { useSession } from 'next-auth/react';
// import { useParams, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import Link from 'next/link';

// interface CourseProduct {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   typeIds: string[]; // 簡化命名
//   statusIds: string[]; // 簡化命名
// }

// interface CourseProductType {
//   id: string;
//   typeName: string;
//   author: string;
// }

// interface CourseProductStatus {
//   id: string;
//   statusName: string;
// }

// const ShopPage = () => {
//   const { data: session, status } = useSession();
//   const params = useParams();
//   const userId = params.userId as string;
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);
//   const [productLists, setProductLists] = useState<CourseProduct[]>([]);
//   const [courseProductTypes, setCourseProductTypes] = useState<CourseProductType[]>([]);
//   const [courseProductStatuses, setCourseProductStatuses] = useState<CourseProductStatus[]>([]);
//   const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
//   const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [filteredProducts, setFilteredProducts] = useState<CourseProduct[]>([]);

//   const fetchProductLists = async () => {
//     try {
//       const response = await fetch('/api/product/Get_Product_Lists');
//       if (!response.ok) {
//         throw new Error(`無法獲取商品數據: ${response.status}`);
//       }
//       const data = await response.json();
//       setProductLists(data);
//       setFilteredProducts(data);
//       setError(null);
//     } catch (error: unknown) {
//       console.error('獲取商品數據失敗:', error);
//       setError(error instanceof Error ? error.message : '無法獲取商品數據');
//     }
//   };

//   const fetchCourseProductStatuses = async () => {
//     try {
//       const response = await fetch('/api/Statue/Get_Statue_Lists');
//       if (!response.ok) {
//         throw new Error(`無法獲取狀態數據: ${response.status}`);
//       }
//       const data = await response.json();
//       setCourseProductStatuses(data);
//       setError(null);
//     } catch (error: unknown) {
//       console.error('獲取狀態數據失敗:', error);
//       setError(error instanceof Error ? error.message : '無法獲取狀態數據');
//     }
//   };

//   const fetchCourseProductTypes = async () => {
//     try {
//       const response = await fetch('/api/Type/Get_Type_Lists');
//       if (!response.ok) {
//         throw new Error(`無法獲取類型數據: ${response.status}`);
//       }
//       const data = await response.json();
//       setCourseProductTypes(data);
//       setError(null);
//     } catch (error: unknown) {
//       console.error('獲取類型數據失敗:', error);
//       setError(error instanceof Error ? error.message : '無法獲取類型數據');
//     }
//   };

//   useEffect(() => {
//     fetchProductLists();
//     fetchCourseProductStatuses();
//     fetchCourseProductTypes();
//   }, []);

//   useEffect(() => {
//     const filterProducts = () => {
//       let filtered = productLists;

//       if (selectedTypes.length > 0) {
//         filtered = filtered.filter((product) =>
//           selectedTypes.some((type) => product.typeIds.includes(type))
//         );
//       }

//       if (selectedStatuses.length > 0) {
//         filtered = filtered.filter((product) =>
//           selectedStatuses.some((status) => product.statusIds.includes(status))
//         );
//       }

//       if (searchQuery) {
//         filtered = filtered.filter(
//           (product) =>
//             product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             product.description.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//       }

//       setFilteredProducts(filtered);
//     };

//     filterProducts();
//   }, [selectedTypes, selectedStatuses, searchQuery, productLists]);

//   const handleTypeChange = (typeId: string) => {
//     setSelectedTypes((prev) =>
//       prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
//     );
//   };

//   const handleStatusChange = (statusId: string) => {
//     setSelectedStatuses((prev) =>
//       prev.includes(statusId) ? prev.filter((s) => s !== statusId) : [...prev, statusId]
//     );
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleProductClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
//     if (!session) {
//       e.preventDefault();
//       alert('請先登入以查看商品詳情！');
//       router.push('/auth/signin');
//     }
//   };

//   if (status === 'loading') {
//     return <div className="text-center py-10">載入中...</div>;
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-red-500 text-center py-10">錯誤: {error}</div>
//         <button
//           onClick={() => {
//             fetchProductLists();
//             fetchCourseProductStatuses();
//             fetchCourseProductTypes();
//           }}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           重試
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">商店頁面</h1>

//       {/* 複合搜尋列 */}
//       <div className="bg-white shadow-md rounded-lg p-6 mb-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* 搜索輸入框 */}
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-2">搜索課程</label>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={handleSearchChange}
//               placeholder="輸入課程名稱或描述..."
//               className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* 類型篩選 */}
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-2">類型篩選</label>
//             <div className="flex flex-wrap gap-2">
//               {courseProductTypes.map((type) => (
//                 <label key={type.id} className="inline-flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={selectedTypes.includes(type.id)}
//                     onChange={() => handleTypeChange(type.id)}
//                     className="form-checkbox h-5 w-5 text-blue-600"
//                   />
//                   <span className="ml-2 text-sm">{type.typeName}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* 狀態篩選 */}
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-2">狀態篩選</label>
//             <div className="flex flex-wrap gap-2">
//               {courseProductStatuses.map((status) => (
//                 <label key={status.id} className="inline-flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={selectedStatuses.includes(status.id)}
//                     onChange={() => handleStatusChange(status.id)}
//                     className="form-checkbox h-5 w-5 text-blue-600"
//                   />
//                   <span className="ml-2 text-sm">{status.statusName}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 商品列表 */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {filteredProducts.map((product) => (
//           <div key={product.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
//             <Link href={`/user/${userId}/shop/${product.id}`} onClick={handleProductClick}>
//               <h2 className="text-lg font-semibold">{product.title}</h2>
//               <p className="text-gray-600">{product.description}</p>
//               <p className="text-blue-600 font-bold mt-2">HK${(product.price / 100).toFixed(2)}</p>
//             </Link>
//           </div>
//         ))}
//         {filteredProducts.length === 0 && (
//           <p className="text-center col-span-full text-gray-500">未找到符合條件的課程</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShopPage;



'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CourseProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  real_price: number;
  CoursePorductTypeArray: string[];
  CoursePorductStatueArray: string[];
}

interface CourseProductType {
  id: string;
  typename: string; // 注意這裡是 typename，而不是 typeName
  author: string;
}

interface CourseProductStatus {
  id: string;
  statuename: string; // 注意這裡是 statuename，而不是 statusName
}

const ShopPage = () => {
  const { data: session, status } = useSession();
  const params = useParams();
  const userId = params.userId as string;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [productLists, setProductLists] = useState<CourseProduct[]>([]);
  const [courseProductTypes, setCourseProductTypes] = useState<CourseProductType[]>([]);
  const [courseProductStatuses, setCourseProductStatuses] = useState<CourseProductStatus[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<CourseProduct[]>([]);

  const fetchProductLists = async () => {
    try {
      const response = await fetch('/api/product/Get_Product_Lists');
      if (!response.ok) {
        throw new Error(`無法獲取商品數據: ${response.status}`);
      }
      const data = await response.json();
      console.log('API 返回的商品數據:', data); // 添加日誌
      setProductLists(data);
      setFilteredProducts(data);
      setError(null);
    } catch (error: unknown) {
      console.error('獲取商品數據失敗:', error);
      setError(error instanceof Error ? error.message : '無法獲取商品數據');
    }
  };

  const fetchCourseProductStatuses = async () => {
    try {
      const response = await fetch('/api/Status/Get_Status_Lists');
      if (!response.ok) {
        throw new Error(`無法獲取狀態數據: ${response.status}`);
      }
      const data = await response.json();
      setCourseProductStatuses(data);
      setError(null);
    } catch (error: unknown) {
      console.error('獲取狀態數據失敗:', error);
      setError(error instanceof Error ? error.message : '無法獲取狀態數據');
    }
  };

  const fetchCourseProductTypes = async () => {
    try {
      const response = await fetch('/api/Type/Get_Type_Lists');
      if (!response.ok) {
        throw new Error(`無法獲取類型數據: ${response.status}`);
      }
      const data = await response.json();
      setCourseProductTypes(data);
      setError(null);
    } catch (error: unknown) {
      console.error('獲取類型數據失敗:', error);
      setError(error instanceof Error ? error.message : '無法獲取類型數據');
    }
  };

  useEffect(() => {
    fetchProductLists();
    fetchCourseProductStatuses();
    fetchCourseProductTypes();
  }, []);

  useEffect(() => {
    const filterProducts = () => {
      if (!productLists.length) {
        setFilteredProducts([]);
        return;
      }

      let filtered = productLists;

      if (selectedTypes.length > 0) {
        filtered = filtered.filter((product) =>
          Array.isArray(product.CoursePorductTypeArray) &&
          selectedTypes.some((type) => product.CoursePorductTypeArray.includes(type))
        );
      }

      if (selectedStatuses.length > 0) {
        filtered = filtered.filter((product) =>
          Array.isArray(product.CoursePorductStatueArray) &&
          selectedStatuses.some((status) => product.CoursePorductStatueArray.includes(status))
        );
      }

      if (searchQuery) {
        filtered = filtered.filter(
          (product) =>
            product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [selectedTypes, selectedStatuses, searchQuery, productLists]);

  const handleTypeChange = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
  };

  const handleStatusChange = (statusId: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusId) ? prev.filter((s) => s !== statusId) : [...prev, statusId]
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleProductClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!session) {
      e.preventDefault();
      alert('請先登入以查看商品詳情！');
      router.push('/auth/signin');
    }
  };

  if (status === 'loading') {
    return <div className="text-center py-10">載入中...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center py-10">錯誤: {error}</div>
        <button
          onClick={() => {
            fetchProductLists();
            fetchCourseProductStatuses();
            fetchCourseProductTypes();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          重試
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">商店頁面</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">搜索課程</label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="輸入課程名稱或描述..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">類型篩選</label>
            <div className="flex flex-wrap gap-2">
              {courseProductTypes.map((type) => (
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

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">狀態篩選</label>
            <div className="flex flex-wrap gap-2">
              {courseProductStatuses.map((status) => (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
            <Link href={`/user/${userId}/shop/${product.id}`} onClick={handleProductClick}>
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-blue-600 font-bold mt-2">HK${(product.price ).toFixed(2)}</p>
              <p className="text-blue-600 font-bold mt-2">打折後  HK${(product.real_price ).toFixed(2)}</p>
            </Link>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <p className="text-center col-span-full text-gray-500">未找到符合條件的課程</p>
        )}
      </div>
    </div>
  );
};

export default ShopPage;