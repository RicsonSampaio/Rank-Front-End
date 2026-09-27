import { data, redirect } from "react-router";
import type { Route } from "./+types/api.membros.$id";
import { SessionService } from "@service/SessionService.server";
import { MembroService } from "@service/MembroService.server";
import { isMembroId } from "@common/membroForm.server";

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");
  const id = Number(params.id);
  const idColetivo = Number(new URL(request.url).searchParams.get("idColetivo"));
  if (!isMembroId(id) || !isMembroId(idColetivo)) {
    return data({ membro: null, error: "Membro ou coletivo inválido." }, { status: 400 });
  }
  const result = await MembroService.getById(id, session.getToken());
  if (!result.success) {
    if (result.status === 401) return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
    return data({ membro: null, error: result.message }, { status: result.status });
  }
  if (result.value.idColetivo !== idColetivo) {
    return data({ membro: null, error: "Este membro não pertence ao coletivo atual." }, { status: 404 });
  }
  return data({ membro: result.value, error: null });
}
