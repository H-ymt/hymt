import type { APIRoute } from "astro";
import { sendContactEmail } from "../../lib/contact/send-contact-email";
import { validateForm } from "../../lib/contact/validate-form";
import { getEmailSender, getTurnstileSecretKey } from "../../lib/utils/cloudflare";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  const token = String(formData.get("cf-turnstile-response") ?? "");
  const secretKey = getTurnstileSecretKey();
  if (!secretKey) {
    return new Response(
      JSON.stringify({ success: false, error: "CAPTCHA service is not configured." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
  const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: secretKey, response: token }),
  });
  const verifyData = (await verifyRes.json()) as { success: boolean };
  if (!verifyData.success) {
    return new Response(
      JSON.stringify({ success: false, error: "CAPTCHA verification failed. Please try again." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const result = validateForm(raw);
  if (!result.valid) {
    return new Response(JSON.stringify({ success: false, error: result.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sender = getEmailSender();
  if (!sender) {
    return new Response(
      JSON.stringify({ success: false, error: "Mail service is not configured." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const sent = await sendContactEmail(sender, result.data);

  if (!sent.ok) {
    console.error(`Failed to send contact email: ${sent.code}`);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to send your message. Please try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
