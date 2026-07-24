/**
 * Convierte un texto en un slug estable y seguro para URLs:
 * quita acentos, pasa a minúsculas y reemplaza lo no alfanumérico por "-".
 * Se usa tanto para generar enlaces como para resolver rutas de proyecto.
 */
export const slugify = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
