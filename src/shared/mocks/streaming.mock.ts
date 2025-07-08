export const simularStreaming = async (
  conteudoUsuario: string,
  aoChunk: (chunk: string) => void
): Promise<void> => {
  const respostaCompleta = `Resposta simulada para: ${conteudoUsuario}`;
  const partes = respostaCompleta.match(/.{1,15}/g) ?? [];

  for (const parte of partes) {
    await new Promise((r) => setTimeout(r, 200));
    aoChunk(parte);
  }
}; 