import { useCallback, useState, type PropsWithChildren } from "react";
import { Form, Link, useLocation } from "react-router";
import { HomeIcon, PencilIcon, MemberIcon, PeopleIcon, OrganizationIcon, SettingsIcon } from "@components/NavigationIcons";

import { ColetivoEditModal } from "@components/ColetivoEditModal";

export function AppLayout({ children, admin = false, idColetivo }: PropsWithChildren<{ admin?: boolean; idColetivo?: number }>) {
  const { pathname } = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [coletivoEditor, setColetivoEditor] = useState<string | null>(null);
  const [coletivoMessage, setColetivoMessage] = useState<string | null>(null);
  const onColetivoUpdated = useCallback((message: string) => {
    setColetivoEditor(null);
    setColetivoMessage(message);
  }, []);
  const peopleActive = pathname === "/people";
  const organizationsActive = pathname === "/organizations";
  const settingsActive = peopleActive || organizationsActive;

  return (
    <div className="rank-app">
      <aside aria-label="Menu principal" className="rank-sidebar fixed inset-y-0 left-0 z-20 flex w-14 flex-col items-center rounded-r-lg py-4">
        <div aria-label="Rank" className="rank-sidebar-brand mb-5 flex h-8 w-8 items-center justify-center rounded-md text-lg font-bold">R</div>
        <nav aria-label="Navegação principal" className="w-full">
          <Link
            to="/home"
            aria-label="Início"
            className={"rank-sidebar-item flex h-12 w-full flex-col items-center justify-center gap-0.5 text-[10px] " + (pathname === "/home" ? "rank-sidebar-item-active" : "")}
          >
            <HomeIcon className="h-5 w-5" />
            <span>Início</span>
          </Link>
          {idColetivo !== undefined && (
            <Link
              to={"/" + idColetivo + "/Members/List"}
              aria-label="Membros do coletivo"
              aria-current={pathname === "/" + idColetivo + "/Members/List" ? "page" : undefined}
              className={"rank-sidebar-item flex h-12 w-full flex-col items-center justify-center gap-0.5 text-[10px] " + (pathname === "/" + idColetivo + "/Members/List" ? "rank-sidebar-item-active" : "")}
            >
              <MemberIcon className="h-5 w-5" />
              <span>Membros</span>
            </Link>
          )}
        </nav>

        <div className="mt-auto w-full">
          {idColetivo !== undefined && (
            <button
              type="button"
              aria-label="Editar coletivo"
              title="Editar coletivo"
              aria-haspopup="dialog"
              onClick={() => {
                setSettingsOpen(false);
                setColetivoMessage(null);
                setColetivoEditor(crypto.randomUUID());
              }}
              className={"rank-sidebar-item flex h-12 w-full items-center justify-center " + (coletivoEditor ? "rank-sidebar-item-active" : "")}
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
        {admin && (<div
          className="relative w-full"
          onMouseEnter={() => setSettingsOpen(true)}
          onMouseLeave={() => setSettingsOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setSettingsOpen(false);
          }}
        >
          <button
            type="button"
            aria-label="Configurações"
            aria-controls="settings-menu"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen(true)}
            className={"rank-sidebar-item flex h-12 w-full items-center justify-center " + (settingsActive ? "rank-sidebar-item-active" : "")}
          >
            <SettingsIcon className="h-5 w-5" />
          </button>
          {settingsOpen && (
            <div id="settings-menu" className="rank-sidebar-submenu absolute bottom-0 left-14 w-56 rounded-r-lg p-4">
              <h2 className="mb-3 text-base font-semibold">Configurações</h2>
              <nav aria-label="Configurações">
                <Link
                  to="/people"
                  onClick={() => setSettingsOpen(false)}
                  aria-current={peopleActive ? "page" : undefined}
                  className="flex items-center gap-2 rounded px-2 py-2 text-sm"
                >
                  <PeopleIcon className="h-5 w-5" />
                  Pessoas
                </Link>
                <Link
                  to="/organizations"
                  onClick={() => setSettingsOpen(false)}
                  aria-current={organizationsActive ? "page" : undefined}
                  className="flex items-center gap-2 rounded px-2 py-2 text-sm"
                >
                  <OrganizationIcon className="h-5 w-5" />
                  Organização
                </Link>
              </nav>
            </div>
          )}
        </div>)}
        </div>
        <Form action="/logout" method="post" className="rank-sidebar-logout mt-2 w-full pt-2 text-center">
          <button type="submit" className="w-full py-2 text-xs">Sair</button>
        </Form>
      </aside>
      <main className="pl-14">
        <div className="p-6">
          {idColetivo !== undefined && coletivoMessage && <p role="status" className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">{coletivoMessage}</p>}
          {children}
        </div>
      </main>
      {idColetivo !== undefined && coletivoEditor && (
        <ColetivoEditModal
          key={idColetivo + ":" + coletivoEditor}
          idColetivo={idColetivo}
          requestId={coletivoEditor}
          onClose={() => setColetivoEditor(null)}
          onUpdated={onColetivoUpdated}
        />
      )}
    </div>
  );
}