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

export { formatQuant, formatUnits, formatSolution, uuidFromUri, getKGSearchUrl };
