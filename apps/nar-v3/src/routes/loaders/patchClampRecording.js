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
import { getKGItem } from "../../datastore";

const query = buildKGQuery("TissueSample", [
  S("@id"),
  S("lookupLabel"),
  L("anatomicalLocation", [S("name"), S("@type")], { expectSingle: false }),
  L("biologicalSex/name"),
  L("laterality/name"),
  L("origin", [S("name"), S("@type")]),
  L("species", [
    S("name"),
    S("@type"),
    R("species", "species", [S("name")], { type: "core/Strain" }),
  ]),
  L("strain/name"),
  L("type/name"),
  L(
    "studiedState",
    [
      S("lookupLabel"),
      L("descendedFrom", [
        S("lookupLabel"),
        S("@type"),
        R("isStateOf", "studiedState", [S("lookupLabel"), S("@id"), L("type/name")]),
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
      L("attribute", [S("name"), S("@type")], { expectSingle: false }),
      S("additionalRemarks"),
      L("pathology", [S("name"), S("@type")], { expectSingle: false }),
    ],
    { expectSingle: false }
  ),
  R(
    "belongsToDataset",
    "studiedSpecimen",
    [
      S("fullName"),
      S("shortName"),
      S("@id"),
      L("technique/name", [], { filter: "patch clamp", expectSingle: false, required: true }),
      L("accessibility/name", [], { filter: "free access", required: true }),
      R("isVersionOf", "hasVersion", [S("shortName"), S("fullName")]),
    ],
    { required: true }
  ),
]);

export function getLoader(auth) {
  const loader = async ({ params }) => {
    const stage = auth.isCurator ? ["IN_PROGRESS", "RELEASED"] : "RELEASED";
    const tissueSamplePromise = getKGItem(
      "patch clamp recordings detail",
      query,
      params.expId,
      auth,
      stage
    );
    console.log(tissueSamplePromise);
    return { tissueSample: tissueSamplePromise };
  };
  return loader;
}
