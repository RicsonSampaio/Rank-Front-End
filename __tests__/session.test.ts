import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SessionService } from "../app/server/service/SessionService.server";

function tokenWithExpiry(exp: number) {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return [
    encode({ alg: "none", typ: "JWT" }),
    encode({
      sub: "42",
      name: "Maria",
      email: "maria@example.test",
      exp,
    }),
    "signature-placeholder",
  ].join(".");
}

describe("SessionService", () => {
  beforeEach(() => { process.env.SESSION_SECRET = "segredo-de-teste-longo-e-estavel"; });
  afterEach(() => { delete process.env.SESSION_SECRET; });

  it("recupera o usuário de um cookie válido", async () => {
    const token = tokenWithExpiry(Math.floor(Date.now() / 1000) + 60);
    const session = await SessionService.fromToken(token);
    const cookie = await session.commit();
    const restored = await SessionService.use(cookie);

    expect(restored.isValid()).toBe(true);
    expect(restored.getName()).toBe("Maria");
  });

  it("recusa um token expirado", async () => {
    const token = tokenWithExpiry(Math.floor(Date.now() / 1000) - 60);
    await expect(SessionService.fromToken(token)).rejects.toThrow("JWT sem dados válidos");
  });
});
