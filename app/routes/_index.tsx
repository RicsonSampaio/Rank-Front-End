import { redirect, type LoaderFunctionArgs } from "react-router";
import { SessionService } from "@service/SessionService.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  return redirect(session.isValid() ? "/home" : "/login");
}
