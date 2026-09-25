import { redirect } from "react-router";
import type { Route } from "./+types/people";
import { PeoplePage } from "@pages/PeoplePage";
import { SessionService } from "@service/SessionService.server";
import { UserService } from "@service/UserService.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");

  const result = await UserService.list(session.getToken());
  if (!result.success) {
    if (result.status === 401) {
      return redirect("/login", {
        headers: { "Set-Cookie": await session.destroy() },
      });
    }
    return { users: [], error: result.message };
  }

  return { users: result.users, error: null };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return <PeoplePage users={loaderData.users} error={loaderData.error} />;
}