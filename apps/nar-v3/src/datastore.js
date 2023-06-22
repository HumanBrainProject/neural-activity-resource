import { kgUrl } from "./globals";
import { buildKGQuery, simpleProperty as S, linkProperty as L, reverseLinkProperty as R } from "./queries";


function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function isAlmostEmpty(obj) {
  return Object.keys(obj).length <= 1;
}

function byDate(obj1, obj2) {
  // most recent first
  if (obj1.stages[0].start_time < obj2.stages[0].start_time) {
    return 1;
  }
  if (obj1.stages[0].start_time > obj2.stages[0].start_time) {
    return -1;
  }
  return 0;
}

class DataStore {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.cache = {
      "datasets summary": {},
      "patch clamp recordings summary": {},
      "patch clamp recordings detail": {}
    };
  }

  buildRequestConfig(method="GET", body={}) {
    let token = sessionStorage.getItem("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      method: method
    }
    if (body) {
      config.body = body
    }
    return config
  }

  async queryKG(kgQuery, searchParams) {
    const searchParamStr = new URLSearchParams(searchParams).toString();
    let url = `${this.baseUrl}/queries?${searchParamStr}`;
    const config = this.buildRequestConfig("POST", JSON.stringify(kgQuery));
    const response = await fetch(url, config);
    const result = await response.json();
    const items = result.data;
    console.log(items);
    return items;
  }

  async getKGItem(cacheLabel, kgQuery, instanceId, stage = "RELEASED") {
    console.log("getKGItem " + cacheLabel + instanceId);
    if (!this.cache[cacheLabel][instanceId]) {
      const searchParams = {stage: stage, instanceId: instanceId};
      const items = await this.queryKG(kgQuery, searchParams);
      this.cache[cacheLabel][instanceId] = items[0];
    }
    return this.cache[cacheLabel][instanceId];
  }

  async getKGData(cacheLabel, kgQuery, searchFilters, stage = "RELEASED", size = 20, from = 0) {
    console.log("getKGData " + cacheLabel);
    if (isEmpty(this.cache[cacheLabel])) {
      // if the cache is empty we need to fill it
      console.log(this.baseUrl);
      let searchParams = {
        returnTotalResults: true,
        stage: stage,
        size: size,
        from: from
      }
      if (searchFilters) {
        searchParams = {...searchParams, searchFilters}
      }
      const items = await this.queryKG(kgQuery, searchParams);
      for (const index in items) {
        this.cache[cacheLabel][items[index].id] = items[index];
      }
    }
    const itemArray = Object.values(this.cache[cacheLabel]);
    console.log(itemArray);
    return itemArray
  }
}

const datastore = new DataStore(kgUrl);
export { datastore };
