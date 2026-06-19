import "@shopify/shopify-api/adapters/web-api";
import {
  shopifyApi,
  LATEST_API_VERSION,
  LogSeverity,
} from "@shopify/shopify-api";

function getHostName() {
  const hostCandidates = [
    process.env.HOST,
    process.env.SHOPIFY_APP_URL,
    process.env.APP_URL,
  ].filter(Boolean) as string[];

  for (const value of hostCandidates) {
    try {
      const url = value.startsWith("http") ? new URL(value) : new URL(`https://${value}`);
      if (url.hostname) return url.hostname;
    } catch {
      const normalized = value.replace(/https?:\/\//, "").split("/")[0];
      if (normalized) return normalized;
    }
  }

  return "localhost";
}

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || "",
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  scopes:
    process.env.SCOPES?.split(",") ||
    process.env.SHOPIFY_API_SCOPES?.split(",") ||
    ["write_products"],
  hostName: getHostName(),
  hostScheme: "https",
  isEmbeddedApp: true,
  apiVersion: LATEST_API_VERSION,
  logger: {
    level:
      process.env.NODE_ENV === "development"
        ? LogSeverity.Debug
        : LogSeverity.Error,
  },
});

export default shopify;
