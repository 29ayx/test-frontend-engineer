import React from "react";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full shadow-lg py-4 px-4 sm:px-10 bg-white font-[sans-serif] min-h-[40px] tracking-wide z-50">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <img
            src="/logo.png"
            alt="logo"
            className="w-36"
          />
        </a>

        {/* Home Link */}
        <nav className="flex-grow text-center">
          <a
            href="/"
            className="text-[#007bff] font-semibold text-[15px] hover:underline"
          >
            Home
          </a>
        </nav>

        {/* Cart Button */}
        <button className="flex items-center text-[#007bff] hover:underline font-semibold text-[15px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h18l-2 13H5L3 3z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 21a2 2 0 100-4 2 2 0 000 4zM17 21a2 2 0 100-4 2 2 0 000 4z"
            />
          </svg>
          Cart
        </button>
      </div>
    </header>
  );
};

export default Header;
