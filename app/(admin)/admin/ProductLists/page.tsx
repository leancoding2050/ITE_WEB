"use client"

import Link from "next/link";
import { useEffect, useState } from "react"

interface ProductLists {
    id:string;
    title: string;
    description: string;
    price: number;
    IsPublic: boolean;
}

const ProductListsPage = () => {

    const [GetProductData , setGetProductData] = useState<ProductLists[]>([])

    useEffect(() => {
        const fetchProductDataLists = async () => {
            const response = await fetch("/api/product/Get_Product_Lists");
            const data = await response.json();
            setGetProductData(data);
        };
        
        fetchProductDataLists();

    }, [])

    console.log(" GetProductData :" , GetProductData , " -- End -- ")

    return(
        <>
            <div>
                <Link href={"/admin/ProductLists/CreateProduct"}>
                    建立商品
                </Link>

            </div>
            ProductListsPage

            <div>
                {GetProductData && GetProductData.map((products) => {
                    return(
                        <div key={products.id}>
                            <Link href={`/admin/ProductLists/${products.id}`}>
                                Title: {products.title}
                                <br />
                                description: {products.description}
                                <br />
                                price: {products.price}
                                <br />
                                IsPublic: {products.IsPublic}
                            </Link>

                        </div>

                    )
                })}

            </div>

        </>
    )

}

export default ProductListsPage