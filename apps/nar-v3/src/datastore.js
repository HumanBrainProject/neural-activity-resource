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
      datasets: {},
      patchClampRecordings: {}
    };
  }

  get_request_config() {
    let token = sessionStorage.getItem("token");
    return {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
    }
  }

  async getDatasets(searchFilters) {
    console.log("getDatasets");
    if (isEmpty(this.cache.datasets)) {
      // if the cache is empty we need to get all datasets
      console.log(this.baseUrl);
      let url = this.baseUrl + "/queries?stage=RELEASED&size=3&returnTotalResults=true";
    //   if (searchFilters) {
    //     const query_params = new URLSearchParams(searchFilters).toString();
    //     url += "?" + query_params;
    //   }
      const query = {
        "@context": {
          "@vocab": "https://core.kg.ebrains.eu/vocab/query/",
          "query": "https://schema.hbp.eu/myQuery/",
          "propertyName": {
            "@id": "propertyName",
            "@type": "@id"
          },
          "path": {
            "@id": "path",
            "@type": "@id"
          }
        },
        "meta": {
          "type": "https://openminds.ebrains.eu/core/DatasetVersion",
          "responseVocab": "https://schema.hbp.eu/myQuery/"
        },
        "structure": [
          {
            "propertyName": "query:fullName",
            "path": "https://openminds.ebrains.eu/vocab/fullName"
          },
          {
            "propertyName": "query:description",
            "path": "https://openminds.ebrains.eu/vocab/description"
          },
          {
            "propertyName": "query:id",
            "path": "@id"
          },
          {
            "propertyName": "query:shortName",
            "path": "https://openminds.ebrains.eu/vocab/shortName"
          },
          {
            "propertyName": "query:versionIdentifier",
            "path": "https://openminds.ebrains.eu/vocab/versionIdentifier"
          },
          {
            "propertyName": "query:isVersionOf",
            "path": {
              "@id": "https://openminds.ebrains.eu/vocab/hasVersion",
              "reverse": true
            },
            "singleValue": "FIRST",
            "structure": [
              {
                "propertyName": "query:description",
                "path": "https://openminds.ebrains.eu/vocab/description"
              },
              {
                "propertyName": "query:fullName",
                "path": "https://openminds.ebrains.eu/vocab/fullName"
              },
              {
                "propertyName": "query:shortName",
                "path": "https://openminds.ebrains.eu/vocab/shortName"
              }
            ]
          },
          {
            "propertyName": "query:accessibility",
            "required": true,
            "singleValue": "FIRST",
            "filter": {
              "op": "EQUALS",
              "value": "free access"
            },
            "path": [
              "https://openminds.ebrains.eu/vocab/accessibility",
              "https://openminds.ebrains.eu/vocab/name"
            ]
          }
        ]
      }
      const config = this.get_request_config();
      config.method ="POST"
      config.body = JSON.stringify(query);

      console.log("Getting datasets from " + url);
      //return axios.get(url, config)
      const response = await fetch(url, config);
      const result = await response.json();
      const datasets = result.data;
      console.log(datasets);
      for (const index in datasets) {
        this.cache.datasets[datasets[index].id] = datasets[index];
      }
    }
    console.log(this.cache.datasets);
    const datasetArray = Object.values(this.cache.datasets);
    console.log(datasetArray);
    return datasetArray
  }

  async getPatchClampRecordings(searchFilters) {
    console.log("getPatchClampRecordings");
    if (isEmpty(this.cache.patchClampRecordings)) {
      // if the cache is empty we need to get all recordings
      console.log(this.baseUrl);
      let url = this.baseUrl + "/queries?stage=RELEASED&size=20&returnTotalResults=true";
      if (searchFilters) {
        const query_params = new URLSearchParams(searchFilters).toString();
        url += "&" + query_params;
      }
      const query = buildKGQuery(
        "core/TissueSample",
        [
            S("@id"),
            S("lookupLabel"),
            L("anatomicalLocation", [S("name"), S("@type")], {expectSingle: false}),
            L("biologicalSex/name"),
            L("laterality/name"),
            L("origin", [S("name"), S("@type")]),
            L("species", [
                S("name"),
                S("@type"),
                R("species", "species", [S("name")], {type: "core/Strain"})
            ]),
            L("strain/name"),
            L("type/name"),
            L("studiedState", [
                S("lookupLabel"),
                L("descendedFrom", [
                    S("lookupLabel"),
                    S("@type"),
                    R("isStateOf", "studiedState", [
                        S("lookupLabel"),
                        S("@id"),
                        L("type/name")
                    ])
                ]),
                L("age", [
                    S("value"),
                    S("uncertainty"),
                    S("minValue"),
                    S("maxValue"),
                    L("unit/name"),
                    L("minValueUnit/name"),
                    L("maxValueUnit/name"),
                ]),
                L("attribute", [S("name"), S("@type")], {expectSingle: false}),
                S("additionalRemarks"),
                L("pathology", [S("name"), S("@type")], {expectSingle: false})
            ],
            {expectSingle: false}),
            R("belongsToDataset", "studiedSpecimen", [
                S("fullName"),
                S("shortName"),
                S("@id"),
                L("technique/name", [], {filter: "patch clamp", expectSingle: false}),
                L("accessibility/name", [], {filter: "free access"}),
                R("isVersionOf", "hasVersion", [S("shortName"), S("fullName")])
            ])
        ]
      )
      console.log(query);
      const config = this.get_request_config();
      config.method ="POST"
      config.body = JSON.stringify(query);

      console.log("Getting datasets from " + url);
      //return axios.get(url, config)
      const response = await fetch(url, config);
      const result = await response.json();
      const patchClampRecordings = result.data;
      console.log(patchClampRecordings);
      for (const index in patchClampRecordings) {
        this.cache.patchClampRecordings[patchClampRecordings[index].id] = patchClampRecordings[index];
      }
    }
    const patchClampRecordingArray = Object.values(this.cache.patchClampRecordings);
    console.log(patchClampRecordingArray);
    return patchClampRecordingArray
  }
}

const datastore = new DataStore(kgUrl);
export { datastore };
