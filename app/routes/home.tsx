import type { Route } from "./+types/home";
import { redirect } from "react-router";
import { HomePage } from "@pages/HomePage";
import { SessionService } from "@service/SessionService.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (!session.isValid()) return redirect("/login");
  return { name: session.getName() };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return <HomePage name={loaderData.name} />;
}
