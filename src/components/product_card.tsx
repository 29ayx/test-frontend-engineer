import React from "react";

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
  return (
    <div className="max-w-[220px] rounded-lg border border-gray-200 shadow-md bg-white flex flex-col overflow-hidden">
      {/* Image Section */}
      <div className="w-full h-36 sm:h-48 flex items-center justify-center bg-white">
        <img
          className="max-h-full max-w-full object-contain p-2"
          src={product.image}
          alt={product.title}
        />
      </div>

      {/* Content Section */}
      <div className="p-2 sm:p-3">
        {/* Title */}
        <h2 className="text-xs sm:text-sm font-bold text-gray-800 truncate">
          {product.title}
        </h2>
        {/* Description */}
        <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">
          {product.description}
        </p>

        {/* Price Section */}
        <div className="flex items-center justify-between mt-2">
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
          {/* Emoji Button */}
          <button className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-sm">
            🛍️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
