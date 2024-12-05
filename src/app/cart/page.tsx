'use client';

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  const product = await response.json();
  return { ...product, quantity: 1 };
}

export default function Cart() {
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const loadCartProducts = async () => {
      // Get cart data from cookies
      const cartData = Cookies.get("cart");
      if (!cartData) {
        return;
      }

      const cartItems = JSON.parse(cartData) as { [key: number]: number };

      // Fetch products for each item in cart
      const productPromises = Object.entries(cartItems).map(async ([id, quantity]) => {
        const product = await fetchProduct(id);
        return {
          ...product,
          quantity: quantity
        };
      });

      try {
        const products = await Promise.all(productPromises);
        setCartProducts(products);
        calculateTotal(products);
      } catch (error) {
        console.error("Failed to load cart products:", error);
      }
    };

    loadCartProducts();
  }, []);

  const calculateTotal = (products: Product[]) => {
    const totalPrice = products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    setTotal(totalPrice);
  };

  const handleIncreaseQuantity = (id: number) => {
    setCartProducts((prev) => {
      const updatedProducts = prev.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      );
      updateCartCookies(updatedProducts);
      calculateTotal(updatedProducts);
      return updatedProducts;
    });
  };

  const handleDecreaseQuantity = (id: number) => {
    setCartProducts((prev) => {
      const updatedProducts = prev.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity - 1 }
          : product
      ).filter((product) => product.quantity > 0);
      updateCartCookies(updatedProducts);
      calculateTotal(updatedProducts);
      return updatedProducts;
    });
  };

  const updateCartCookies = (products: Product[]) => {
    const cartItems = products.reduce((acc, product) => {
      acc[product.id] = product.quantity;
      return acc;
    }, {} as { [key: number]: number });
    
    Cookies.set("cart", JSON.stringify(cartItems));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      {cartProducts.length === 0 ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <p className="text-gray-600 text-xl mb-4">Your cart is empty.</p>
        <button
          onClick={() => window.location.href = "/"}
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
        >
          Get Products
        </button>
      </div>
      
      ) : (
        <div className="space-y-6">
          {cartProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-16 h-16 object-contain rounded-lg"
                />
                <div className="ml-4">
                  <h2 className="text-sm font-bold text-gray-800">
                    {product.title}
                  </h2>
                  <p className="text-gray-500">${product.price}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleDecreaseQuantity(product.id)}
                  className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  -
                </button>
                <span>{product.quantity}</span>
                <button
                  onClick={() => handleIncreaseQuantity(product.id)}
                  className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <div className="text-right">
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
          </div>

          <button className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}