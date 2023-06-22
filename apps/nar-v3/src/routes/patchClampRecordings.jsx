import React from "react";
import { Await, defer, useLoaderData } from "react-router-dom";

import { buildKGQuery, simpleProperty as S, linkProperty as L, reverseLinkProperty as R } from "../queries";
import { datastore } from "../datastore";
//import Navigation from "../components/Navigation";
import PatchClampRecordingList from "../components/PatchClampRecordingList";
import ProgressIndicator from "../components/ProgressIndicator";


const query = buildKGQuery(
  "core/TissueSample",
  [
      S("@id"),
      S("lookupLabel"),
      R("belongsToDataset",
        "studiedSpecimen",
        [L("accessibility/name", [], {filter: "free access", required: true})],
        {required: true})
  ]
)

export async function loader() {
  const tissueSamplesPromise = datastore.getKGData("patch clamp recordings summary", query);

  console.log(tissueSamplesPromise);
  return defer({ tissueSamples: tissueSamplesPromise });
}

function PatchClampIndex(props) {
  const data = useLoaderData();

  return (
    <div id="tissueSamples">
      {/* <Navigation location={["Patch Clamp Recordings"]} /> */}

      <React.Suspense fallback={<ProgressIndicator />}>
        <Await
          resolve={data.tissueSamples}
          errorElement={<p>Error loading tissueSamples.</p>}
        >
          {(tissueSamples) => <PatchClampRecordingList tissueSamples={tissueSamples} />}
        </Await>
      </React.Suspense>
    </div>
  );
}

export default PatchClampIndex;
