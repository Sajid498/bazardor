
export type MarketPrice = {
  market: string;
  division: string;
  min: number;
  max: number;
};

export type ProductDetails = {
  id: string;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number | null;
  lastWeek: number | null;
  lastMonth: number | null;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: MarketPrice[];
};

const API_BASE_URLS = [
  "https://api.abcz.workers.dev/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
];

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const converted = value
      .replace(/[০-৯]/g, (digit) =>
        String("০১২৩৪৫৬৭৮৯".indexOf(digit))
      )
      .replace(/,/g, "");

    const number = Number(converted);

    return Number.isFinite(number) ? number : null;
  }

  return null;
}

function getString(
  value: unknown,
  fallback = ""
): string {
  if (typeof value === "string") return value;

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function normalizeMarket(raw: unknown): MarketPrice | null {
  if (!isObject(raw)) return null;

  const min = getNumber(raw.min);
  const max = getNumber(raw.max);

  if (
    min === null ||
    max === null ||
    min < 0 ||
    max < min
  ) {
    return null;
  }

  return {
    market: getString(raw.market, "অজানা বাজার"),
    division: getString(raw.division, "অজানা বিভাগ"),
    min,
    max,
  };
}

function normalizeProductDetails(
  response: unknown
): ProductDetails {
  let raw: unknown = response;

  // Support both direct JSON and wrapped JSON responses.
  if (isObject(raw) && isObject(raw.data)) {
    raw = raw.data;
  }

  if (isObject(raw) && isObject(raw.product)) {
    raw = raw.product;
  }

  if (!isObject(raw)) {
    throw new Error("Invalid product data format.");
  }

  const today = getNumber(raw.today);
  const nameBn = getString(raw.nameBn);

  if (!nameBn || today === null) {
    throw new Error(
      "Product name or today's price is missing."
    );
  }

  const markets = Array.isArray(raw.markets)
    ? raw.markets
        .map(normalizeMarket)
        .filter(
          (market): market is MarketPrice =>
            market !== null
        )
    : [];

  const change = isObject(raw.change)
    ? raw.change
    : {};

  const dirValue = getString(change.dir);

  const dir: "up" | "down" | "flat" =
    dirValue === "up" || dirValue === "down"
      ? dirValue
      : "flat";

  return {
    id: getString(raw.id),
    slug: getString(raw.slug),
    nameBn,
    category: getString(raw.category),
    categoryNameBn: getString(
      raw.categoryNameBn,
      "অন্যান্য"
    ),
    categoryIcon: getString(
      raw.categoryIcon,
      "🛒"
    ),
    unit: getString(raw.unit, "kg"),
    image: getString(raw.image, "🛒"),
    today,
    yesterday: getNumber(raw.yesterday),
    lastWeek: getNumber(raw.lastWeek),
    lastMonth: getNumber(raw.lastMonth),
    change: {
      dir,
      pct: getNumber(change.pct) ?? 0,
    },
    markets,
  };
}

export async function getProductDetails(
  productIdOrSlug: string
): Promise<ProductDetails | null> {
  let notFoundCount = 0;
  let lastError: Error | null = null;

  for (const baseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(
        `${baseUrl}/products/${encodeURIComponent(
          productIdOrSlug
        )}`,
        {
          next: {
            revalidate: 300,
          },
          signal: AbortSignal.timeout(10000),
        }
      );

      if (response.status === 404) {
        notFoundCount++;
        continue;
      }

      if (response.status === 429) {
        lastError = new Error(
          "Product API is temporarily rate limited."
        );
        continue;
      }

      if (!response.ok) {
        lastError = new Error(
          `Product API returned ${response.status}`
        );
        continue;
      }

      const data: unknown = await response.json();

      return normalizeProductDetails(data);
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("Network error");
    }
  }

  if (notFoundCount === API_BASE_URLS.length) {
    return null;
  }

  // Do not mistake an API outage for a missing product.
  throw (
    lastError ||
    new Error("Unable to load product details.")
  );
}

export function formatBn(
  value: number,
  fractionDigits = 0
): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatPrice(
  value: number | null
): string {
  if (value === null) return "তথ্য নেই";

  return `${formatBn(value, 2)} টাকা`;
}

export function formatProductUnit(unit: string): string {
  const unitNames: Record<string, string> = {
    kg: "কেজি",
    g: "গ্রাম",
    litre: "লিটার",
    liter: "লিটার",
    l: "লিটার",
    dozen: "ডজন",
    pcs: "পিস",
    piece: "পিস",
  };

  return `প্রতি ${
    unitNames[unit.toLowerCase()] || unit
  }`;
}

export function getMarketSummary(
  markets: MarketPrice[]
) {
  if (markets.length === 0) {
    return {
      minimum: null,
      maximum: null,
      estimatedAverage: null,
    };
  }

  const minimum = Math.min(
    ...markets.map((market) => market.min)
  );

  const maximum = Math.max(
    ...markets.map((market) => market.max)
  );

  // Each market provides a price range, not a
  // single average. Use its midpoint as an estimate.
  const estimatedAverage =
    markets.reduce(
      (total, market) =>
        total + (market.min + market.max) / 2,
      0
    ) / markets.length;

  return {
    minimum,
    maximum,
    estimatedAverage,
  };
}
