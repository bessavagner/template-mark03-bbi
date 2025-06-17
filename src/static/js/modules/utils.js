//@ts-check

/* ------------------------------------------------------------------
   UTILIDADES
-------------------------------------------------------------------*/

/**
 * Converte uma string ou array de classes em string normalizada.
 * @param {string|string[]} cls
 * @returns {string}
 */
export function normalizeClass(cls) {
  return Array.isArray(cls) ? cls.join(" ") : cls;
}
