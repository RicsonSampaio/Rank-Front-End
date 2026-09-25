export interface SessionData {
  token: string;
  userId: string;
  name: string;
  email: string;
  expirationDate: string;
}

export interface TokenPayloadData {
  sub?: string;
  name?: string;
  email?: string;
  exp?: number;
}
