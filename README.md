# Front mínimo para estudar login e cadastro

Projeto separado inspirado na arquitetura da ConstruCode: React Router em modo framework, React, TypeScript, Tailwind e camadas `routes` → `service` → `api`.

## Preparar

1. Use Node 20 ou superior e execute `npm install` nesta pasta.
2. Não precisa de `.env`: o front chama a API em `http://localhost:5100` (perfil `http` do backend Rank). Para usar outra URL, copie `.env.example` para `.env` e ajuste `API_URL`.
3. Inicie a API Rank (`dotnet run --project Rank.WebAPI --launch-profile http`) e execute `npm run dev` no front. Abra `http://localhost:3300`.

O backend local examinado em `C:\RankProjectDotNet\Rank\RankProject` usa **.NET 8**. Este front chama a API diretamente pelo servidor do React Router; não precisa da aplicação .NET antiga.

## Contrato usado

- `POST {API_URL}/api/users`: recebe `{ "name": "...", "email": "...", "password": "..." }`. Retorna `201` com `{ id, name, email, isActive }`. Email já cadastrado retorna `409` com `message`; erros de validação retornam `400` com `errors`.
- `POST {API_URL}/api/auth/authenticate`: recebe `{ "email": "...", "password": "..." }`. Retorna `{ "access_token": "JWT", "expiration_date": "..." }`; credenciais inválidas retornam `401` com `message`.
- O JWT inclui `sub` (id), `name`, `email` e `exp`. O front lê essas claims para montar a sessão em cookie `httpOnly`. A API assina o token e valida as credenciais; este exemplo não verifica a assinatura criptográfica do JWT.

## Fluxo

`/` direciona para `/login` ou `/home`. Em `/login`, o botão **Cadastrar-se** abre `/register`. O formulário de cadastro envia os dados para a `action` do servidor do front, que usa `UserService` e `UserApi` para chamar a API. Em caso de falha, a mesma tela mostra a mensagem da API e mantém nome e email preenchidos. Em caso de sucesso, o usuário volta a `/login` com uma mensagem de confirmação.

O login usa `AuthenticationService` e `AuthenticationApi` e grava o JWT em um cookie de sessão `httpOnly`. O `loader` de `/home` valida a sessão e fornece o nome à página. O botão **Sair** destrói a sessão em `/logout`.

## Pastas essenciais

- `app/routes/`: URLs e operações `loader`/`action`.
- `app/client/pages/`: componentes de Login, Cadastro e Home.
- `app/server/service/`: regras de autenticação, cadastro e sessão.
- `app/server/api/`: chamadas HTTP ao backend.
- `app/interfaces/`: contratos TypeScript.

Comandos úteis: `npm run typecheck`, `npm test`, `npm run build`.

## Menu e pessoas

Depois do login, /home mantém apenas a frase com o nome do usuário e mostra um menu lateral compartilhado em app/client/layouts/AppLayout.tsx. A engrenagem no rodapé abre Configurações ao passar o mouse ou ao clicar; o item Pessoas leva a /people.

O loader de /people exige uma sessão válida e chama UserService → UserApi → GET {API_URL}/api/users com o JWT no cabeçalho Authorization: Bearer. A lista não é filtrada por obra. Se a API devolver 401, a sessão é encerrada e o usuário volta ao login; outras falhas aparecem na própria tela. A API mantém a responsabilidade de autorizar a consulta.