import { data, redirect } from "react-router";
import type { Route } from "./+types/api.coletivos.$id_.categorias";
import { SessionService } from "@service/SessionService.server";
import { TarefaService } from "@service/TarefaService.server";
import { isTarefaId } from "@common/tarefaForm.server";

const NOME_MAX_LENGTH = 100;

// Categorias de tarefa do coletivo: lista completa (modal de gerenciamento) e opções do dropdown do formulário
export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");
  const idColetivo = Number(params.id);
  if (!isTarefaId(idColetivo)) return data({ categorias: [], options: [], error: "Coletivo inválido." }, { status: 400 });
  const result = await TarefaService.listCategorias(idColetivo, session.getToken());
  if (!result.success) {
    if (result.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
    const error = result.status === 404
      ? "O backend ainda não oferece as categorias de tarefa (GET /api/tarefa/categorias). Tente novamente mais tarde."
      : result.message;
    return data({ categorias: [], options: [], error }, { status: result.status });
  }
  const options = result.value.map((categoria) => ({ value: categoria.id, label: categoria.nome }));
  return data({ categorias: result.value, options, error: null });
}

export async function action({ request, params }: Route.ActionArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");
  const form = await request.formData();
  const requestId = String(form.get("requestId") ?? "");
  const intent = String(form.get("intent") ?? "");
  const idColetivo = Number(params.id);
  const id = Number(form.get("id"));
  const nome = String(form.get("nome") ?? "").trim();
  const fail = (message: string, status = 400) => data({ success: false, message, requestId }, { status });
  if (!isTarefaId(idColetivo)) return fail("Coletivo inválido.");
  if (!["create", "update", "delete"].includes(intent)) return fail("Ação inválida.");
  if (intent !== "create" && !isTarefaId(id)) return fail("Categoria inválida.");
  if (intent !== "delete" && !nome) return fail("Informe o nome da categoria.");
  if (intent !== "delete" && nome.length > NOME_MAX_LENGTH) return fail("O nome da categoria pode ter até " + NOME_MAX_LENGTH + " caracteres.");

  // Confere que a categoria alterada pertence ao coletivo desta página
  if (intent !== "create") {
    const existing = await TarefaService.getCategoriaById(id, session.getToken());
    if (!existing.success) {
      if (existing.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
      return fail(existing.message, existing.status);
    }
    if (existing.value.idColetivo !== idColetivo) return fail("Esta categoria não pertence ao coletivo atual.", 404);
  }

  const result = intent === "create" ? await TarefaService.createCategoria(idColetivo, nome, session.getToken())
    : intent === "update" ? await TarefaService.updateCategoria(id, nome, session.getToken())
    : await TarefaService.deleteCategoria(id, session.getToken());
  if (!result.success) {
    if (result.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
    return fail(result.message, result.status);
  }
  const message = intent === "create" ? "Categoria criada com sucesso."
    : intent === "update" ? "Categoria renomeada com sucesso." : "Categoria excluída com sucesso.";
  return data({ success: true, message, requestId });
}
