"use client";

import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Badge,
  Box,
  TextField,
  Banner,
  List,
  Link,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";

const REDIRECT_THEME_ZIP =
  "https://github.com/Shopify/hydrogen-redirect-theme/archive/refs/heads/main.zip";

const FALLBACK_STOREFRONT_URL =
  "https://commerce-nine-ecru-56.vercel.app/collections/all";

const DEFAULT_STOREFRONT_URL =
  process.env.NEXT_PUBLIC_STOREFRONT_URL || FALLBACK_STOREFRONT_URL;

function getHostname(url: string) {
  try {
    return new URL(url.trim()).hostname;
  } catch {
    try {
      return new URL(FALLBACK_STOREFRONT_URL).hostname;
    } catch {
      return "commerce-nine-ecru-56.vercel.app";
    }
  }
}

function getPathRedirect(url: string) {
  try {
    const parsed = new URL(url.trim());
    const path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    return path === "/" ? null : path;
  } catch {
    return "/collections/all";
  }
}

export default function Home() {
  const [storefrontUrl, setStorefrontUrl] = useState(DEFAULT_STOREFRONT_URL);
  const [storeHandle, setStoreHandle] = useState<string | null>(null);

  const hostname = getHostname(storefrontUrl);
  const pathRedirect = getPathRedirect(storefrontUrl);

  const loadShop = useCallback(async () => {
    try {
      const res = await fetch("shopify:admin/api/graphql.json", {
        method: "POST",
        body: JSON.stringify({
          query: `query { shop { myshopifyDomain } }`,
        }),
      });
      const { data } = await res.json();
      setStoreHandle(
        data.shop.myshopifyDomain.replace(".myshopify.com", ""),
      );
    } catch (error) {
      console.error("Failed to load shop:", error);
    }
  }, []);

  useEffect(() => {
    loadShop();
  }, [loadShop]);

  const openCheckoutEditor = async () => {
    try {
      const res = await fetch("shopify:admin/api/graphql.json", {
        method: "POST",
        body: JSON.stringify({
          query: `
            query {
              shop { myshopifyDomain }
              checkoutProfiles(first: 1) {
                nodes { id }
              }
            }
          `,
        }),
      });

      const { data } = await res.json();
      const handle = data.shop.myshopifyDomain.replace(".myshopify.com", "");
      const profileId = data.checkoutProfiles.nodes[0].id.split("/").pop();
      const extensionId = process.env.NEXT_PUBLIC_CHECKOUT_EXTENSION_ID;

      window.open(
        `https://admin.shopify.com/store/${handle}` +
          `/settings/checkout/editor/profiles/${profileId}` +
          `?page=checkout&config_panel_extension=${extensionId}`,
        "_top",
      );
    } catch (error) {
      console.error("Failed to open checkout editor:", error);
    }
  };

  const openThemesAdmin = () => {
    if (!storeHandle) return;
    window.open(
      `https://admin.shopify.com/store/${storeHandle}/themes`,
      "_top",
    );
  };

  return (
    <Page
      title="Checkout Customizer"
      subtitle="Send Continue shopping to your headless storefront"
    >
      <BlockStack gap="500">
        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingLg">
              Continue shopping → your Next.js store
            </Text>

            <Text as="p" variant="bodyMd">
              Shopify does not let you edit the built-in Thank you button URL
              directly. Use Shopify&apos;s{" "}
              <strong>Hydrogen redirect theme</strong> so the native button
              sends customers to your headless storefront.
            </Text>

            <InlineStack gap="200">
              <Badge tone="success">Recommended</Badge>
              <Badge tone="info">No checkout block needed</Badge>
            </InlineStack>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Your storefront URL
            </Text>

            <TextField
              label="Next.js storefront URL"
              value={storefrontUrl}
              onChange={setStorefrontUrl}
              autoComplete="off"
              helpText="Used below to generate redirect theme settings for you."
            />

            <Banner tone="info">
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd">
                  <strong>Theme settings → Hostname:</strong> {hostname}
                </Text>
                {pathRedirect ? (
                  <Text as="p" variant="bodyMd">
                    <strong>Theme settings → Custom redirects:</strong>
                    <br />
                    <code>{`/>${pathRedirect}`}</code>
                  </Text>
                ) : (
                  <Text as="p" variant="bodyMd">
                    Leave <strong>Custom redirects</strong> empty (storefront
                    homepage).
                  </Text>
                )}
              </BlockStack>
            </Banner>

            <Box>
              <InlineStack gap="200">
                <Button
                  variant="primary"
                  url={REDIRECT_THEME_ZIP}
                  external
                >
                  Download redirect theme
                </Button>
                <Button onClick={openThemesAdmin} disabled={!storeHandle}>
                  Open Themes in Admin
                </Button>
              </InlineStack>
            </Box>
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              Checkout header extension
            </Text>

            <Text as="p" variant="bodyMd">
              Separately, configure the checkout header logo extension in the
              checkout editor.
            </Text>

            <Box>
              <Button onClick={openCheckoutEditor}>
                Configure checkout header
              </Button>
            </Box>
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              Setup steps
            </Text>

            <List type="number">
              <List.Item>
                Click <strong>Download redirect theme</strong> above (ZIP from
                Shopify GitHub).
              </List.Item>
              <List.Item>
                In Shopify Admin go to{" "}
                <strong>Online Store → Themes → Add theme → Upload zip</strong>{" "}
                (or use <strong>Open Themes in Admin</strong>).
              </List.Item>
              <List.Item>
                On the uploaded theme, click <strong>Customize</strong>.
              </List.Item>
              <List.Item>
                Go to <strong>Theme settings → Storefront</strong>.
              </List.Item>
              <List.Item>
                Set <strong>Hostname</strong> to:{" "}
                <code>{hostname}</code> (no https://).
              </List.Item>
              {pathRedirect ? (
                <List.Item>
                  In <strong>Custom redirects</strong>, add one line:{" "}
                  <code>{`/>${pathRedirect}`}</code>
                </List.Item>
              ) : null}
              <List.Item>
                Click <strong>Save</strong>, then <strong>Publish</strong> the
                redirect theme.
              </List.Item>
              <List.Item>
                Complete a test order. Click the built-in{" "}
                <strong>Continue shopping</strong> button — you should land on{" "}
                <Link url={storefrontUrl} target="_blank">
                  your storefront
                </Link>
                .
              </List.Item>
            </List>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              How it works
            </Text>

            <Text as="p" variant="bodyMd">
              Customer clicks the native <strong>Continue shopping</strong> on
              the Thank you page → goes to your{" "}
              <code>.myshopify.com</code> store → redirect theme immediately
              sends them to <code>{hostname}</code>
              {pathRedirect ? pathRedirect : ""}. No extra checkout block.
            </Text>
          </BlockStack>
        </Card>

    
      </BlockStack>
    </Page>
  );
}
