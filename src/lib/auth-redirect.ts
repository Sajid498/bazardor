
export function getSafeCallbackUrl(): string {
  if (typeof window === "undefined") {
    return "/";
  }

  const params = new URLSearchParams(
    window.location.search
  );

  const callbackUrl = params.get("callbackUrl");

  if (!callbackUrl) {
    return "/";
  }

  // Block external or unsafe redirect URLs.
  if (
    !callbackUrl.startsWith("/") ||
    callbackUrl.startsWith("//") ||
    callbackUrl.startsWith("/\\")
  ) {
    return "/";
  }

  try {
    const target = new URL(
      callbackUrl,
      window.location.origin
    );

    if (target.origin !== window.location.origin) {
      return "/";
    }

    return (
      target.pathname +
      target.search +
      target.hash
    );
  } catch {
    return "/";
  }
}

export function getAuthPageHref(
  page: "/signin" | "/signup"
): string {
  const callbackUrl = getSafeCallbackUrl();

  if (callbackUrl === "/") {
    return page;
  }

  return (
    `${page}?callbackUrl=` +
    encodeURIComponent(callbackUrl)
  );
}
