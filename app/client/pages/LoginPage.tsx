import { Form, Link, useActionData, useNavigation, useSearchParams } from "react-router";
import type { action } from "../../routes/login";

export function LoginPage() {
  const result = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const submitting = navigation.state === "submitting";

  return (
    <main className="mx-auto mt-20 max-w-sm px-4">
      <h1 className="mb-6 text-2xl font-semibold">Entrar</h1>
      {searchParams.get("registered") === "1" && (
        <p role="status" className="mb-4 text-green-700">
          Cadastro realizado com sucesso. Entre com sua conta.
        </p>
      )}
      <Form method="post" className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          Email
          <input className="rounded border p-2" type="email" name="email" autoComplete="username" required />
        </label>
        <label className="flex flex-col gap-1">
          Senha
          <input className="rounded border p-2" type="password" name="password" autoComplete="current-password" required />
        </label>
        {result?.error && <p role="alert" className="text-red-700">{result.error}</p>}
        <button className="rounded bg-blue-700 p-2 text-white disabled:opacity-50" disabled={submitting} type="submit">
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </Form>
      <p className="mt-6 text-sm">Ainda não tem uma conta?</p>
      <Link to="/register" className="mt-2 inline-block rounded border px-4 py-2 text-center">
        Cadastrar-se
      </Link>
    </main>
  );
}
