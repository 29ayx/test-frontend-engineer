'use client';
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/product_card";
import Header from "@/components/header";

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
    <div className="min-h-screen bg-gray-50">
      <div className="mt-16 pt-6">
        {/* Banner Section */}
        <div className="max-w-6xl mx-auto mt-6 mb-10 px-4">
          <img
            src="/banner.png"
            alt="Promotional Banner"
            className="rounded-lg w-full shadow-lg"
          />
        </div>

        {/* Product Grid */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
