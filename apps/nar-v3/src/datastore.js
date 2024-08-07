/*
This file contains functions for retrieving data from the KG Core API of the
EBRAINS Knowledge Graph. It also contains a cache, to reduce the number of requests.


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

import { kgUrl, kgDefaultStage } from "./globals";
//import examplePatchClampData from "./example_data/example_patch_clamp_dataset.json";

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

let cache = {
  "datasets summary": {},
  "datasets detail": {},
  "datasets techniques": {},
  "patch clamp recordings summary": {},
  "patch clamp recordings detail": {},
};
//cache["datasets detail"][uuidFromUri(examplePatchClampData["@id"])] = examplePatchClampData;
//cache["datasets detail"]["example"] = examplePatchClampData;

function buildRequestConfig(auth, method = "GET", body = {}) {
  if (auth.token) {
    let config = {
      headers: {
        Authorization: "Bearer " + auth.token,
        "Content-Type": "application/json",
      },
      method: method,
    };
    if (body) {
      config.body = body;
    }
    return config;
  } else {
    return null;
  }
}

async function queryKG(kgQuery, searchParams, auth) {
  const searchParamStr = new URLSearchParams(searchParams).toString();
  let url = `${kgUrl}/queries?${searchParamStr}`;
  const config = buildRequestConfig(auth, "POST", JSON.stringify(kgQuery));
  if (config) {
    const response = await fetch(url, config);
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

async function getKGItem(cacheLabel, kgQuery, instanceId, auth, stage = kgDefaultStage) {
  console.log("getKGItem " + cacheLabel + instanceId);
  if (!cache[cacheLabel][instanceId]) {
    const searchParams = { stage: stage, instanceId: instanceId };
    const result = await queryKG(kgQuery, searchParams, auth);
    if (result) {
      const items = result.data;
      cache[cacheLabel][instanceId] = items[0];
    }
  }
  return cache[cacheLabel][instanceId];
}

async function getKGData(
  cacheLabel,
  kgQuery,
  auth,
  searchFilters,
  stage = kgDefaultStage,
  size = 1000,
  from = 0
) {
  console.log("getKGData " + cacheLabel);
  if (isEmpty(cache[cacheLabel])) {
    // if the cache is empty we need to fill it
    console.log(kgUrl);
    let searchParams = {
      returnTotalResults: true,
      stage: stage,
      size: size,
      from: from,
    };
    if (searchFilters) {
      searchParams = { ...searchParams, searchFilters };
    }
    const result = await queryKG(kgQuery, searchParams, auth);
    if (result) {
      const items = result.data;
      for (const index in items) {
        cache[cacheLabel][items[index].id] = items[index];
      }
    }
  }
  const itemArray = Object.values(cache[cacheLabel]);
  console.log(itemArray);
  return itemArray;
}

async function count(kgQuery, auth, searchFilters, stage = kgDefaultStage) {
  let searchParams = {
    returnTotalResults: true,
    stage: stage,
    size: 1,
    from: 0,
  };
  if (searchFilters) {
    searchParams = { ...searchParams, searchFilters };
  }
  const result = await queryKG(kgQuery, searchParams, auth);
  if (result) {
    return result.total;
  } else {
    return 0;
  }
}

export { queryKG, getKGItem, getKGData, count };
