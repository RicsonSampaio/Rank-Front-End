import type { Route } from "./+types/home";
import { data, redirect } from "react-router";
import { HomePage } from "@pages/HomePage";
import { SessionService } from "@service/SessionService.server";
import { ColetivoService } from "@service/ColetivoService.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");

  const result = await ColetivoService.list(session.getToken());
  if (!result.success) {
    if (result.status === 401) {
      return redirect("/login", {
        headers: { "Set-Cookie": await session.destroy() },
      });
    }
    return { coletivos: [], error: result.message, admin: session.isAdmin() };
  }

  return { coletivos: result.coletivos, error: null, admin: session.isAdmin() };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");

  const form = await request.formData();
  const requestId = String(form.get("requestId") ?? "");
  const nome = String(form.get("nome") ?? "").trim();
  const logo = String(form.get("logo") ?? "").trim();
  const idTipoColetivo = Number(form.get("idTipoColetivo"));
  const fail = (message: string, status = 400) =>
    data({ success: false, message, requestId }, { status });

  if (!nome || nome.length > 150) return fail("O nome deve ter entre 1 e 150 caracteres.");
  if (!Number.isInteger(idTipoColetivo) || idTipoColetivo < 1 || idTipoColetivo > 5) {
    return fail("Selecione um tipo de coletivo válido.");
  }
  if (logo.length > 2048) return fail("A URL da logo deve ter no máximo 2048 caracteres.");

  const result = await ColetivoService.create({ nome, idTipoColetivo, logo: logo || null }, session.getToken());
  if (!result.success) {
    if (result.status === 401) {
      return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
    }
    return fail(result.message, result.status);
  }

  return data({ success: true, message: "Coletivo criado com sucesso.", requestId });
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return <HomePage coletivos={loaderData.coletivos} error={loaderData.error} admin={loaderData.admin} />;
}