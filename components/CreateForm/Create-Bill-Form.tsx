// "use client";


// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useTransition } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { useParams, useRouter } from "next/navigation";


// import { CreateBillSchema } from "@/app/actions/Create/Create_Bill/schema";
// import { CreateBillAction } from "@/app/actions/Create/Create_Bill";


// const CreateBillForm = () => { 
//     const [isPending, startTransition] = useTransition();
//     const router = useRouter();   
//     const params = useParams();
//     console.log("params : ",  params)



//       const bill_form = useForm<z.infer<typeof CreateBillSchema>>({
//         resolver: zodResolver(CreateBillSchema),
//         defaultValues: {
//             client_name: "",
//             title: "",
//             description: "",
//             price: 0,
//             total: 0,
//             date: "",
//         },
//       });

//         const bill_form_onSubmit = (values: z.infer<typeof CreateBillSchema>) => {
//           console.log("-- Bill輸入數據 -- :", values, "-- 結束 --");
//         };



// console.log("Error:",bill_form.formState.errors,"-- End --" )

//           return (
//             <Form {...bill_form}>
//               <form onSubmit={bill_form.handleSubmit(bill_form_onSubmit)}>
//           <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={bill_form.control}
//               name="client_name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>學生名字</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="學生名字"
//                       type="text"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={bill_form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>標題</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="標題"
//                       type="text"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//                     <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={bill_form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>內容</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="內容"
//                       type="text"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//                     <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={bill_form.control}
//               name="price"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>債錢</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="債錢"
//                       type="text"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//                     <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={bill_form.control}
//               name="total"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>總數</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="總數"
//                       type="text"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>


//         <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={bill_form.control}
//               name="date"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>日子</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="日子"
//                       type="text"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>


//                 <Button type="submit" disabled={isPending} className="mt-4">
//                   {isPending ? "提交中..." : "提交"}
//                 </Button>
//                 {bill_form.formState.errors.root && (
//                   <p className="text-red-500 mt-2">{bill_form.formState.errors.root.message}</p>
//                 )}
//               </form>
//             </Form>
//           );
    
// };

// export default CreateBillForm;

"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreateBillSchema } from "@/app/actions/Create/Create_Bill/schema";
import { CreateBillAction } from "@/app/actions/Create/Create_Bill";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // 導入 Sonner 的 toast

interface User {
  id: string;
  name?: string;
  username: string;
  role: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  real_price: number;
  CoursePorductTypeArray: string[];
  CoursePorductStatueArray: string[];
}

const CreateBillForm = () => {
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const router = useRouter();

  // 獲取用戶數據
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user/Get_User_Lists");
        if (!response.ok) throw new Error("無法獲取用戶數據");
        const data = await response.json();
        const filteredData = data.filter((user: User) => user.role === "USER");
        setUsers(filteredData);
        setFilteredUsers(filteredData);
      } catch (error) {
        console.error("獲取用戶數據失敗:", error);
        toast.error("無法獲取用戶數據，請稍後重試。", {
          description: "錯誤",
        });
      }
    };
    fetchUsers();
  }, []);

  // 獲取商品數據
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product/Get_Product_Lists");
        if (!response.ok) throw new Error("無法獲取商品數據");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("獲取商品數據失敗:", error);
        toast.error("無法獲取商品數據，請稍後重試。", {
          description: "錯誤",
        });
      }
    };
    fetchProducts();
  }, []);

  // 用戶搜尋功能
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.username.toLowerCase().includes(userSearch.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [userSearch, users]);

  // 商品搜尋功能
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.description.toLowerCase().includes(productSearch.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [productSearch, products]);

  // 表單初始化
  const bill_form = useForm<z.infer<typeof CreateBillSchema>>({
    resolver: zodResolver(CreateBillSchema),
    defaultValues: {
      client_name: "",
      title: "",
      description: "",
      total: 0,
      date: new Date().toISOString().split("T")[0],
      client_id: "",
      products: [],
    },
  });

  // 計算總金額並更新產品列表
  useEffect(() => {
    const total = selectedProducts.reduce((sum, product) => sum + product.real_price, 0);
    bill_form.setValue("total", total);
    bill_form.setValue(
      "products",
      selectedProducts.map((product) => ({
        title: product.title,
        description: product.description,
        price: product.real_price,
      }))
    );
  }, [selectedProducts, bill_form]);

  // 提交表單
  const bill_form_onSubmit = (values: z.infer<typeof CreateBillSchema>) => {
    startTransition(async () => {
      try {

              const submitData = {
        ...values,
        products: selectedProducts.map((product) => ({
          title: product.title,
          description: product.description,
          price: product.real_price,
        })),
      };
        const result = await CreateBillAction(submitData);
        if (result.data) {
          toast.success("帳單已成功創建！", {
            description: "成功",
          });
          router.push("/admin/Accounts");
        } else {
          toast.error(result.error || "建立帳單失敗，請稍後重試。", {
            description: "錯誤",
          });
        }
      } catch (error) {
        console.error("建立帳單失敗:", error);
        toast.error("建立帳單失敗，請稍後重試。", {
          description: "錯誤",
        });
      }
    });
  };



  // 添加商品到列表
  const handleAddProduct = (product: Product) => {
    setSelectedProducts((prev) => [...prev, product]);
  };

  // 移除商品
  const handleRemoveProduct = (index: number) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Form {...bill_form}>
      <form onSubmit={bill_form.handleSubmit(bill_form_onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={bill_form.control}
            name="client_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>學生名字</FormLabel>
                <Input
                  placeholder="搜尋學生名字或用戶名"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="mb-2"
                />
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      const selectedUser = users.find((user) => user.id === value);
                      if (selectedUser) {
                        bill_form.setValue("client_name", selectedUser.name || selectedUser.username);
                        bill_form.setValue("client_id", selectedUser.id);
                      }
                    }}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇學生" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name || user.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={bill_form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>標題</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="標題" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={bill_form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>內容</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="內容" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" disabled={isPending}>
                加入商品
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>選擇商品</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="搜尋商品標題或描述"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>標題</TableHead>
                      <TableHead>描述</TableHead>
                      <TableHead>價格</TableHead>
                      <TableHead>實際價格</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>HK${product.price.toFixed(2)}</TableCell>
                        <TableCell>HK${product.real_price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            onClick={() => handleAddProduct(product)}
                            disabled={isPending}
                          >
                            加入
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">已選擇的商品</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>標題</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>實際價格</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>HK${product.real_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveProduct(index)}
                      disabled={isPending}
                    >
                      刪除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={bill_form.control}
            name="total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>總數</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="總數"
                    type="number"
                    value={field.value.toFixed(2)}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={bill_form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>日子</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending} className="mt-4">
          {isPending ? "提交中..." : "建立單據"}
        </Button>
        {bill_form.formState.errors.root && (
          <p className="text-red-500 mt-2">{bill_form.formState.errors.root.message}</p>
        )}
      </form>
    </Form>
  );
};

export default CreateBillForm;