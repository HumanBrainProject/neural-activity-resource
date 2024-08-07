/*
The datasets route displays a table with summary information
from all suitable "neural activity" datasets in the EBRAINS Knowledge Graph.


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

import { getKGData } from "../datastore";
import Navigation from "../components/Navigation";
import DatasetList from "../components/DatasetList";
import ProgressIndicator from "../components/ProgressIndicator";
import { ephysDatasetsQuery } from "./queryLibrary";

export function getLoader(auth) {
  const loader = async () => {
    const datasetsPromise = getKGData("datasets summary", ephysDatasetsQuery, auth);
    console.log(datasetsPromise);
    return defer({ datasets: datasetsPromise });
  };
  return loader;
}

function Datasets() {
  const data = useLoaderData();

  return (
    <div id="datasets">
      <Navigation location={["Datasets"]} />

      <React.Suspense fallback={<ProgressIndicator />}>
        <Await resolve={data.datasets} errorElement={<p>Error loading datasets.</p>}>
          {(datasets) => <DatasetList datasets={datasets} />}
        </Await>
      </React.Suspense>
    </div>
  );
}

export default Datasets;
