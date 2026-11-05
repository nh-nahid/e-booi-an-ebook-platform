const crypto = require("crypto");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const { hashToken } = require("../utils/token");
const setRefreshCookie = require("../utils/setRefreshCookie");

// Google sign-in.
//
//  Web : the browser gets a Google ID token (Google Identity Services button)
//        and POSTs it to /users/google.
//  App : the app opens /users/google/mobile in an in-app browser; Google sends
//        the shopper back to /users/google/callback, which redirects to
//        ebooi://google-auth?code=<one-time code>, and the app trades that code
//        for a normal session at /users/google/exchange.

const GOOGLE_TOKEN_INFO = "https://oauth2.googleapis.com/tokeninfo";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

const TEN_MINUTES = 10 * 60 * 1000;
const TWO_MINUTES = 2 * 60 * 1000;

// Short-lived, single-use values (single backend instance on Render).
const pendingStates = new Map(); // state -> expiresAt
const pendingCodes = new Map(); // one-time code -> { userId, expiresAt }

function sweep(map) {
  const now = Date.now();
  for (const [key, value] of map) {
    const expiresAt = typeof value === "number" ? value : value.expiresAt;
    if (expiresAt < now) map.delete(key);
  }
}

function clientId() {
  const id = process.env.GOOGLE_CLIENT_ID;
  if (!id) throw new Error("GOOGLE_CLIENT_ID is not set");
  return id;
}

function callbackUrl() {
  return `${(process.env.BACKEND_URL || "").replace(/\/+$/, "")}/api/v1/users/google/callback`;
}

// Verify an ID token with Google and return the trusted profile.
async function verifyIdToken(idToken) {
  const res = await fetch(`${GOOGLE_TOKEN_INFO}?id_token=${encodeURIComponent(idToken)}`);
  if (!res.ok) throw new Error("Invalid Google token");
  const info = await res.json();

  if (info.aud !== clientId()) throw new Error("Google token was issued for another app");
  if (!["accounts.google.com", "https://accounts.google.com"].includes(info.iss)) {
    throw new Error("Google token has the wrong issuer");
  }
  if (String(info.email_verified) !== "true" || !info.email) {
    throw new Error("Your Google email is not verified");
  }

  return {
    googleId: info.sub,
    email: String(info.email).toLowerCase(),
    name: info.name || String(info.email).split("@")[0],
    picture: info.picture || null,
  };
}

async function findOrCreateUser(profile) {
  let user = await User.findOne({ email: profile.email });

  if (!user) {
    // The schema requires a password; Google users get an unguessable one
    // (they can still use "forgot password" to set a real one).
    const randomPassword = crypto.randomBytes(32).toString("hex");
    user = await User.create({
      name: profile.name,
      email: profile.email,
      password: await bcrypt.hash(randomPassword, 10),
      avatar: profile.picture,
      googleId: profile.googleId,
    });
    return user;
  }

  if (!user.googleId) user.googleId = profile.googleId;
  if (!user.avatar && profile.picture) user.avatar = profile.picture;
  return user;
}

// Same response shape as the password login.
async function sendSession(req, res, user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = await hashToken(refreshToken);
  await user.save();

  setRefreshCookie(res, refreshToken);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    ...(req.get("x-client") === "mobile" ? { refreshToken } : {}),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
}

function suspended(res) {
  return res.status(403).json({ message: "Your account is suspended" });
}

// POST /users/google  { credential }
async function googleLogin(req, res, next) {
  try {
    const credential = req.body?.credential;
    if (!credential) return res.status(400).json({ message: "Google credential is required" });

    let profile;
    try {
      profile = await verifyIdToken(credential);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }

    const user = await findOrCreateUser(profile);
    if (user.status === "suspended") return suspended(res);

    return await sendSession(req, res, user);
  } catch (error) {
    next(error);
  }
}

// GET /users/google/mobile  -> sends the in-app browser to Google
function googleMobileStart(req, res, next) {
  try {
    sweep(pendingStates);
    const state = crypto.randomBytes(16).toString("hex");
    pendingStates.set(state, Date.now() + TEN_MINUTES);

    const params = new URLSearchParams({
      client_id: clientId(),
      redirect_uri: callbackUrl(),
      response_type: "code",
      scope: "openid email profile",
      state,
      prompt: "select_account",
    });
    return res.redirect(`${GOOGLE_AUTH_URL}?${params}`);
  } catch (error) {
    next(error);
  }
}

// GET /users/google/callback  (Google -> backend -> app deep link)
async function googleCallback(req, res) {
  const back = (query) => res.redirect(`ebooi://google-auth?${new URLSearchParams(query)}`);

  try {
    sweep(pendingStates);
    const { code, state, error } = req.query;

    if (error) return back({ error: "cancelled" });
    if (!code || !state || !pendingStates.has(String(state))) {
      return back({ error: "invalid_state" });
    }
    pendingStates.delete(String(state)); // single use

    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId(),
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: callbackUrl(),
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokenRes.ok || !tokens.id_token) return back({ error: "token_failed" });

    const profile = await verifyIdToken(tokens.id_token);
    const user = await findOrCreateUser(profile);
    if (user.status === "suspended") return back({ error: "suspended" });
    await user.save();

    const oneTime = crypto.randomBytes(32).toString("hex");
    pendingCodes.set(oneTime, { userId: String(user._id), expiresAt: Date.now() + TWO_MINUTES });

    return back({ code: oneTime });
  } catch (err) {
    console.log("Google callback failed:", err.message);
    return back({ error: "failed" });
  }
}

// POST /users/google/exchange  { code }
async function googleExchange(req, res, next) {
  try {
    sweep(pendingCodes);
    const code = String(req.body?.code || "");
    const entry = pendingCodes.get(code);
    if (!entry) return res.status(400).json({ message: "Sign-in expired. Please try again." });
    pendingCodes.delete(code); // single use

    const user = await User.findById(entry.userId);
    if (!user) return res.status(400).json({ message: "Account not found" });
    if (user.status === "suspended") return suspended(res);

    return await sendSession(req, res, user);
  } catch (error) {
    next(error);
  }
}

module.exports = { googleLogin, googleMobileStart, googleCallback, googleExchange };
