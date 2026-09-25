import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthenticationApi } from "../app/server/api/AuthenticationApi.server";
import { action as login } from "../app/routes/login";
import { loader as home } from "../app/routes/home";

function fakeToken() {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return [
    encode({ alg: "none", typ: "JWT" }),
    encode({ sub: "42", name: "Maria", email: "maria@example.test", exp: Math.floor(Date.now() / 1000) + 3600 }),
    "signature-placeholder",
  ].join(".");
}

describe("fluxo local de login", () => {
  beforeEach(() => { process.env.SESSION_SECRET = "segredo-de-teste-longo-e-estavel"; });
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.SESSION_SECRET;
  });

  it("guarda o JWT no cookie e mostra o nome na rota protegida", async () => {
    vi.spyOn(AuthenticationApi, "login").mockResolvedValue(fakeToken());
    const request = new Request("http://localhost/login", {
      method: "POST",
      body: new URLSearchParams({ email: "maria@example.test", password: "senha" }),
    });

    const response = await login({ request } as Parameters<typeof login>[0]);
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/home");
    const cookie = response.headers.get("Set-Cookie")?.split(";")[0] ?? "";

    const homeData = await home({
      request: new Request("http://localhost/home", { headers: { Cookie: cookie } }),
    } as Parameters<typeof home>[0]);
    expect(homeData).toEqual({ name: "Maria" });
  });
});
