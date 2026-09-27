import { data, redirect } from "react-router";
import type { Route } from "./+types/api.tarefas.$id";
import { SessionService } from "@service/SessionService.server";
import { TarefaService } from "@service/TarefaService.server";
import { isTarefaId } from "@common/tarefaForm.server";

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");
  const id = Number(params.id);
  const idColetivo = Number(new URL(request.url).searchParams.get("idColetivo"));
  if (!isTarefaId(id) || !isTarefaId(idColetivo)) {
    return data({ tarefa: null, error: "Tarefa ou coletivo inválido." }, { status: 400 });
  }
  const result = await TarefaService.getById(id, session.getToken());
  if (!result.success) {
    if (result.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
    return data({ tarefa: null, error: result.message }, { status: result.status });
  }
  if (result.value.idColetivo !== idColetivo) {
    return data({ tarefa: null, error: "Esta tarefa não pertence ao coletivo atual." }, { status: 404 });
  }
  return data({ tarefa: result.value, error: null });
}
