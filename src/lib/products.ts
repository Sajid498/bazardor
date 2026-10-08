
import { connection } from "next/server";

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
  "https://api.abcz.workers.dev/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
];

const CACHE_MS = 10 * 60 * 1000;
const STALE_MS = 60 * 60 * 1000;
const RATE_LIMIT_MS = 3 * 60 * 1000;
const ERROR_COOLDOWN_MS = 60 * 1000;

let cached: { items: Product[]; at: number } | null = null;
let pending: Promise<Product[]> | null = null;
let failureUntil = 0;

const blockedUntil = new Map<string, number>();

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
  let value: unknown = object;

  for (const part of path.split(".")) {
    if (!isObject(value)) return undefined;
    value = value[part];
  }

  return value;
}

function firstText(
  object: JsonObject,
  paths: string[]
): string {
  for (const path of paths) {
    const value = getPath(object, path);

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }

    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return String(value);
    }
  }

  return "";
}

export function parseNumber(
  value: unknown
): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") return null;

  const digits = "০১২৩৪৫৬৭৮৯";

  const normalized = value
    .replace(
      /[০-৯]/g,
      (digit) => String(digits.indexOf(digit))
    )
    .replace(/,/g, "")
    .replace(/−/g, "-")
    .replace(/[^0-9.+-]/g, "");

  const result = Number.parseFloat(normalized);

  if (!Number.isFinite(result)) return null;

  if (
    value.includes("▼") ||
    value.includes("↓")
  ) {
    return -Math.abs(result);
  }

  if (
    value.includes("▲") ||
    value.includes("↑")
  ) {
    return Math.abs(result);
  }

  return result;
}

function firstNumber(
  object: JsonObject,
  paths: string[]
): number | null {
  for (const path of paths) {
    const result = parseNumber(
      getPath(object, path)
    );

    if (result !== null) return result;
  }

  return null;
}

function findProductArray(
  value: unknown
): unknown[] | null {
  if (Array.isArray(value)) return value;

  if (!isObject(value)) return null;

  for (const field of [
    "products",
    "data",
    "items",
    "results",
  ]) {
    if (!(field in value)) continue;

    const found = findProductArray(value[field]);

    if (found !== null) return found;
  }

  return null;
}

function normalizeProduct(
  raw: unknown,
  index: number
): Product | null {
  if (!isObject(raw)) return null;

  // Actual API: nameBn
  const name = firstText(raw, [
    "nameBn",
    "name_bn",
    "name.bn",
    "name.bangla",
    "name",
    "productName",
    "product_name",
    "title",
  ]);

  if (!name) return null;

  // Actual API: id
  const id =
    firstText(raw, [
      "id",
      "_id",
      "productId",
      "product_id",
      "slug",
    ]) || String(index + 1);

  // Actual API: category
  const category =
    firstText(raw, [
      "category.slug",
      "category.id",
      "category.name",
      "category",
      "categorySlug",
      "category_slug",
    ]) || "other";

  // Actual API: unit
  const unit =
    firstText(raw, [
      "unit",
      "unitBn",
      "unit_bn",
      "measurementUnit",
      "measurement_unit",
    ]) || "kg";

  // Actual API: image contains an emoji.
  const icon = firstText(raw, [
    "image",
    "emoji",
    "categoryIcon",
    "icon",
    "thumbnailEmoji",
    "thumbnail_emoji",
  ]);

  const emoji =
    icon &&
    !/^https?:\/\//i.test(icon) &&
    icon.length <= 12
      ? icon
      : firstText(raw, [
          "categoryIcon",
          "emoji",
        ]) || "🛒";

  // Actual API uses "today" for today's price.
  const price = firstNumber(raw, [
    "today",
    "todayPrice",
    "today_price",
    "currentPrice",
    "current_price",
    "price.today",
    "price.current",
    "price",
    "avgPrice",
    "avg_price",
  ]);

  // Actual API uses "yesterday".
  const previousPrice = firstNumber(raw, [
    "yesterday",
    "yesterdayPrice",
    "yesterday_price",
    "previousPrice",
    "previous_price",
    "oldPrice",
    "old_price",
  ]);

  // Actual API uses change.pct.
  const rawPercent = firstNumber(raw, [
    "change.pct",
    "change.percent",
    "change.percentage",
    "changePercent",
    "change_percent",
    "changePercentage",
    "change_percentage",
    "percentageChange",
    "percentChange",
    "trend.percent",
    "trend.percentage",
    "change",
  ]);

  // Actual API uses change.dir: up/down/flat.
  const direction = firstText(raw, [
    "change.dir",
    "change.direction",
    "trend.dir",
    "direction",
  ]).toLowerCase();

  let changePercent: number | null = rawPercent;

  if (rawPercent !== null) {
    if (direction === "down") {
      changePercent = -Math.abs(rawPercent);
    } else if (direction === "up") {
      changePercent = Math.abs(rawPercent);
    } else if (
      direction === "flat" ||
      direction === "same"
    ) {
      changePercent = 0;
    }
  } else if (
    price !== null &&
    previousPrice !== null &&
    previousPrice > 0
  ) {
    // Fallback if API does not provide a percentage.
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
  const array = findProductArray(response);

  if (array === null) return [];

  return array
    .map((item, index) =>
      normalizeProduct(item, index)
    )
    .filter(
      (product): product is Product =>
        product !== null
    );
}

// External API fetching with rate-limit handling.
async function fetchFreshProducts(): Promise<Product[]> {
  let lastError = "Product API unavailable";

  for (const baseUrl of API_URLS) {
    if (
      (blockedUntil.get(baseUrl) ?? 0) >
      Date.now()
    ) {
      continue;
    }

    try {
      const response = await fetch(
        `${baseUrl}/products`,
        {
          next: {
            revalidate: 600,
          },
          signal: AbortSignal.timeout(10000),
        }
      );

      if (response.status === 429) {
        blockedUntil.set(
          baseUrl,
          Date.now() + RATE_LIMIT_MS
        );

        lastError = "Product API rate limited (429)";

        console.warn(
          `${lastError}: ${baseUrl}`
        );

        continue;
      }

      if (!response.ok) {
        lastError =
          `Product API status ${response.status}`;

        console.warn(
          `${lastError}: ${baseUrl}`
        );

        continue;
      }

      const json: unknown = await response.json();
      const array = findProductArray(json);
      const products = normalizeProducts(json);

      if (
        array !== null &&
        (
          array.length === 0 ||
          products.length > 0
        )
      ) {
        return products;
      }

      lastError =
        `Unexpected product response: ${baseUrl}`;
    } catch (error) {
      lastError =
        error instanceof Error
          ? error.message
          : "Network error";

      console.warn(
        `Product request failed: ${baseUrl} (${lastError})`
      );
    }
  }

  throw new Error(lastError);
}

// Shared and cached product service.
export async function getProducts(): Promise<Product[]> {
  // Required with cacheComponents in Next.js 16.
  await connection();

  const now = Date.now();

  // Return recently cached products.
  if (
    cached &&
    now - cached.at < CACHE_MS
  ) {
    return cached.items;
  }

  // Reuse an in-progress request.
  if (pending) return pending;

  // Avoid repeated requests during API outages.
  if (now < failureUntil) {
    if (
      cached &&
      now - cached.at < STALE_MS
    ) {
      return cached.items;
    }

    throw new Error(
      "Product API temporarily unavailable"
    );
  }

  pending = fetchFreshProducts()
    .then((items) => {
      cached = {
        items,
        at: Date.now(),
      };

      failureUntil = 0;

      return items;
    })
    .catch((error: unknown) => {
      failureUntil =
        Date.now() + ERROR_COOLDOWN_MS;

      // Reuse real, previously fetched data.
      if (
        cached &&
        Date.now() - cached.at < STALE_MS
      ) {
        console.warn(
          "Using previously fetched real product data."
        );

        return cached.items;
      }

      throw error;
    })
    .finally(() => {
      pending = null;
    });

  return pending;
}

// Bengali number formatting.
export function formatBanglaNumber(
  value: number,
  maximumFractionDigits = 0
): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits,
  }).format(value);
}

// Bengali price formatting.
export function formatBanglaPrice(
  price: number | null
): string {
  return price === null
    ? "তথ্য নেই"
    : `${formatBanglaNumber(price, 2)} টাকা`;
}

// Product unit formatting.
export function formatUnit(unit: string): string {
  if (unit.startsWith("প্রতি")) return unit;

  const units: Record<string, string> = {
    kg: "কেজি",
    kilogram: "কেজি",
    g: "গ্রাম",
    litre: "লিটার",
    liter: "লিটার",
    l: "লিটার",
    dozen: "ডজন",
    pcs: "পিস",
    piece: "পিস",
  };

  return `প্রতি ${
    units[unit.toLowerCase()] || unit
  }`;
}
