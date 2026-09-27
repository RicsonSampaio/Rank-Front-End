import { Form, Link, useActionData, useNavigation } from "react-router";
import type { action } from "../../routes/register";

export function RegisterPage() {
  const result = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";

  return (
    <main className="mx-auto mt-20 max-w-sm px-4">
      <h1 className="mb-6 text-2xl font-semibold">Criar conta</h1>
      <Form method="post" className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          Nome
          <input className="rounded border p-2" type="text" name="name" autoComplete="name" minLength={2} maxLength={150} defaultValue={result?.values.name} required />
        </label>
        <label className="flex flex-col gap-1">
          Email
          <input className="rounded border p-2" type="email" name="email" autoComplete="email" maxLength={320} defaultValue={result?.values.email} required />
        </label>
        <label className="flex flex-col gap-1">
          Senha
          <input className="rounded border p-2" type="password" name="password" autoComplete="new-password" required />
        </label>
        {result?.error && <p role="alert" className="text-red-700">{result.error}</p>}
        <button className="rounded bg-blue-700 p-2 text-white disabled:opacity-50" disabled={submitting} type="submit">
          {submitting ? "Cadastrando..." : "Cadastrar-se"}
        </button>
      </Form>
      <Link to="/login" className="mt-6 inline-block underline">Voltar para o login</Link>
    </main>
  );
}
