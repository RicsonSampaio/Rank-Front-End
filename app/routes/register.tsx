import { data, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { RegisterPage } from "@pages/RegisterPage";
import { SessionService } from "@service/SessionService.server";
import { UserService } from "@service/UserService.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await SessionService.use(request.headers.get("Cookie") ?? "");
  if (session.isValid()) return redirect("/home");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const values = { name, email };

  if (name.length < 2 || name.length > 150) {
    return data({ error: "O nome deve ter entre 2 e 150 caracteres.", values }, { status: 400 });
  }
  if (!email || email.length > 320) {
    return data({ error: "Informe um email válido.", values }, { status: 400 });
  }
  if (!password) {
    return data({ error: "Informe uma senha.", values }, { status: 400 });
  }

  const result = await UserService.register({ name, email, password, admin: false });
  if (!result.success) {
    return data({ error: result.message, values }, { status: result.status });
  }

  return redirect("/login?registered=1");
}

export default function Page() {
  return <RegisterPage />;
}
