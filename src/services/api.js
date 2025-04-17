const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getProducts() {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) {
    throw new Error(`Xatolik: ${res.status}`);
  }
  return res.json();
}
