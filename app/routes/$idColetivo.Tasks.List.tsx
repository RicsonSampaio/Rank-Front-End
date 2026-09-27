import { data, redirect } from "react-router";
import type { Route } from "./+types/$idColetivo.Tasks.List";
import { TasksListPage } from "@pages/TasksList";
import { SessionService } from "@service/SessionService.server";
import { TarefaService } from "@service/TarefaService.server";
import { isTarefaId, parseTarefaPayload } from "@common/tarefaForm.server";
import type { TarefaPayload } from "@types-api/Tarefa";

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");
  const idColetivo = Number(params.idColetivo);
  if (!isTarefaId(idColetivo)) return redirect("/home");
  const result = await TarefaService.list(idColetivo, session.getToken());
  if (!result.success) {
    if (result.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
    return { tarefas: [], idColetivo, error: result.message, admin: session.isAdmin() };
  }
  return { tarefas: result.tarefas, idColetivo, error: null, admin: session.isAdmin() };
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
  if (!isTarefaId(idColetivo)) return fail("Coletivo inválido.");
  if (!["create", "update", "delete"].includes(intent)) return fail("Ação inválida.");
  if (intent !== "create" && !isTarefaId(id)) return fail("Tarefa inválida.");

  // Preserve the creator and verify that the mutation belongs to this page's collective.
  let creatorId = Number(session.getUserId());
  if (intent !== "create") {
    const existing = await TarefaService.getById(id, session.getToken());
    if (!existing.success) {
      if (existing.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
      return fail(existing.message, existing.status);
    }
    if (existing.value.idColetivo !== idColetivo) return fail("Esta tarefa não pertence ao coletivo atual.", 404);
    creatorId = existing.value.idUsuarioCriacao;
  }

  let result;
  if (intent === "delete") {
    result = await TarefaService.delete(id, session.getToken());
  } else {
    let payload: TarefaPayload;
    try { payload = parseTarefaPayload(form.get("payload")); }
    catch (error) { return fail(error instanceof Error ? error.message : "Dados da tarefa inválidos."); }
    if (intent === "create" && !isTarefaId(creatorId)) return fail("Usuário da sessão inválido.");
    payload.idColetivo = idColetivo;
    payload.idUsuarioCriacao = creatorId;
    result = intent === "create"
      ? await TarefaService.create(payload, session.getToken())
      : await TarefaService.update(id, payload, session.getToken());
  }
  if (!result.success) {
    if (result.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
    return fail(result.message, result.status);
  }
  const message = intent === "create" ? "Tarefa criada com sucesso."
    : intent === "update" ? "Tarefa atualizada com sucesso." : "Tarefa excluída com sucesso.";
  return data({ success: true, message, requestId });
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return <TasksListPage {...loaderData} />;
}
