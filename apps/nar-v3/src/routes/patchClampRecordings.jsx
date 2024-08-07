/*
The "patch clamp recordings" route displays a list of neurons that have been
recorded from using the patch clamp technique.


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

import React from "react";
import { Await, defer, useLoaderData } from "react-router-dom";

import {
  buildKGQuery,
  simpleProperty as S,
  linkProperty as L,
  reverseLinkProperty as R,
} from "../queries";
import { getKGData } from "../datastore";
import Navigation from "../components/Navigation";
import PatchClampRecordingList from "../components/PatchClampRecordingList";
import ProgressIndicator from "../components/ProgressIndicator";

export const query = buildKGQuery("core/TissueSample", [
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
    const tissueSamplesPromise = getKGData("patch clamp recordings summary", query, auth);

    console.log(tissueSamplesPromise);
    return defer({ tissueSamples: tissueSamplesPromise });
  };
  return loader;
}

function PatchClampIndex() {
  const data = useLoaderData();

  return (
    <div id="tissueSamples">
      <Navigation location={["Patch Clamp Recordings"]} />

      <React.Suspense fallback={<ProgressIndicator />}>
        <Await resolve={data.tissueSamples} errorElement={<p>Error loading tissueSamples.</p>}>
          {(tissueSamples) => <PatchClampRecordingList tissueSamples={tissueSamples} />}
        </Await>
      </React.Suspense>
    </div>
  );
}

export default PatchClampIndex;
