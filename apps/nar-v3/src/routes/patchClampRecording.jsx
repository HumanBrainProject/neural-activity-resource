import React from "react";
import { Await, defer, useLoaderData } from "react-router-dom";

import { datastore } from "../datastore";
//import Navigation from "../components/Navigation";
import PatchClampRecordingCard from "../components/PatchClampRecordingCard";
import ProgressIndicator from "../components/ProgressIndicator";


export async function loader({ params }) {
  const tissueSamplePromise = datastore.getPatchClampRecordings({instanceId: params.expId});
  console.log(tissueSamplePromise);
  return defer({ tissueSample: tissueSamplePromise });
}

function PatchClamp(props) {
  const data = useLoaderData();

  return (
    <div id="tissueSample">
      {/* <Navigation location={["Patch Clamp Recordings", {params.expId}]} /> */}

      <React.Suspense fallback={<ProgressIndicator />}>
        <Await
          resolve={data.tissueSample}
          errorElement={<p>Error loading tissueSample.</p>}
        >
          {(tissueSample) => <PatchClampRecordingCard tissueSample={tissueSample[0]} />}
        </Await>
      </React.Suspense>
    </div>
  );
}

export default PatchClamp;
