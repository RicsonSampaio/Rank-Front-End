import { AppLayout } from "@layouts/AppLayout";
import type { UserResponse } from "@types-api/User";

interface PeoplePageProps {
  users: UserResponse[];
  error: string | null;
}

export function PeoplePage({ users, error }: PeoplePageProps) {
  return (
    <AppLayout>
      <h1 className="mb-6 text-2xl font-semibold">Pessoas</h1>
      {error ? (
        <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>
      ) : users.length === 0 ? (
        <p>Nenhum usuário cadastrado.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">Nome</th>
                <th scope="col" className="px-4 py-3">Email</th>
                <th scope="col" className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-200">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.isActive ? "Ativo" : "Inativo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}