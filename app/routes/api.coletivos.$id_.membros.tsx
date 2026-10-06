import { data, redirect } from "react-router";
import type { Route } from "./+types/api.coletivos.$id_.membros";
import { SessionService } from "@service/SessionService.server";
import { MembroService } from "@service/MembroService.server";
import { isTarefaId } from "@common/tarefaForm.server";

// Opções de responsável (membros do coletivo) para o dropdown do formulário de tarefa
export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");
  const idColetivo = Number(params.id);
  if (!isTarefaId(idColetivo)) return data({ options: [], error: "Coletivo inválido." }, { status: 400 });
  const result = await MembroService.list(idColetivo, session.getToken());
  if (!result.success) {
    if (result.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
    return data({ options: [], error: result.message }, { status: result.status });
  }
  // Um usuário pode ter mais de um vínculo com o coletivo; o dropdown mostra cada um uma vez
  const membros = new Map<number, string>();
  for (const membro of result.value) {
    if (!membros.has(membro.idUsuario)) membros.set(membro.idUsuario, membro.nome || membro.email || "Usuário #" + membro.idUsuario);
  }
  return data({ options: [...membros].map(([value, label]) => ({ value, label })), error: null });
}
