import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
// Importar utilidades puras sin transformar JSX ni requerir módulos nativos.
const source = await readFile(
  new URL("../src/utils/normalizeCountry.js", import.meta.url),
  "utf8",
);
const { normalizeCountry, chooseCountry } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);
test("normaliza acentos, mayúsculas y espacios", () => {
  assert.equal(normalizeCountry("  PERÚ  "), normalizeCountry("peru"));
  assert.equal(normalizeCountry(" United   States "), "united states");
  assert.equal(normalizeCountry("Côte d’Ivoire"), "cote d’ivoire");
});
test("selección aleatoria nunca repite el país anterior", () => {
  const countries = [
    { name: "Peru" },
    { name: "Argentina" },
    { name: "Albania" },
  ];
  let previous = countries[0];
  for (let i = 0; i < 1000; i++) {
    const next = chooseCountry(countries, previous);
    assert.ok(countries.includes(next));
    assert.notEqual(next.name, previous.name);
    previous = next;
  }
});
