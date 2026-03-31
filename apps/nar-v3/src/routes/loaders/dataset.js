/*
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

import { defer } from "react-router-dom";

import { getKGItem } from "../../datastore";
import { basicDatasetQuery, patchClampDatasetQuery, techniquesQuery } from "../queryLibrary";

export function getLoader(auth) {
  const loader = async ({ params }) => {
    const stage = auth.isCurator ? ["IN_PROGRESS", "RELEASED"] : "RELEASED";
    const techniques = await getKGItem(
      "datasets techniques",
      techniquesQuery,
      params.datasetId,
      auth,
      stage
    );
    console.log(techniques.technique);
    let query = basicDatasetQuery;
    if (techniques.technique && techniques.technique.includes("whole cell patch clamp")) {
      console.log("Using patch clamp dataset query");
      query = patchClampDatasetQuery;
    } else {
      console.log("Using basic dataset query");
    }
    const datasetPromise = getKGItem("datasets detail", query, params.datasetId, auth, stage);
    console.log(datasetPromise);
    return defer({ dataset: datasetPromise });
  };
  return loader;
}
