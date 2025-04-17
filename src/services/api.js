const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getProducts() {
  try {
    const res = await fetch(`${API_BASE}/api/products`);
    if (!res.ok) {
      throw new Error(`❌ Fetch error: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("❌ API bilan bog‘lanishda xatolik:", error);
    throw error;
  }
}
