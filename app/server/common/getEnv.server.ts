export function getEnv() {
  // Padrão: perfil http do backend Rank rodando localmente
  const apiUrl = process.env.API_URL || "http://localhost:5100";

  return {
    API_URL: apiUrl.replace(/\/$/, ""),
  };
}
