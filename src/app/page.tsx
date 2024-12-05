'use client';

import React, { useEffect, useState, useRef } from "react";
import ProductCard from "@/components/product_card";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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
  const [cartCount, setCartCount] = useState<number>(0); // Track cart count dynamically
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Fetching products on page load
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

  // IntersectionObserver for infinite scrolling
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

  // Track cart changes and update dynamically
  useEffect(() => {
    const loadCartCount = () => {
      const cartData = Cookies.get("cart");
      if (cartData) {
        const cartItems = JSON.parse(cartData);
        const totalItems = Object.values(cartItems).reduce((acc: number, count: number) => acc + count, 0);
        setCartCount(totalItems); // Update the cart count
      }
    };

    loadCartCount(); // Initial load

    // Use an interval to monitor cookies for changes and update cart count
    const intervalId = setInterval(loadCartCount, 500); // Check every second

    return () => {
      clearInterval(intervalId); // Cleanup interval on unmount
    };
  }, []);

  // Go to Cart Page
  const handleGoToCart = () => {
    router.push("/cart"); // Navigate to cart page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
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
                key={`${product.id}-${index}`} // Ensure unique keys
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

      {/* Floating Cart Banner */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-green-600 text-white py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
            <p className="text-sm font-semibold">
              {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
            </p>
            <button
              onClick={handleGoToCart}
              className="px-6 py-2 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100"
            >
              Go to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
