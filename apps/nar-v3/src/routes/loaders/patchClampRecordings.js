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

import {
  buildKGQuery,
  simpleProperty as S,
  linkProperty as L,
  reverseLinkProperty as R,
} from "../../queries";
import { getKGData } from "../../datastore";

export const query = buildKGQuery("TissueSample", [
  S("@id"),
  S("lookupLabel", { sort: true }),
  R(
    "belongsToDataset",
    "studiedSpecimen",
    [
      L("accessibility/name", [], { filter: "free access", required: true }),
      L("technique/name", [], { filter: "patch clamp", expectSingle: false, required: true }),
    ],
    { required: true }
  ),
]);

export function getLoader(auth) {
  const loader = async () => {
    const stage = auth.isCurator ? ["IN_PROGRESS", "RELEASED"] : "RELEASED";
    const tissueSamplesPromise = getKGData("patch clamp recordings summary", query, auth, {}, stage);

    console.log(tissueSamplesPromise);
    return { tissueSamples: tissueSamplesPromise };
  };
  return loader;
}
