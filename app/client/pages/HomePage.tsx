import { AppLayout } from "@layouts/AppLayout";

export function HomePage({ name }: { name: string }) {
  return (
    <AppLayout>
      <p>O usuário logado é: {name}</p>
    </AppLayout>
  );
}