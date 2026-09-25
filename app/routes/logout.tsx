import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { SessionService } from "@service/SessionService.server";

export async function loader(_args: LoaderFunctionArgs) {
  return redirect("/home");
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  return redirect("/login", {
    headers: { "Set-Cookie": await session.destroy() },
  });
}
