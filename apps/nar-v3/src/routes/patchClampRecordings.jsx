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
