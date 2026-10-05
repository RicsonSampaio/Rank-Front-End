export function getEnv() {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) throw new Error("API_URL não configurada");

  return {
    API_URL: apiUrl.replace(/\/$/, ""),
  };
}
