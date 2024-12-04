'use client';
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/product_card";
import Link from "next/link"; // Import Link from Next.js

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Centered and Boxed Layout */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} passHref>
             
                <ProductCard product={product} />
              
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
