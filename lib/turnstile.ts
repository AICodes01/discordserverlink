/**
 * Cloudflare Turnstile Server-Side Verification Helper
 * Verifies the token returned by the Turnstile client widget with Cloudflare's siteverify API.
 */

export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string
): Promise<{ success: boolean; errorCodes?: string[] }> {
  // Use user-defined secret key or production Turnstile secret
  const secretKey =
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
    "0x4AAAAAACFrWTF-THuaCOhsNs4Yu4MVink";

  if (!token) {
    return { success: false, errorCodes: ["missing-input-response"] };
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
