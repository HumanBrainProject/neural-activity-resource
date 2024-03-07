const UNITS_SYMBOLS = {
  "degree Celsius": "℃",
  micrometer: "µm",
  gigaohm: "GΩ",
  megaohm: "MΩ",
  millivolt: "mV",
  hertz: "Hz",
  millisecond: "ms",
};

function formatUnits(units) {
  return UNITS_SYMBOLS[units] || units + "s";
}

function formatQuant(val) {
  if (val.minValue) {
    if (val.maxValue) {
      return `${val.minValue}-${val.maxValue} ${formatUnits(val.minValueUnit)}`;
    } else {
      return `>=${val.minValue} ${formatUnits(val.minValueUnit)}`;
    }
  } else if (val.maxValue) {
    return `<=${val.maxValue} ${formatUnits(val.maxValueUnit)}`;
  } else if (val.value) {
    return `${val.value} ${formatUnits(val.unit)}`;
  } else {
    return "";
  }
}

function formatSolution(components) {
  const parts = [];
  components.forEach((component) => {
    const amount = formatQuant(component.amount);
    const symbol = component.chemicalProduct ? component.chemicalProduct.name : "[missing]";
    parts.push(`${amount} ${symbol}`);
  });
  return parts.join(", ");
}

function uuidFromUri(uri) {
  const parts = uri.split("/");
  return parts[parts.length - 1];
}

function getKGSearchUrl(uri) {
  const uuid = uuidFromUri(uri);
  return `https://search.kg.ebrains.eu/instances/${uuid}`;
}

export { formatQuant, formatUnits, formatSolution, uuidFromUri, getKGSearchUrl };
