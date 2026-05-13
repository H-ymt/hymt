import type { APIRoute } from "astro";
import { Resend } from "resend";
import { getResendApiKey } from "../../lib/utils/cloudflare";

interface FormFields {
  name: string;
  email: string;
  message: string;
}

function validateForm(
  data: Record<string, string>,
): { valid: true; data: FormFields } | { valid: false; error: string } {
  const { name, email, message } = data;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return { valid: false, error: "All fields are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  return { valid: true, data: { name: name.trim(), email: email.trim(), message: message.trim() } };
}

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
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

  const apiKey = getResendApiKey();
  if (!apiKey) {
    return new Response(
      JSON.stringify({ success: false, error: "Mail service is not configured." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "contact@h-ymt.dev",
    to: ["glanz.web.creative@gmail.com"],
    subject: `Contact from ${result.data.name}`,
    replyTo: result.data.email,
    text: `Name: ${result.data.name}\nEmail: ${result.data.email}\n\n${result.data.message}`,
  });

  if (error) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send your message. Please try again later." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
