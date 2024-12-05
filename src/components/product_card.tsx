'use client';

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
  discountedPrice?: number; // Optional for discounted pricing
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [cart, setCart] = useState<{ [key: number]: number }>(() => {
    const cartData = Cookies.get("cart");
    return cartData ? JSON.parse(cartData) : {};
  });
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Cookies.set("cart", JSON.stringify(cart), { expires: 7 });
  }, [cart]);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCart((prev) => ({ ...prev, [product.id]: 1 }));
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000); // Show message for 2 seconds
  };

  const handleIncreaseQuantity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCart((prev) => ({ ...prev, [product.id]: prev[product.id] + 1 }));
  };

  const handleDecreaseQuantity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
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

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const isInCart = cart[product.id] !== undefined;

  return (
    <div
      onClick={handleCardClick}
      className="max-w-[220px] rounded-lg border border-gray-200 shadow-md bg-white flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative"
    >
      {/* Image Section */}
      <div className="w-full h-36 sm:h-48 flex items-center justify-center bg-white">
        <img
          className="max-h-full max-w-full object-contain p-2"
          src={product.image}
          alt={product.title}
        />
      </div>

      {/* Content Section */}
      <div className="p-2 sm:p-3 flex flex-col justify-between flex-grow">
        {/* Title */}
        <h2 className="text-xs sm:text-sm font-bold text-gray-800 truncate">
          {product.title}
        </h2>
        {/* Description */}
        <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">
          {product.description}
        </p>

        {/* Price Section */}
        <div className="mt-3">
          <div>
            <span className="text-sm font-bold text-blue-600">
              ${product.discountedPrice || product.price}
            </span>
            {product.discountedPrice && (
              <span className="text-[10px] text-gray-400 line-through ml-1">
                ${product.price}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart / Quantity Controls */}
        <div className="mt-4">
          {isInCart ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecreaseQuantity}
                  className="w-8 h-8 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400"
                >
                  -
                </button>
                <span className="text-sm font-bold">{cart[product.id]}</span>
                <button
                  onClick={handleIncreaseQuantity}
                  className="w-8 h-8 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400"
                >
                  +
                </button>
              </div>
              <p className="text-[10px] text-green-600 mt-1">
                Already added to cart
              </p>
            </>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full py-2 rounded-lg text-sm font-bold bg-green-600 text-white hover:bg-green-700"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Added to Cart Message */}
      {showAddedMessage && (
        <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-md shadow-lg">
          Added to Cart!
        </div>
      )}
    </div>
  );
};

export default ProductCard;
