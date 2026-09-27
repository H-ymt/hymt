import type { FormFields } from "./validate-form";

// wrangler.jsonc の send_email の allowed_sender_addresses / allowed_destination_addresses と揃える
const FROM_ADDRESS = "noreply@h-ymt.dev";
const TO_ADDRESS = "y.handai1272@gmail.com";
const SENDER_NAME = "h-ymt.dev";

export type SendResult = { ok: true } | { ok: false; code: string };

export async function sendContactEmail(
  sender: SendEmailBinding,
  data: FormFields,
): Promise<SendResult> {
  try {
    await sender.send({
      from: { email: FROM_ADDRESS, name: SENDER_NAME },
      to: TO_ADDRESS,
      replyTo: data.email,
      subject: `[${SENDER_NAME}] お問い合わせ: ${data.name}`,
      text: `${data.message}\n\n---\nName: ${data.name}\nEmail: ${data.email}`,
    });
    return { ok: true };
  } catch (error) {
    const code = (error as { code?: unknown }).code;
    return { ok: false, code: typeof code === "string" ? code : "UNKNOWN" };
  }
}
