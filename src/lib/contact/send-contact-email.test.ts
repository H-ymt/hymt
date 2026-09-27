import { describe, expect, it, vi } from "vitest";
import { sendContactEmail } from "./send-contact-email";

const fields = { name: "Taro", email: "taro@example.com", message: "Hello" };

describe("sendContactEmail", () => {
  it("問い合わせ内容からメッセージを組み立てて送信する", async () => {
    const send = vi.fn().mockResolvedValue({ messageId: "msg-1" });

    const result = await sendContactEmail({ send }, fields);

    expect(send).toHaveBeenCalledWith({
      from: { email: "noreply@h-ymt.dev", name: "h-ymt.dev" },
      to: "y.handai1272@gmail.com",
      replyTo: "taro@example.com",
      subject: "[h-ymt.dev] お問い合わせ: Taro",
      text: "Hello\n\n---\nName: Taro\nEmail: taro@example.com",
    });
    expect(result).toEqual({ ok: true });
  });

  it("binding がエラーを投げるとエラーコードを返す", async () => {
    const error = Object.assign(new Error("sender not verified"), {
      code: "E_SENDER_NOT_VERIFIED",
    });
    const send = vi.fn().mockRejectedValue(error);

    const result = await sendContactEmail({ send }, fields);

    expect(result).toEqual({ ok: false, code: "E_SENDER_NOT_VERIFIED" });
  });

  it("コードのないエラーは UNKNOWN として返す", async () => {
    const send = vi.fn().mockRejectedValue(new Error("boom"));

    const result = await sendContactEmail({ send }, fields);

    expect(result).toEqual({ ok: false, code: "UNKNOWN" });
  });
});
