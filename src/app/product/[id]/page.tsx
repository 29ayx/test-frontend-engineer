'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import ProductCard from "@/components/product_card";

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

async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
}

async function fetchAllProducts(): Promise<Product[]> {
  const response = await fetch("https://fakestoreapi.com/products");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

export default function ProductDetails() {
  const params = useParams(); // Get params dynamically
  const id = params.id; // Extract the product ID
  const [product, setProduct] = useState<Product | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>(() => {
    const cartData = Cookies.get("cart");
    return cartData ? JSON.parse(cartData) : {};
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const fetchedProduct = await fetchProduct(id);
        const fetchedProducts = await fetchAllProducts();
        setProduct(fetchedProduct);
        setSuggestedProducts(
          fetchedProducts.filter((p) => p.id.toString() !== id)
        );
      } catch (error) {
        console.error("Failed to load product or suggested products:", error);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    Cookies.set("cart", JSON.stringify(cart), { expires: 7 });
  }, [cart]);

  const handleAddToCart = () => {
    if (!product) return;
    setCart((prev) => ({ ...prev, [product.id]: 1 }));
  };

  const handleIncreaseQuantity = () => {
    if (!product) return;
    setCart((prev) => ({ ...prev, [product.id]: prev[product.id] + 1 }));
  };

  const handleDecreaseQuantity = () => {
    if (!product) return;
    setCart((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[product.id] > 1) {
        updatedCart[product.id] -= 1;
      } else {
        delete updatedCart[product.id];
      }
      return updatedCart;
    });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <section className="py-8 mt-10 pt-10 bg-white md:py-16 dark:bg-gray-900 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          {/* Image Section */}
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
            <img
              className="w-full max-h-[300px] sm:max-h-[400px] dark:hidden object-contain"
              src={product.image}
              alt={product.title}
            />
            <img
              className="w-full max-h-[300px] sm:max-h-[400px] hidden dark:block object-contain"
              src={product.image}
              alt={product.title}
            />
          </div>

          {/* Details Section */}
          <div className="mt-6 sm:mt-8 lg:mt-0">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              {product.title}
            </h1>
            <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
              <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                ${product.price}
              </p>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating.rate)
                          ? "text-yellow-300"
                          : "text-gray-200"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                  ({product.rating.rate})
                </p>
                <a
                  href="#"
                  className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white"
                >
                  {product.rating.count} Reviews
                </a>
              </div>
            </div>

            <div className="mt-6 lg:mt-12">
              {cart[product.id] ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleDecreaseQuantity}
                    className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold">{cart[product.id]}</span>
                  <button
                    onClick={handleIncreaseQuantity}
                    className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-3 bg-green-600 text-white text-2xl rounded-lg hover:bg-green-700"
                >
                   Add to Cart
                </button>
              )}
            </div>

            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800 lg:mt-12" />

            <p className="mb-6 text-gray-500 dark:text-gray-400">
              {product.description}
            </p>
          </div>
        </div>

        {/* Suggested Products */}
        <h2 className="text-lg font-semibold mt-12">Suggested Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {suggestedProducts.map((suggestedProduct) => (
            <ProductCard key={suggestedProduct.id} product={suggestedProduct} />
          ))}
        </div>
      </div>
    </section>
  );
}
