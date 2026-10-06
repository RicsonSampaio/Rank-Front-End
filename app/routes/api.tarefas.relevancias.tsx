import { data, redirect } from "react-router";
import type { Route } from "./+types/api.tarefas.relevancias";
import { SessionService } from "@service/SessionService.server";
import { TarefaService } from "@service/TarefaService.server";

// Opções de relevância para o dropdown do formulário de tarefa
export async function loader({ request }: Route.LoaderArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");
  const result = await TarefaService.relevancias(session.getToken());
  if (!result.success) {
    if (result.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
    const error = result.status === 404
      ? "O backend ainda não oferece a lista de relevâncias (GET /api/tarefa/relevancias). Tente novamente mais tarde."
      : result.message;
    return data({ options: [], error }, { status: result.status });
  }
  return data({ options: result.value.map((relevancia) => ({ value: relevancia.valor, label: relevancia.nome })), error: null });
}
