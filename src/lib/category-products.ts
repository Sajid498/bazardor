
import {
  getProducts,
  normalizeProducts,
  type Product,
} from "@/lib/products";

const API_BASE_URLS = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

const categoryAliases: Record<string, string[]> = {
  chal: ["chal", "rice", "চাল"],
  dal: ["dal", "lentil", "pulses", "ডাল"],
  tel: ["tel", "oil", "তেল"],
  shobji: [
    "shobji",
    "vegetable",
    "vegetables",
    "সবজি",
    "শাকসবজি",
    "শাক-সবজি",
  ],
  mach: ["mach", "fish", "মাছ"],
  mangsho: ["mangsho", "meat", "মাংস"],
  "dim-dudh": [
    "dim-dudh",
    "egg-milk",
    "eggs-dairy",
    "ডিম-দুধ",
    "ডিম ও দুধ",
  ],
  moshla: [
    "moshla",
    "mosla",
    "spice",
    "spices",
    "মসলা",
  ],
};

function matchesCategory(
  productCategory: string,
  slug: string
): boolean {
  const value = productCategory
    .trim()
    .toLowerCase();

  const aliases = categoryAliases[slug] || [slug];

  return aliases.some(
    (alias) => alias.toLowerCase() === value
  );
}

export async function getCategoryProducts(
  slug: string
): Promise<Product[]> {
  let allProductsLoaded = false;

  // Reuse the full products API already used on Home.
  try {
    const products = await getProducts();
    allProductsLoaded = true;

    const matched = products.filter((product) =>
      matchesCategory(product.category, slug)
    );

    if (matched.length > 0) {
      return matched;
    }
  } catch (error) {
    console.error(
      "Full product category filtering failed:",
      error
    );
  }

  // Fallback: use the assignment's filtered endpoint.
  for (const baseUrl of API_BASE_URLS) {
    try {
      const url = new URL(`${baseUrl}/products`);
      url.searchParams.set("category", slug);

      const response = await fetch(url.toString(), {
        next: {
          revalidate: 300,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Category API status: ${response.status}`
        );
      }

      const data: unknown = await response.json();
      const products = normalizeProducts(data);

      if (products.length > 0) {
        return products;
      }

      // The API successfully returned no items.
      if (Array.isArray(data) && data.length === 0) {
        return [];
      }
    } catch (error) {
      console.error(
        `Category API failed: ${baseUrl}`,
        error
      );
    }
  }

  if (allProductsLoaded) {
    return [];
  }

  throw new Error(
    "Unable to load products for this category."
  );
}
