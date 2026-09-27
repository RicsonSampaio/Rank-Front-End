import { data, redirect } from "react-router";
import type { Route } from "./+types/organizations";
import { OrganizationsPage } from "@pages/OrganizationsPage";
import { SessionService } from "@service/SessionService.server";
import { OrganizationService } from "@service/OrganizationService.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");
  if (!session.isAdmin()) return redirect("/home");

  const result = await OrganizationService.list(session.getToken());
  if (!result.success) {
    if (result.status === 401) {
      return redirect("/login", {
        headers: { "Set-Cookie": await session.destroy() },
      });
    }
    return { organizations: [], error: result.message, admin: true };
  }

  return { organizations: result.organizations, error: null, admin: true };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");
  if (!session.isAdmin()) return redirect("/home");

  const form = await request.formData();
  const requestId = String(form.get("requestId") ?? "");
  const id = Number(form.get("id"));
  const intent = String(form.get("intent") ?? "");
  const fail = (message: string, status = 400) =>
    data({ success: false, message, requestId }, { status });

  if (!Number.isSafeInteger(id) || id <= 0) return fail("Organização inválida.");
  if (intent !== "update" && intent !== "delete") return fail("Ação inválida.");

  if (intent === "update") {
    const nome = String(form.get("nome") ?? "").trim();
    const logo = String(form.get("logo") ?? "").trim();
    if (!nome || nome.length > 150) return fail("O nome deve ter entre 1 e 150 caracteres.");
    if (logo.length > 2048) return fail("O logo deve ter no máximo 2048 caracteres.");

    const result = await OrganizationService.update(id, { nome, logo: logo || null }, session.getToken());
    if (!result.success) {
      if (result.status === 401) {
        return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
      }
      return fail(result.message, result.status);
    }
    return data({ success: true, message: "Organização atualizada com sucesso.", requestId });
  }

  const result = await OrganizationService.delete(id, session.getToken());
  if (!result.success) {
    if (result.status === 401) {
      return redirect("/login", { headers: { "Set-Cookie": await session.destroy() } });
    }
    return fail(result.message, result.status);
  }
  return data({ success: true, message: "Organização excluída com sucesso.", requestId });
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return <OrganizationsPage organizations={loaderData.organizations} error={loaderData.error} admin={loaderData.admin} />;
}