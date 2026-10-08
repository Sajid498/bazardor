
export type Product = {
  id: string;
  name: string;
  emoji: string;
  category: string;
  unit: string;
  price: number | null;
  changePercent: number | null;
};

// Assignment's official API URLs.
// Alternative first because primary returned 429.
const API_URLS = [
  "https://api.abcz.workers.dev/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
];

const CACHE_DURATION_MS = 10 * 60 * 1000;
const STALE_IF_ERROR_MS = 60 * 60 * 1000;
const RATE_LIMIT_WAIT_MS = 3 * 60 * 1000;
const FAILURE_WAIT_MS = 60 * 1000;

let cached: {
  products: Product[];
  savedAt: number;
} | null = null;

let inFlight: Promise<Product[]> | null = null;
let failureUntil = 0;

const rateLimitedUntil = new Map<string, number>();

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

  for (const key of path.split(".")) {
    if (!isObject(value)) return undefined;
    value = value[key];
  }

  return value;
}

function firstText(
  object: JsonObject,
  paths: string[]
): string {
  for (const path of paths) {
    const value = getPath(object, path);

    if (typeof value === "string" && value.trim()) {
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

const bengaliDigits = "০১২৩৪৫৬৭৮৯";

export function parseNumber(
  value: unknown
): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") return null;

  const normalized = value
    .replace(
      /[০-৯]/g,
      (digit) => String(bengaliDigits.indexOf(digit))
    )
    .replace(/,/g, "")
    .replace(/−/g, "-")
    .replace(/[^0-9.+-]/g, "");

  const result = Number.parseFloat(normalized);

  if (!Number.isFinite(result)) return null;

  if (value.includes("▼") || value.includes("↓")) {
    return -Math.abs(result);
  }

  if (value.includes("▲") || value.includes("↑")) {
    return Math.abs(result);
  }

  return result;
}

function firstNumber(
  object: JsonObject,
  paths: string[]
): number | null {
  for (const path of paths) {
    const number = parseNumber(
      getPath(object, path)
    );

    if (number !== null) return number;
  }

  return null;
}

function findProducts(response: unknown): unknown[] {
  if (Array.isArray(response)) return response;

  if (!isObject(response)) return [];

  for (const key of [
    "products",
    "data",
    "items",
    "results",
  ]) {
    const nested = response[key];

    if (Array.isArray(nested)) return nested;

    if (isObject(nested)) {
      const found = findProducts(nested);

      if (found.length) return found;
    }
  }

  return [];
}

function normalizeProduct(
  raw: unknown,
  index: number
): Product | null {
  if (!isObject(raw)) return null;

  const name = firstText(raw, [
    "name_bn",
    "nameBn",
    "name.bn",
    "name.bangla",
    "name",
    "product_name",
    "productName",
    "title",
  ]);

  if (!name) return null;

  const id =
    firstText(raw, [
      "id",
      "_id",
      "productId",
      "product_id",
      "slug",
    ]) || String(index + 1);

  const category =
    firstText(raw, [
      "category.slug",
      "category.id",
      "category.name_bn",
      "category.name",
      "category",
      "category_slug",
      "categorySlug",
    ]) || "other";

  const unit =
    firstText(raw, [
      "unit_bn",
      "unitBn",
      "unit",
      "measurementUnit",
      "measurement_unit",
    ]) || "কেজি";

  const emoji =
    firstText(raw, [
      "emoji",
      "icon",
      "thumbnailEmoji",
      "thumbnail_emoji",
    ]) || "🛒";

  const price = firstNumber(raw, [
    "today_price",
    "todayPrice",
    "current_price",
    "currentPrice",
    "avg_price",
    "avgPrice",
    "average_price",
    "averagePrice",
    "price.today",
    "price.current",
    "price",
    "prices.today",
    "summary.average",
  ]);

  const previousPrice = firstNumber(raw, [
    "yesterday_price",
    "yesterdayPrice",
    "previous_price",
    "previousPrice",
    "old_price",
    "oldPrice",
  ]);

  let changePercent = firstNumber(raw, [
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
  ]);

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
  return findProducts(response)
    .map(normalizeProduct)
    .filter(
      (product): product is Product =>
        product !== null
    );
}

// Fetch from external BazarDor APIs.
async function loadFromExternalApi(): Promise<Product[]> {
  let lastError = "Product API unavailable";

  for (const baseUrl of API_URLS) {
    // Skip an API that recently returned 429.
    if (
      (rateLimitedUntil.get(baseUrl) ?? 0) >
      Date.now()
    ) {
      continue;
    }

    try {
      const fetchOptions = {
        next: { revalidate: 600 },
        signal: AbortSignal.timeout(10000),
      };

      const response = await fetch(
        `${baseUrl}/products`,
        fetchOptions
      );

      if (response.status === 429) {
        rateLimitedUntil.set(
          baseUrl,
          Date.now() + RATE_LIMIT_WAIT_MS
        );

        console.warn(
          `Product API rate limited (429): ${baseUrl}. Trying fallback.`
        );

        lastError = "Product API rate limit reached";
        continue;
      }

      if (!response.ok) {
        lastError = `Product API returned ${response.status}`;

        console.warn(`${lastError}: ${baseUrl}`);
        continue;
      }

      const json: unknown = await response.json();
      const products = normalizeProducts(json);

      if (
        products.length > 0 ||
        (Array.isArray(json) && json.length === 0)
      ) {
        return products;
      }

      lastError =
        "Product API data format is not recognized";

      console.warn(`${lastError}: ${baseUrl}`);
    } catch (error) {
      lastError =
        error instanceof Error
          ? error.message
          : "Network error";

      console.warn(
        `Product API unavailable (${baseUrl}): ${lastError}`
      );
    }
  }

  throw new Error(lastError);
}

// Cached product service.
export async function getProducts(): Promise<Product[]> {
  const now = Date.now();

  // 1. Return recently cached products.
  if (
    cached &&
    now - cached.savedAt < CACHE_DURATION_MS
  ) {
    return cached.products;
  }

  // 2. Reuse an existing pending request.
  if (inFlight) {
    return inFlight;
  }

  // 3. Avoid repeated requests during outages.
  if (now < failureUntil) {
    if (
      cached &&
      now - cached.savedAt < STALE_IF_ERROR_MS
    ) {
      return cached.products;
    }

    throw new Error(
      "Product API temporarily unavailable. Please try later."
    );
  }

  // 4. Fetch and save the successful response.
  inFlight = loadFromExternalApi()
    .then((products) => {
      cached = {
        products,
        savedAt: Date.now(),
      };

      failureUntil = 0;

      return products;
    })
    .catch((error: unknown) => {
      failureUntil = Date.now() + FAILURE_WAIT_MS;

      // Show previously fetched real data
      // during a temporary API outage.
      if (
        cached &&
        Date.now() - cached.savedAt <
          STALE_IF_ERROR_MS
      ) {
        console.warn(
          "Using previously fetched product data until API recovers."
        );

        return cached.products;
      }

      throw error;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

// Bengali number formatter.
export function formatBanglaNumber(
  value: number,
  maximumFractionDigits = 0
): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits,
  }).format(value);
}

// Bengali price formatter.
export function formatBanglaPrice(
  price: number | null
): string {
  if (price === null) {
    return "তথ্য নেই";
  }

  return `${formatBanglaNumber(price, 2)} টাকা`;
}

// Product unit formatter.
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

  return `প্রতি ${unitMap[unit.toLowerCase()] || unit}`;
}
