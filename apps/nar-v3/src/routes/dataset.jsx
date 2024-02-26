import React from "react";
import { Await, defer, useLoaderData } from "react-router-dom";

import { datastore } from "../datastore";
//import Navigation from "../components/Navigation";
import DatasetCard from "../components/DatasetCard";
import ProgressIndicator from "../components/ProgressIndicator";

const query = null;

export async function loader({ params }) {
  const datasetPromise = datastore.getKGItem(
    "datasets detail",
    query,
    params.datasetId
  );
  console.log(datasetPromise);
  return defer({ dataset: datasetPromise });
}

function Dataset(props) {
  const data = useLoaderData();

  return (
    <div id="dataset">
      {/* <Navigation location={["Datasets"]} /> */}

      <React.Suspense fallback={<ProgressIndicator />}>
        <Await
          resolve={data.dataset}
          errorElement={<p>Error loading dataset.</p>}
        >
          {(dataset) => <DatasetCard dataset={dataset} />}
        </Await>
      </React.Suspense>
    </div>
  );
}

export default Dataset;
