import React from 'react';

const ProductModal = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-zinc-800 rounded-xl p-5 max-w-md w-full relative shadow-xl">
        <button
          className="absolute top-2 right-3 text-white text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h2 className="text-xl font-bold mb-2">{product.name}</h2>

        <p className="text-sm text-gray-300 mb-2">
          <span className="font-semibold">Tavsifi:</span> {product.description}
        </p>

        <p className="text-sm text-gray-300 mb-4">
          <span className="font-semibold">Yoshi:</span> {product.age} yoshdan
        </p>

        <a
          href={`https://t.me/your_admin_username`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-white text-black text-center py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Adminga yozish
        </a>
      </div>
    </div>
  );
};

export default ProductModal;