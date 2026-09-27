import { describe, expect, it } from "vitest";
import { validateForm } from "./validate-form";

const valid = { name: "Taro", email: "taro@example.com", message: "Hello" };

describe("validateForm", () => {
  it("前後の空白を除いた値を返す", () => {
    const result = validateForm({
      name: " Taro ",
      email: " taro@example.com ",
      message: " Hello ",
    });
    expect(result).toEqual({ valid: true, data: valid });
  });

  it.each(["name", "email", "message"] as const)("%s が空ならエラー", (key) => {
    const result = validateForm({ ...valid, [key]: "  " });
    expect(result).toEqual({ valid: false, error: "All fields are required." });
  });

  it("name が 100 文字を超えるとエラー", () => {
    const result = validateForm({ ...valid, name: "a".repeat(101) });
    expect(result).toEqual({ valid: false, error: "Name must be 100 characters or fewer." });
  });

  it("不正なメールアドレスはエラー", () => {
    const result = validateForm({ ...valid, email: "not-an-email" });
    expect(result).toEqual({ valid: false, error: "Please enter a valid email address." });
  });

  it("email が 254 文字を超えるとエラー", () => {
    const result = validateForm({ ...valid, email: `${"a".repeat(250)}@example.com` });
    expect(result).toEqual({ valid: false, error: "Email must be 254 characters or fewer." });
  });

  it("message が 2000 文字を超えるとエラー", () => {
    const result = validateForm({ ...valid, message: "a".repeat(2001) });
    expect(result).toEqual({ valid: false, error: "Message must be 2000 characters or fewer." });
  });
});
