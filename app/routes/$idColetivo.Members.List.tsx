import { data, redirect } from "react-router";
import type { Route } from "./+types/$idColetivo.Members.List";
import { MembersListPage } from "@pages/MembersList";
import { SessionService } from "@service/SessionService.server";
import { MembroService } from "@service/MembroService.server";
import { isMembroId, parseMembroEmail } from "@common/membroForm.server";

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");
  const idColetivo = Number(params.idColetivo);
  if (!isMembroId(idColetivo)) return redirect("/home");
  const result = await MembroService.list(idColetivo, session.getToken());
  if (!result.success) {
    if (result.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
    return { membros: [], idColetivo, error: result.message, admin: session.isAdmin() };
  }
  return { membros: result.value, idColetivo, error: null, admin: session.isAdmin() };
}

export async function action({ request, params }: Route.ActionArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");
  const form = await request.formData();
  const requestId = String(form.get("requestId") ?? "");
  const intent = String(form.get("intent") ?? "");
  const idColetivo = Number(params.idColetivo);
  const id = Number(form.get("id"));
  const fail = (message: string, status = 400) => data({ success: false, message, requestId }, { status });
  if (!isMembroId(idColetivo)) return fail("Coletivo inválido.");
  if (!["create", "update", "delete"].includes(intent)) return fail("Ação inválida.");
  if (intent !== "create" && !isMembroId(id)) return fail("Membro inválido.");

  let email = "";
  if (intent !== "delete") {
    try { email = parseMembroEmail(form.get("email")); }
    catch (error) { return fail(error instanceof Error ? error.message : "Email inválido."); }
  }

  // The ID identifies the membership, and the current route defines its collective.
  if (intent !== "create") {
    const existing = await MembroService.getById(id, session.getToken());
    if (!existing.success) {
      if (existing.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
      return fail(existing.message, existing.status);
    }
    if (existing.value.idColetivo !== idColetivo) return fail("Este membro não pertence ao coletivo atual.", 404);
  }

  const result = intent === "delete"
    ? await MembroService.delete(id, session.getToken())
    : intent === "create"
      ? await MembroService.create({ idColetivo, email }, session.getToken())
      : await MembroService.update(id, { idColetivo, email }, session.getToken());

  if (!result.success) {
    if (result.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
    return fail(result.message, result.status);
  }
  const message = intent === "create" ? "Membro adicionado com sucesso."
    : intent === "update" ? "Membro atualizado com sucesso." : "Membro removido do coletivo.";
  return data({ success: true, message, requestId });
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return <MembersListPage {...loaderData} />;
}
