import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UserApi } from "../app/server/api/UserApi.server";
import { action as register } from "../app/routes/register";

function registerRequest() {
  return new Request("http://localhost/register", {
    method: "POST",
    body: new URLSearchParams({
      name: "Maria",
      email: "maria@example.test",
      password: "1",
    }),
  });
}

describe("cadastro", () => {
  beforeEach(() => {
    process.env.API_URL = "http://localhost:5100";
    process.env.SESSION_SECRET = "segredo-de-teste-longo-e-estavel";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.API_URL;
    delete process.env.SESSION_SECRET;
  });

  it("envia uma senha de um caractere à API e volta ao login após sucesso", async () => {
    const post = vi.spyOn(axios, "post").mockResolvedValue({
      data: { id: 42, name: "Maria", email: "maria@example.test", isActive: true },
    });

    const response = await register({ request: registerRequest() } as Parameters<typeof register>[0]);

    expect(post).toHaveBeenCalledWith("http://localhost:5100/api/users", {
      name: "Maria", email: "maria@example.test", password: "1",
    }, {});
    expect(response).toBeInstanceOf(Response);
    expect((response as Response).status).toBe(302);
    expect((response as Response).headers.get("Location")).toBe("/login?registered=1");
  });

  it("mantém o formulário e apresenta a mensagem de email duplicado", async () => {
    vi.spyOn(UserApi, "create").mockRejectedValue({
      isAxiosError: true,
      response: { status: 409, data: { message: "Este email já está cadastrado." } },
    });

    const response = await register({ request: registerRequest() } as Parameters<typeof register>[0]);

    expect(response).toMatchObject({
      init: { status: 409 },
      data: {
        error: "Este email já está cadastrado.",
        values: { name: "Maria", email: "maria@example.test" },
      },
    });
  });

  it("apresenta as mensagens de validação devolvidas pela API", async () => {
    vi.spyOn(UserApi, "create").mockRejectedValue({
      isAxiosError: true,
      response: { status: 400, data: { errors: { Email: ["O email é inválido."] } } },
    });

    const response = await register({ request: registerRequest() } as Parameters<typeof register>[0]);

    expect(response).toMatchObject({
      init: { status: 400 },
      data: { error: "O email é inválido." },
    });
  });
});
