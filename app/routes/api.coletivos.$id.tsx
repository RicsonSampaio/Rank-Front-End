import { data, redirect } from "react-router";
import type { Route } from "./+types/api.coletivos.$id";
import { SessionService } from "@service/SessionService.server";
import { ColetivoService } from "@service/ColetivoService.server";

function isColetivoId(id: number) {
  return Number.isInteger(id) && id > 0 && id <= 2147483647;
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");
  const id = Number(params.id);
  if (!isColetivoId(id)) return data({ coletivo: null, error: "Coletivo inválido." }, { status: 400 });
  const result = await ColetivoService.getById(id, session.getToken());
  if (!result.success) {
    if (result.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
    return data({ coletivo: null, error: result.message }, { status: result.status });
  }
  return data({ coletivo: result.coletivo, error: null });
}

export async function action({ request, params }: Route.ActionArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");
  const id = Number(params.id);
  const form = await request.formData();
  const requestId = String(form.get("requestId") ?? "");
  const intent = String(form.get("intent") ?? "");
  const fail = (message: string, status = 400) => data({ success: false, message, requestId }, { status });
  if (!isColetivoId(id)) return fail("Coletivo inválido.");
  if (intent !== "update" && intent !== "delete") return fail("Ação inválida.");

  if (intent === "delete") {
    const result = await ColetivoService.delete(id, session.getToken());
    if (!result.success) {
      if (result.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
      return fail(result.message, result.status);
    }
    return redirect("/home");
  }

  const nome = String(form.get("nome") ?? "").trim();
  const logo = String(form.get("logo") ?? "").trim();
  const idTipoColetivo = Number(form.get("idTipoColetivo"));
  if (!nome || nome.length > 150) return fail("O nome deve ter entre 1 e 150 caracteres.");
  if (!Number.isInteger(idTipoColetivo) || idTipoColetivo < 1 || idTipoColetivo > 5) {
    return fail("Selecione um tipo de coletivo válido.");
  }
  if (logo.length > 2048) return fail("A URL da logo deve ter no máximo 2048 caracteres.");

  const result = await ColetivoService.update(id, { nome, logo: logo || null, idTipoColetivo }, session.getToken());
  if (!result.success) {
    if (result.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
    return fail(result.message, result.status);
  }
  return data({ success: true, message: "Coletivo atualizado com sucesso.", requestId });
}
