import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UserApi } from "../app/server/api/UserApi.server";
import { loader as people } from "../app/routes/people";
import { SessionService } from "../app/server/service/SessionService.server";

function fakeToken() {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return [
    encode({ alg: "none", typ: "JWT" }),
    encode({ sub: "42", name: "Maria", email: "maria@example.test", exp: Math.floor(Date.now() / 1000) + 3600 }),
    "signature-placeholder",
  ].join(".");
}

async function authenticatedRequest() {
  const session = await SessionService.fromToken(fakeToken());
  const cookie = (await session.commit()).split(";")[0];
  return new Request("http://localhost/people", { headers: { Cookie: cookie } });
}

describe("listagem de pessoas", () => {
  beforeEach(() => {
    process.env.API_URL = "http://localhost:5100";
    process.env.SESSION_SECRET = "segredo-de-teste-longo-e-estavel";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.API_URL;
    delete process.env.SESSION_SECRET;
  });

  it("exige login antes de buscar usuários", async () => {
    const list = vi.spyOn(UserApi, "list");
    const response = await people({
      request: new Request("http://localhost/people"),
    } as Parameters<typeof people>[0]);
    expect(response).toBeInstanceOf(Response);
    expect((response as Response).headers.get("Location")).toBe("/login");
    expect(list).not.toHaveBeenCalled();
  });

  it("envia o JWT no endpoint de listagem e devolve todos os usuários", async () => {
    const users = [{ id: 1, name: "Maria", email: "maria@example.test", isActive: true }];
    const get = vi.spyOn(axios, "get").mockResolvedValue({ data: users });
    const response = await people({
      request: await authenticatedRequest(),
    } as Parameters<typeof people>[0]);
    expect(get).toHaveBeenCalledWith("http://localhost:5100/api/users", expect.objectContaining({
      headers: { Authorization: expect.stringMatching(/^Bearer /) },
    }));
    expect(response).toEqual({ users, error: null });
  });

  it("remove a sessão se a API recusar o token", async () => {
    vi.spyOn(UserApi, "list").mockRejectedValue({
      isAxiosError: true,
      response: { status: 401, data: { message: "Não autorizado." } },
    });
    const response = await people({
      request: await authenticatedRequest(),
    } as Parameters<typeof people>[0]);
    expect(response).toBeInstanceOf(Response);
    expect((response as Response).headers.get("Location")).toBe("/login");
    expect((response as Response).headers.get("Set-Cookie")).toContain("__session=");
  });
});