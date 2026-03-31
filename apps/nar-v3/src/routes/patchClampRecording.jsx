/*
The "patch clamp recording" route displays metadata about recordings from
single neurons. Each page shows the recordings from one individual neuron.


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
import { Await, useLoaderData } from "react-router";

import { uuidFromUri } from "../utility.js";
import Navigation from "../components/Navigation";
import PatchClampRecordingCard from "../components/PatchClampRecordingCard";
import ProgressIndicator from "../components/ProgressIndicator";

function PatchClamp() {
  const data = useLoaderData();

  return (
    <div id="tissueSample">
      <React.Suspense fallback={<ProgressIndicator />}>
        <Await resolve={data.tissueSample} errorElement={<p>Error loading tissueSample.</p>}>
          {(tissueSample) => {
            return (
              <>
                <Navigation location={["Patch Clamp Recordings", uuidFromUri(tissueSample.id)]} />
                <PatchClampRecordingCard tissueSample={tissueSample} />
              </>
            );
          }}
        </Await>
      </React.Suspense>
    </div>
  );
}

export default PatchClamp;
