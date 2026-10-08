
export type Product = {
  id: string;
  name: string;
  emoji: string;
  category: string;
  unit: string;
  price: number | null;
  changePercent: number | null;
};

const API_URLS = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getPath(
  object: JsonObject,
  path: string
): unknown {
  let current: unknown = object;

  for (const key of path.split(".")) {
    if (!isObject(current)) return undefined;
    current = current[key];
  }

  return current;
}

function firstValue(
  object: JsonObject,
  paths: string[]
): unknown {
  for (const path of paths) {
    const value = getPath(object, path);

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return undefined;
}

function textValue(value: unknown): string {
  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  }

  return "";
}

const bengaliDigits = "০১২৩৪৫৬৭৮৯";

export function parseNumber(
  value: unknown
): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const converted = value
    .replace(/[০-৯]/g, (digit) =>
      String(bengaliDigits.indexOf(digit))
    )
    .replace(/,/g, "")
    .replace(/−/g, "-")
    .replace(/[^0-9.+-]/g, "");

  const result = Number.parseFloat(converted);

  if (!Number.isFinite(result)) {
    return null;
  }

  // Negative trend arrows should be preserved.
  if (value.includes("▼") || value.includes("↓")) {
    return -Math.abs(result);
  }

  if (value.includes("▲") || value.includes("↑")) {
    return Math.abs(result);
  }

  return result;
}

function findProducts(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (!isObject(data)) {
    return [];
  }

  for (const key of [
    "products",
    "data",
    "items",
    "results",
  ]) {
    const nested = data[key];

    if (Array.isArray(nested)) {
      return nested;
    }

    if (isObject(nested)) {
      const result = findProducts(nested);

      if (result.length > 0) {
        return result;
      }
    }
  }

  return [];
}

function normalizeProduct(
  raw: unknown,
  index: number
): Product | null {
  if (!isObject(raw)) return null;

  const name = textValue(
    firstValue(raw, [
      "name_bn",
      "nameBn",
      "name",
      "product_name",
      "productName",
      "title",
      "name.bn",
      "name.bangla",
    ])
  );

  if (!name) return null;

  const id = textValue(
    firstValue(raw, [
      "id",
      "_id",
      "productId",
      "product_id",
      "slug",
    ])
  ) || String(index + 1);

  const category = textValue(
    firstValue(raw, [
      "category.slug",
      "category.id",
      "category",
      "category_slug",
      "categorySlug",
    ])
  ) || "other";

  const unit = textValue(
    firstValue(raw, [
      "unit_bn",
      "unitBn",
      "unit",
      "measurementUnit",
      "measurement_unit",
    ])
  ) || "কেজি";

  const emoji = textValue(
    firstValue(raw, [
      "emoji",
      "icon",
      "thumbnailEmoji",
      "thumbnail_emoji",
    ])
  ) || "🛒";

  const price = parseNumber(
    firstValue(raw, [
      "today_price",
      "todayPrice",
      "current_price",
      "currentPrice",
      "avg_price",
      "avgPrice",
      "average_price",
      "averagePrice",
      "price",
      "price.today",
      "price.current",
      "prices.today",
      "summary.average",
    ])
  );

  const previousPrice = parseNumber(
    firstValue(raw, [
      "yesterday_price",
      "yesterdayPrice",
      "previous_price",
      "previousPrice",
      "old_price",
      "oldPrice",
    ])
  );

  let changePercent = parseNumber(
    firstValue(raw, [
      "change_percent",
      "changePercent",
      "change_percentage",
      "changePercentage",
      "change_pct",
      "changePct",
      "percentageChange",
      "percentChange",
      "price_change_percent",
      "priceChangePercent",
      "trend.percent",
      "trend.percentage",
      "change",
    ])
  );

  if (
    changePercent === null &&
    price !== null &&
    previousPrice !== null &&
    previousPrice > 0
  ) {
    changePercent =
      ((price - previousPrice) / previousPrice) * 100;
  }

  return {
    id,
    name,
    emoji,
    category,
    unit,
    price,
    changePercent,
  };
}

export function normalizeProducts(
  response: unknown
): Product[] {
  const rawProducts = findProducts(response);

  return rawProducts
    .map((item, index) =>
      normalizeProduct(item, index)
    )
    .filter(
      (product): product is Product =>
        product !== null
    );
}

export async function getProducts(): Promise<Product[]> {
  let lastError: unknown;

  for (const baseUrl of API_URLS) {
    try {
      const response = await fetch(
        `${baseUrl}/products`,
        {
          next: {
            revalidate: 300,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `API returned ${response.status}`
        );
      }

      const data: unknown = await response.json();
      const products = normalizeProducts(data);

      if (products.length === 0) {
        // An empty array is valid API data.
        if (
          Array.isArray(data) &&
          data.length === 0
        ) {
          return [];
        }

        throw new Error(
          "Product response format is not recognized."
        );
      }

      return products;
    } catch (error) {
      lastError = error;
      console.error(
        `BazarDor API request failed: ${baseUrl}`,
        error
      );
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Unable to load products.");
}

export function formatBanglaNumber(
  value: number,
  maximumFractionDigits = 0
): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits,
  }).format(value);
}

export function formatBanglaPrice(
  price: number | null
): string {
  if (price === null) {
    return "তথ্য নেই";
  }

  return `${formatBanglaNumber(price, 2)} টাকা`;
}

export function formatUnit(unit: string): string {
  if (unit.startsWith("প্রতি")) {
    return unit;
  }

  const unitMap: Record<string, string> = {
    kg: "কেজি",
    kilogram: "কেজি",
    litre: "লিটার",
    liter: "লিটার",
    l: "লিটার",
    dozen: "ডজন",
    pcs: "পিস",
    piece: "পিস",
  };

  const translated =
    unitMap[unit.toLowerCase()] || unit;

  return `প্রতি ${translated}`;
}
