//@ts-check

/**
 * Gera um ID aleatório com um prefixo opcional.
 * @param {string} [prefix="id"] - Prefixo para o ID gerado.
 * @returns {string} - ID aleatório no formato "prefix-randomPart".
 */
export function generateRandomId(prefix = "id", size = 8) {
  const randomPart = Math.random().toString(36).substring(2, size + 2);
  return `${prefix}-${randomPart}`;
}