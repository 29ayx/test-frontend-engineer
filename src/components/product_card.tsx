'use client';

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Star } from 'lucide-react';

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
  discountedPrice?: number;
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

  // Update cookies when cart changes
  useEffect(() => {
    Cookies.set("cart", JSON.stringify(cart), { expires: 7 });
  }, [cart]);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card click navigation
    setCart((prev) => {
      const updatedCart = { ...prev, [product.id]: (prev[product.id] || 0) + 1 };
      Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 }); // Update cookies immediately
      return updatedCart;
    });
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000); // Hide the "added to cart" message after 2 seconds
  };

  const handleIncreaseQuantity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCart((prev) => {
      const updatedCart = { ...prev, [product.id]: (prev[product.id] || 0) + 1 };
      Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 }); // Update cookies immediately
      return updatedCart;
    });
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
      Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 }); // Update cookies immediately
      return updatedCart;
    });
  };

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const isInCart = cart[product.id] !== undefined;

  // Render star rating
  const renderStarRating = () => {
    if (!product.rating) return null;
    
    const fullStars = Math.floor(product.rating.rate);
    const halfStar = product.rating.rate % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center mt-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={16} fill="#FFD700" color="#FFD700" />
        ))}
        {halfStar && (
          <Star size={16} fill="url(#halfStar)" color="#FFD700" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={16} color="#E0E0E0" />
        ))}
        <span className="text-xs text-gray-500 ml-1">
          ({product.rating.count})
        </span>
      </div>
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className="max-w-[220px] rounded-lg border border-gray-200 shadow-md bg-white flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative"
    >
      {/* SVG for half-star fill */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="halfStar">
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#E0E0E0" />
          </linearGradient>
        </defs>
      </svg>

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
        
        {/* Ratings */}
        {renderStarRating()}

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
              <div className="flex flex-col space-y-2">
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
              </div>
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

      {/* Removed "Added to Cart Message" */}
    </div>
  );
};

export default ProductCard;
