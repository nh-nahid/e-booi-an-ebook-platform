import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import { startPayment } from "@/hooks/queries";
import { DEEP_LINK_PREFIX } from "./config";

/** Sends the shopper to the matching result screen after EPS redirects back. */
export function handlePaymentReturn(url: string) {
  const path = url.replace(DEEP_LINK_PREFIX, "");
  const [route, query = ""] = path.split("?");
  const orderId = new URLSearchParams(query).get("orderId") ?? "";
  if (route.startsWith("payment-success")) router.replace({ pathname: "/payment-success", params: { orderId } });
  else if (route.startsWith("payment-cancel")) router.replace({ pathname: "/payment-cancel", params: { orderId } });
  else router.replace({ pathname: "/payment-failed", params: { orderId } });
}

export async function payWithEps(orderId: string) {
  const gatewayURL = await startPayment(orderId);

  // Free order: the backend already completed it and sent us the deep link.
  if (gatewayURL.startsWith(DEEP_LINK_PREFIX)) {
    handlePaymentReturn(gatewayURL);
    return;
  }

  const result = await WebBrowser.openAuthSessionAsync(gatewayURL, DEEP_LINK_PREFIX);
  if (result.type === "success" && result.url) {
    handlePaymentReturn(result.url);
  } else {
    // Closed the browser without finishing: the order stays "pending" and
    // can be paid again from the order screen.
    router.replace({ pathname: "/payment-cancel", params: { orderId } });
  }
}
