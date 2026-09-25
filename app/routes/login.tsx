import { data, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { LoginPage } from "@pages/LoginPage";
import { AuthenticationService } from "@service/AuthenticationService.server";
import { SessionService } from "@service/SessionService.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (session.isValid()) return redirect("/home");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) {
    return data({ error: "Informe email e senha." }, { status: 400 });
  }

  const result = await AuthenticationService.login(email, password);
  if (!result.success) {
    return data({ error: result.message }, { status: result.status });
  }

  try {
    const session = await SessionService.fromToken(result.token);
    return redirect("/home", {
      headers: { "Set-Cookie": await session.commit() },
    });
  } catch {
    return data({ error: "O backend retornou um token inválido." }, { status: 502 });
  }
}

export default function Page() {
  return <LoginPage />;
}
