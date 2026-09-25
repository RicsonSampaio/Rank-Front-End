import { useState, type PropsWithChildren } from "react";
import { Form, Link, useLocation } from "react-router";
import { HomeIcon, PeopleIcon, SettingsIcon } from "@components/NavigationIcons";

export function AppLayout({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const peopleActive = pathname === "/people";

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <aside aria-label="Menu principal" className="fixed inset-y-0 left-0 z-20 flex w-14 flex-col items-center rounded-r-lg bg-[#e8e8e8] py-4 shadow-md">
        <div aria-label="Rank" className="mb-5 flex h-8 w-8 items-center justify-center rounded-md bg-gray-800 text-lg font-bold text-white">R</div>
        <nav aria-label="Navegação principal" className="w-full">
          <Link
            to="/home"
            aria-label="Início"
            className={"flex h-12 w-full flex-col items-center justify-center gap-0.5 border-l-2 text-[10px] " + (pathname === "/home" ? "border-yellow-400 bg-gray-800 text-white" : "border-transparent text-gray-600 hover:bg-gray-300")}
          >
            <HomeIcon className="h-5 w-5" />
            <span>Início</span>
          </Link>
        </nav>

        <div
          className="relative mt-auto w-full"
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
            className={"flex h-12 w-full items-center justify-center border-l-2 " + (peopleActive ? "border-yellow-400 bg-gray-800 text-white" : "border-transparent text-gray-600 hover:bg-gray-300")}
          >
            <SettingsIcon className="h-5 w-5" />
          </button>
          {settingsOpen && (
            <div id="settings-menu" className="absolute bottom-0 left-14 w-56 rounded-r-lg border border-gray-200 bg-white p-4 shadow-lg">
              <h2 className="mb-3 text-base font-semibold">Configurações</h2>
              <nav aria-label="Configurações">
                <Link
                  to="/people"
                  onClick={() => setSettingsOpen(false)}
                  aria-current={peopleActive ? "page" : undefined}
                  className={"flex items-center gap-2 rounded px-2 py-2 text-sm " + (peopleActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-100")}
                >
                  <PeopleIcon className="h-5 w-5" />
                  Pessoas
                </Link>
              </nav>
            </div>
          )}
        </div>
        <Form action="/logout" method="post" className="mt-2 w-full border-t border-gray-300 pt-2 text-center">
          <button type="submit" className="w-full py-2 text-xs text-gray-700 hover:bg-gray-300">Sair</button>
        </Form>
      </aside>
      <main className="pl-14">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}