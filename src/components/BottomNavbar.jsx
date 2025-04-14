import React from 'react';

const BottomNavbar = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { label: 'Barchasi', value: 'all' },
    { label: 'Dorilar', value: 'dori' },
    { label: 'Vitaminlar', value: 'vitamin' },
    { label: 'Parfyumeriyalar', value: 'parfyumeriya' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 flex justify-around py-2 z-50">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setActiveCategory(cat.value)}
          className={`text-sm px-3 py-1 rounded ${
            activeCategory === cat.value
              ? 'bg-white text-black font-semibold'
              : 'text-white'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default BottomNavbar;