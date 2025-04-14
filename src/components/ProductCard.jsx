import React from 'react';

const ProductCard = ({ product, onClick }) => {
  return (
    <div
      className="bg-zinc-800 rounded-xl p-3 mb-3 shadow hover:shadow-lg transition cursor-pointer"
      onClick={() => onClick(product)}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 object-cover rounded-lg mb-2"
      />
      <h3 className="text-white text-lg font-semibold mb-1">{product.name}</h3>
      {product.price ? (
        <p className="text-green-400 font-medium">{product.price}</p>
      ) : (
        <p className="text-red-400 font-medium">Out of stock</p>
      )}
    </div>
  );
};

export default ProductCard;