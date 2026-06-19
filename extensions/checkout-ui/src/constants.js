const FALLBACK_STOREFRONT_URL =
  "https://commerce-nine-ecru-56.vercel.app/collections/all";

export const DEFAULT_CONTINUE_SHOPPING_URL =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_STOREFRONT_URL) ||
  FALLBACK_STOREFRONT_URL;

export function getContinueShoppingUrl() {
  const setting = shopify.settings.value.continue_shopping_url;
  if (typeof setting === "string" && setting.trim()) {
    return setting.trim();
  }

  return DEFAULT_CONTINUE_SHOPPING_URL;
}
