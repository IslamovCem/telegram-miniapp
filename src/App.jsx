import React, { useEffect, useState } from 'react';
import { getProducts } from './services/api';
import ProductCard from './components/ProductCard';
import BottomNavbar from './components/BottomNavbar';
import ProductModal from './components/ProductModal';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }

    getProducts()
      .then(setProducts)
      .catch((err) => {
        console.error("❌ API xato:", err);
      });
  }, []);

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.type === activeCategory);

  return (
    <div className="min-h-screen bg-zinc-900 text-white pb-20 px-4 pt-4">
      <h1 className="text-2xl font-bold mb-4">🛍 Katalog</h1>
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onClick={setSelectedProduct}
          />
        ))}
      </div>

      <BottomNavbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default App;