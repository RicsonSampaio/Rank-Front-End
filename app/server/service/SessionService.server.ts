import { jwtDecode } from "jwt-decode";
import {
  createCookieSessionStorage,
  type Session,
} from "react-router";
import type { SessionData, TokenPayloadData } from "@types-server/Session";

function getStorage() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET não configurada");

  return createCookieSessionStorage<SessionData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 60 * 60 * 8,
      path: "/",
      sameSite: "lax",
      secrets: [secret],
      secure: process.env.NODE_ENV === "production",
    },
  });
}

export class SessionService {
  private constructor(private session: Session<SessionData>) {}

  static async use(cookieHeader: string) {
    const session = await getStorage().getSession(cookieHeader);
    return new SessionService(session);
  }

  static async fromToken(token: string) {
    const payload = jwtDecode<TokenPayloadData>(token);
    const expirationDate = payload.exp
      ? new Date(payload.exp * 1000).toISOString()
      : "";
    const name = payload.name?.trim();
    const userId = payload.sub;
    if (!name || !userId || !expirationDate ||
        !Number.isFinite(new Date(expirationDate).getTime()) ||
        Date.now() >= new Date(expirationDate).getTime()) {
      throw new Error("JWT sem dados válidos de usuário ou validade");
    }

    const service = await SessionService.use("");
    service.session.set("token", token);
    service.session.set("userId", userId);
    service.session.set("name", name);
    service.session.set("email", payload.email ?? "");
    service.session.set("expirationDate", expirationDate);
    return service;
  }

  isValid() {
    const expirationDate = this.session.get("expirationDate");
    return Boolean(this.session.get("token") && this.session.get("userId") &&
      expirationDate && Date.now() < new Date(expirationDate).getTime());
  }

  getToken() {
    return this.session.get("token") ?? "";
  }

  getName() {
    return this.session.get("name") ?? "";
  }

  async commit() {
    return getStorage().commitSession(this.session);
  }

  async destroy() {
    return getStorage().destroySession(this.session);
  }
}
