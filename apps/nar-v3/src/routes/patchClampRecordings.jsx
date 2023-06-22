import React from "react";
import { Await, defer, useLoaderData } from "react-router-dom";

import { datastore } from "../datastore";
//import Navigation from "../components/Navigation";
import PatchClampRecordingList from "../components/PatchClampRecordingList";
import ProgressIndicator from "../components/ProgressIndicator";


export async function loader() {
  const tissueSamplesPromise = datastore.getPatchClampRecordings({});
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
