import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(
  new URL("../src/services/countriesApi.js", import.meta.url),
  "utf8",
);
const { fetchCountries } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);

test("valida la respuesta real esperada y rechaza errores de red o datos", async () => {
  const originalFetch = globalThis.fetch;
  try {
    const countries = [
      { name: "Peru", flag: "https://example.com/pe.svg" },
      { name: "Argentina", flag: "https://example.com/ar.svg" },
    ];
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({ error: false, data: countries }),
    });
    assert.deepEqual(await fetchCountries(), countries);
    const withSpaces = [
      ...countries,
      { name: " Iran ", flag: " https://example.com/ir.svg " },
    ];
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({ error: false, data: withSpaces }),
    });
    const cleaned = await fetchCountries();
    assert.equal(cleaned.length, 3);
    assert.equal(cleaned[2].name, "Iran");
    assert.equal(cleaned[2].flag, "https://example.com/ir.svg");
    globalThis.fetch = async () => ({ ok: false });
    await assert.rejects(fetchCountries(), /servidor/);
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        error: false,
        data: [...withSpaces, null, {}, { name: "Invalid", flag: "https://" }],
      }),
    });
    assert.equal((await fetchCountries()).length, 3);
    for (const [body, message] of [
      [{ error: true }, /informó un error/],
      [null, /lista de países esperada/],
      [{ data: [] }, /suficientes banderas/],
      [{ data: [{ name: "Peru", flag: "bad" }, {}] }, /suficientes banderas/],
    ]) {
      globalThis.fetch = async () => ({ ok: true, json: async () => body });
      await assert.rejects(fetchCountries(), message);
    }
    globalThis.fetch = async () => {
      throw new Error("Network failed");
    };
    await assert.rejects(fetchCountries(), /Network failed/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
