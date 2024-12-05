'use client';

import React, { useEffect, useState, useRef } from "react";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1); // For pagination
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (loading) return; // Prevent fetching if already loading
      setLoading(true);
      const response = await fetch(`https://fakestoreapi.com/products?page=${page}&limit=10`);
      const data = await response.json();
      setProducts((prevProducts) => [...prevProducts, ...data]);
      setLoading(false);
    };

    fetchProducts();
  }, [page]);

  const lastProductRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loading) return;

    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const loadMoreProducts = ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting) {
        setPage((prev) => prev + 1); // Load more products
      }
    };

    if (lastProductRef.current) {
      observer.current = new IntersectionObserver(loadMoreProducts, options);
      observer.current.observe(lastProductRef.current);
    }

    return () => {
      if (observer.current && lastProductRef.current) {
        observer.current.disconnect();
      }
    };
  }, [loading]);

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
            {products.map((product, index) => (
              <div
                key={`${product.id}-${index}`} // Combine id with index to ensure unique keys
                ref={index === products.length - 1 ? lastProductRef : null} // Set last product ref
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Loading Spinner */}
          {loading && <div className="text-center py-4">Loading...</div>}
        </div>
      </div>
    </div>
  );
}
