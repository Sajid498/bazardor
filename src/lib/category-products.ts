
import {
  getProducts,
  type Product,
} from "@/lib/products";

const aliases: Record<string, string[]> = {
  chal: [
    "chal",
    "rice",
    "চাল",
  ],

  dal: [
    "dal",
    "lentil",
    "pulses",
    "ডাল",
  ],

  tel: [
    "tel",
    "oil",
    "তেল",
  ],

  shobji: [
    "shobji",
    "vegetable",
    "vegetables",
    "সবজি",
    "শাকসবজি",
  ],

  mach: [
    "mach",
    "fish",
    "মাছ",
  ],

  mangsho: [
    "mangsho",
    "meat",
    "মাংস",
  ],

  "dim-dudh": [
    "dim-dudh",
    "egg-milk",
    "egg",
    "eggs",
    "milk",
    "dairy",
    "ডিম",
    "দুধ",
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

export async function getCategoryProducts(
  slug: string
): Promise<Product[]> {
  const categoryValues = aliases[slug];

  if (!categoryValues) {
    return [];
  }

  // Reuse the same product dataset used by Home.
  // This avoids unnecessary extra API requests.
  const allProducts = await getProducts();

  const allowed = new Set(
    categoryValues.map((value) =>
      value.toLowerCase()
    )
  );

  return allProducts.filter((product) =>
    allowed.has(
      product.category.trim().toLowerCase()
    )
  );
}
