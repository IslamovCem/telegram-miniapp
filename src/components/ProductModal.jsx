import React from 'react';

const ProductModal = ({ product, onClose }) => {
  const adminUsername = 'islamovm';

  const handleMessageAdmin = () => {
    const message = `
📦 ${product.name}
💰 ${product.price} so‘m
👶 ${product.age}+ yosh

Menga shu mahsulot haqida ma'lumot kerak.
    `.trim();

    const url = `https://t.me/${adminUsername}?text=${encodeURIComponent(message)}`;

    if (window.Telegram?.WebApp?.shareText) {
      window.Telegram.WebApp.shareText(text);
    } else {
      window.open(`https://t.me/share/url?url=https://t.me/vitaminDorilar_bot?start=from_friend&text=${encodeURIComponent(text)}`);
    }
  };

  const handleShareWithFriend = () => {
    const text = `
🎁 Senga foydali mahsulot topdim:

📦 ${product.name}
💰 ${product.price} so‘m
👶 ${product.age}+ yoshdan

📝 ${product.description}

🛒 Xarid qilish: @vitaminDorilar_bot

🧬 Hamma kerakli vitamin va dori vositalari endi shu yerda!

👥 Do‘stlaringni ham taklif qil: https://t.me/your_group_link
    `.trim();

    window.open(`https://t.me/share/url?text=${encodeURIComponent(text)}`);

    if (window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(url); // ✅ Telegram ilovasida ochadi
  } else {
    window.open(url, '_blank'); // fallback
  }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-start justify-center px-4 pt-[10vh]">
      <div className="bg-zinc-800 rounded-xl p-5 max-w-md w-full relative shadow-xl max-h-[80vh] overflow-y-auto">
        <button className="absolute top-2 right-3 text-white text-xl" onClick={onClose}>✕</button>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-auto max-h-80 object-contain rounded-lg mb-4"
        />

        <h2 className="text-xl font-bold mb-2">{product.name}</h2>

        <p className="text-sm text-gray-300 mb-2 whitespace-pre-line">
          <span className="font-semibold">Tavsifi:</span> {product.description}
        </p>

        <p className="text-sm text-gray-300 mb-4">
          <span className="font-semibold">Yoshi:</span> {product.age} yoshdan
        </p>

        <button
          onClick={handleMessageAdmin}
          className="bg-blue-600 text-white py-2 px-4 rounded block text-center mt-2 w-full hover:bg-blue-700 transition"
        >
          ✉️ Adminga yozish
        </button>

        <button
          onClick={handleShareWithFriend}
          className="bg-green-600 text-white py-2 px-4 rounded block text-center mt-2 w-full hover:bg-green-700 transition"
        >
          📤 Do‘stga ulashish
        </button>
      </div>
    </div>
  );
};

export default ProductModal;
