export function getEnv() {
  const apiUrl = process.env.API_URL;
  const sessionSecret = process.env.SESSION_SECRET;

  if (!apiUrl) throw new Error("API_URL não configurada");
  if (!sessionSecret) throw new Error("SESSION_SECRET não configurada");

  return {
    API_URL: apiUrl.replace(/\/$/, ""),
    SESSION_SECRET: sessionSecret,
  };
}
