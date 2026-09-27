export function isMembroId(value: number) {
  return Number.isInteger(value) && value > 0 && value <= 2147483647;
}

export function parseMembroEmail(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") throw new Error("Informe o email do usuário.");
  const email = value.trim();
  if (!email || email.length > 320 || !/^[^\s@]+@[^\s@]+$/.test(email)) {
    throw new Error("Informe um email válido.");
  }
  return email;
}
