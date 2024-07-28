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
