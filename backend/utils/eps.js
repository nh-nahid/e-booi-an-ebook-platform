// EPS (Easy Payment System) gateway client — https://www.eps.com.bd
//
// Auth model (from the EPS Merchant API Integration Guide V4):
//   x-hash = Base64( HMAC-SHA512( key = UTF8(EPS_HASH_KEY), msg = <value> ) )
//   - GetToken            -> value = userName
//   - InitializeEPS       -> value = merchantTransactionId  (+ Bearer token)
//   - CheckMerchantTransactionStatus -> value = merchantTransactionId (+ Bearer token)
//
// All credentials come from env vars so the same code runs against the
// sandbox and live — only EPS_BASE_URL and the credentials change.

const crypto = require("crypto");

const TOKEN_TTL_MS = 5 * 60 * 1000; // re-fetch well before the token expires

let cachedToken = { value: null, expiresAt: 0 };

function baseUrl() {
  return (process.env.EPS_BASE_URL || "https://sandboxpgapi.eps.com.bd").replace(
    /\/+$/,
    "",
  );
}

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

function makeHash(value) {
  return crypto
    .createHmac("sha512", Buffer.from(requireEnv("EPS_HASH_KEY"), "utf8"))
    .update(String(value), "utf8")
    .digest("base64");
}

// Case-insensitive property lookup — the API mixes camelCase and PascalCase.
function pick(obj, name) {
  if (!obj || typeof obj !== "object") return undefined;
  const key = Object.keys(obj).find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? obj[key] : undefined;
}

async function parseResponse(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { ErrorMessage: text };
  }
}

async function getToken(force = false) {
  if (!force && cachedToken.value && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const userName = requireEnv("EPS_USERNAME");
  const res = await fetch(`${baseUrl()}/v1/Auth/GetToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-hash": makeHash(userName) },
    body: JSON.stringify({ userName, password: requireEnv("EPS_PASSWORD") }),
  });
  const data = await parseResponse(res);
  const token = pick(data, "token");

  if (!res.ok || !token) {
    throw new Error(
      `EPS GetToken failed: ${pick(data, "errorMessage") || res.status}`,
    );
  }

  cachedToken = { value: token, expiresAt: Date.now() + TOKEN_TTL_MS };
  return token;
}

// Authenticated call. Retries once with a fresh token on 401.
async function authedRequest(path, { method, hashValue, body }) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const token = await getToken(attempt > 0);
    const res = await fetch(`${baseUrl()}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-hash": makeHash(hashValue),
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401 && attempt === 0) continue;
    return { res, data: await parseResponse(res) };
  }
}

// merchantTransactionId must be unique per attempt and >= 10 digits.
function generateMerchantTransactionId() {
  const rand = crypto.randomInt(100, 1000);
  return `${Date.now()}${rand}`;
}

async function initializePayment(payload) {
  const { res, data } = await authedRequest("/v1/EPSEngine/InitializeEPS", {
    method: "POST",
    hashValue: payload.merchantTransactionId,
    body: payload,
  });

  const redirectUrl = pick(data, "RedirectURL");
  if (!res.ok || !redirectUrl) {
    throw new Error(
      `EPS InitializeEPS failed: ${pick(data, "ErrorMessage") || pick(data, "ErrorCode") || res.status}`,
    );
  }
  return { redirectUrl, transactionId: pick(data, "TransactionId") };
}

async function checkTransactionStatus(merchantTransactionId) {
  const { res, data } = await authedRequest(
    `/v1/EPSEngine/CheckMerchantTransactionStatus?merchantTransactionId=${encodeURIComponent(merchantTransactionId)}`,
    { method: "GET", hashValue: merchantTransactionId },
  );
  if (!res.ok) {
    throw new Error(
      `EPS status check failed: ${pick(data, "ErrorMessage") || res.status}`,
    );
  }
  return data;
}

module.exports = {
  makeHash,
  pick,
  generateMerchantTransactionId,
  initializePayment,
  checkTransactionStatus,
};
