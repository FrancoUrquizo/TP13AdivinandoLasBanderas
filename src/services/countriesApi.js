export const COUNTRIES_URL =
  "https://countriesnow.space/api/v0.1/countries/flag/images";

export async function fetchCountries(signal) {
  const response = await fetch(COUNTRIES_URL, { signal });
  if (!response.ok) throw new Error("No se pudo conectar con el servidor.");
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(
      "El servidor no devolvió JSON. Revisá tu conexión y reintentá.",
    );
  }
  if (body?.error === true || body?.error === "true") {
    throw new Error(
      "El servicio de países informó un error. Reintentá en unos minutos.",
    );
  }
  if (!Array.isArray(body?.data)) {
    throw new Error(
      "La respuesta no contiene la lista de países esperada (data).",
    );
  }
  // Algunas URLs de la API incluyen espacios, como la bandera de Irán.
  const countries = Array.isArray(body?.data)
    ? body.data.map((item) => ({
        ...item,
        name: typeof item?.name === "string" ? item.name.trim() : "",
        flag: typeof item?.flag === "string" ? item.flag.trim() : "",
      }))
    : [];
  // Un registro defectuoso no debe impedir jugar con el resto de la lista.
  const validCountries = countries.filter((item) => {
    if (!item.name || !item.flag) return false;
    try {
      const url = new URL(item.flag);
      return url.protocol === "https:" && Boolean(url.hostname);
    } catch {
      return false;
    }
  });
  if (validCountries.length < 2) {
    throw new Error(
      `No hay suficientes banderas válidas: ${validCountries.length} de ${countries.length}. Reintentá la carga.`,
    );
  }
  return validCountries;
}
