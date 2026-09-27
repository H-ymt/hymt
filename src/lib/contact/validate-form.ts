export interface FormFields {
  name: string;
  email: string;
  message: string;
}

export function validateForm(
  data: Record<string, string>,
): { valid: true; data: FormFields } | { valid: false; error: string } {
  const { name, email, message } = data;

  const trimmed = {
    name: name?.trim() ?? "",
    email: email?.trim() ?? "",
    message: message?.trim() ?? "",
  };

  if (!trimmed.name || !trimmed.email || !trimmed.message) {
    return { valid: false, error: "All fields are required." };
  }

  if (trimmed.name.length > 100) {
    return { valid: false, error: "Name must be 100 characters or fewer." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  if (trimmed.email.length > 254) {
    return { valid: false, error: "Email must be 254 characters or fewer." };
  }

  if (trimmed.message.length > 2000) {
    return { valid: false, error: "Message must be 2000 characters or fewer." };
  }

  return { valid: true, data: trimmed };
}
