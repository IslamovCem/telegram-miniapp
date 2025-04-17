import React from 'react';

const ProductModal = ({ product, onClose }) => {
  const handleMessageAdmin = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      const message = encodeURIComponent(`
🛍 Mahsulot haqida:

${product.name}
Narxi: ${product.price} so‘m
${product.available ? 'Mavjud: ✅' : 'Mavjud emas: ❌'}
      `);

      const adminUsername = 'islamovm';
      const url = `https://t.me/${adminUsername}?text=${message}`;
      window.Telegram.WebApp.openTelegramLink(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-start justify-center px-4 pt-[10vh]">
      <div className="bg-zinc-800 rounded-xl p-5 max-w-md w-full relative shadow-xl max-h-[80vh] overflow-y-auto">

        {/* Yopish tugmasi */}
        <button
          className="absolute top-2 right-3 text-white text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Rasm */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />

        {/* Nomi */}
        <h2 className="text-xl font-bold mb-2">{product.name}</h2>

        {/* Tavsif */}
        <p className="text-sm text-gray-300 mb-2 whitespace-pre-line">
          <span className="font-semibold">Tavsifi:</span> {product.description}
        </p>

        {/* Yoshi */}
        <p className="text-sm text-gray-300 mb-4">
          <span className="font-semibold">Yoshi:</span> {product.age} yoshdan
        </p>

        {/* Adminga yozish tugmasi */}
        <button
          onClick={handleMessageAdmin}
          className="bg-blue-600 text-white py-2 px-4 rounded block text-center mt-2 w-full hover:bg-blue-700 transition"
        >
          ✉️ Adminga yozish
        </button>
      </div>
    </div>
  );
};

export default ProductModal;
