//@ts-check

/* ------------------------------------------------------------------
   UTILIDADES
-------------------------------------------------------------------*/

/**
 * Converte uma string ou array de classes em string normalizada.
 * @param {string|string[]|null} cls
 * @returns {string}
 */
export function normalizeClass(cls) {
  if (!cls) {
    return "";
  }
  return Array.isArray(cls) ? cls.join(" ") : cls;
}
