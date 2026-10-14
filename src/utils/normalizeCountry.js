export function normalizeCountry(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function chooseCountry(countries, previous) {
  const options = countries.filter(
    (country) => country.name !== previous?.name,
  );
  return options[Math.floor(Math.random() * options.length)] || countries[0];
}
