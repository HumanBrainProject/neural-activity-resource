/*
This file contains utility functions for data display.


Copyright 2024 Andrew P. Davison, CNRS

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


const UNITS_SYMBOLS = {
  "degree Celsius": "℃",
  micrometer: "µm",
  gigaohm: "GΩ",
  megaohm: "MΩ",
  millivolt: "mV",
  hertz: "Hz",
  millisecond: "ms",
  millimolar: "mM",
  arcdegree: "°",
};

function formatUnits(units) {
  return UNITS_SYMBOLS[units] || units + "s";
}

function formatQuant(val) {
  if (val) {
    // note that using != matches both null and undefined
    if (val.minValue != null) {
      if (val.maxValue != null) {
        return `${val.minValue}-${val.maxValue} ${formatUnits(val.minValueUnit)}`;
      } else {
        return `>=${val.minValue} ${formatUnits(val.minValueUnit)}`;
      }
    } else if (val.maxValue != null) {
      return `<=${val.maxValue} ${formatUnits(val.maxValueUnit)}`;
    } else if (val.value != null) {
      return `${val.value} ${formatUnits(val.unit)}`;
    } else {
      return "";
    }
  } else {
    return "";
  }
}

function formatSolution(solution) {
  const parts = [];
  solution.hasPart.forEach((component) => {
    const amount = formatQuant(component.amount);
    const symbol = component.chemicalProduct ? component.chemicalProduct.name : "[missing]";
    parts.push(`${amount} ${symbol}`);
  });
  if (solution.additionalRemarks) {
    parts.push(solution.additionalRemarks);
  }
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

function isEmptyValue(val) {
  if (val === null || val === undefined || val === "") return true;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === "object") return Object.keys(val).length === 0;
  return false;
}

function getMatchKey(item) {
  if (!item || typeof item !== "object") return null;
  return item.id || item.lookupLabel || item.internalIdentifier || null;
}

function mergeArrays(primary, fallback) {
  // Merge two arrays by matching elements on id, lookupLabel, or internalIdentifier.
  // Falls back to positional matching for items without a key.
  if (!primary || primary.length === 0) return fallback || [];
  if (!fallback || fallback.length === 0) return primary;

  const fallbackByKey = {};
  const fallbackPositional = [];
  for (const item of fallback) {
    const key = getMatchKey(item);
    if (key) {
      fallbackByKey[key] = item;
    } else {
      fallbackPositional.push(item);
    }
  }

  let positionalIndex = 0;
  const result = primary.map((item) => {
    const key = getMatchKey(item);
    if (key && fallbackByKey[key]) {
      return mergeItems(item, fallbackByKey[key]);
    } else if (!key && fallbackPositional[positionalIndex]) {
      return mergeItems(item, fallbackPositional[positionalIndex++]);
    }
    return item;
  });

  // Add fallback items whose key wasn't present in primary
  const primaryKeys = new Set(primary.map(getMatchKey).filter(Boolean));
  for (const item of fallback) {
    const key = getMatchKey(item);
    if (key && !primaryKeys.has(key)) {
      result.push(item);
    }
  }

  return result;
}

function mergeItems(primary, fallback) {
  // Deep-merge two KG items. Primary (IN_PROGRESS) wins for non-empty fields;
  // empty primary fields are filled from fallback (RELEASED).
  if (primary === null || primary === undefined) return fallback;
  if (typeof primary !== "object") return primary;
  if (fallback === null || fallback === undefined || typeof fallback !== "object") return primary;
  const result = { ...primary };
  for (const key of Object.keys(fallback)) {
    if (isEmptyValue(result[key])) {
      result[key] = fallback[key];
    } else if (Array.isArray(result[key]) && Array.isArray(fallback[key])) {
      result[key] = mergeArrays(result[key], fallback[key]);
    } else if (
      typeof result[key] === "object" &&
      !Array.isArray(result[key]) &&
      typeof fallback[key] === "object" &&
      !Array.isArray(fallback[key])
    ) {
      result[key] = mergeItems(result[key], fallback[key]);
    }
  }
  return result;
}

export { formatQuant, formatUnits, formatSolution, uuidFromUri, getKGSearchUrl, isEmptyValue, mergeItems };
