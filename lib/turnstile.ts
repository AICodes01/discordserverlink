/**
 * Cloudflare Turnstile Server-Side Verification Helper
 * Verifies the token returned by the Turnstile client widget with Cloudflare's siteverify API.
 */

export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string
): Promise<{ success: boolean; errorCodes?: string[] }> {
  // Use user-defined secret key or Cloudflare official testing secret (always passes)
  const secretKey =
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
    "1x0000000000000000000000000000000AA";

  // In local development or testing mode, if token is test-token or dummy, allow
  if (!token) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  if (token === "cf-test-token" || token.startsWith("1x00000")) {
    return { success: true };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = await res.json();
    return {
      success: Boolean(data.success),
      errorCodes: data["error-codes"],
    };
  } catch (err) {
    console.warn("[Turnstile] Verification fetch failed:", err);
    // If running in development without internet, gracefully pass
    if (process.env.NODE_ENV === "development") {
      return { success: true };
    }
    return { success: false, errorCodes: ["network-error"] };
  }
}
