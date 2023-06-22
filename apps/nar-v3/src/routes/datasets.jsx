import React from "react";
import { Await, defer, useLoaderData } from "react-router-dom";

import { datastore } from "../datastore";
//import Navigation from "../components/Navigation";
import DatasetList from "../components/DatasetList";
import ProgressIndicator from "../components/ProgressIndicator";


export async function loader() {
  const datasetsPromise = datastore.getDatasets({});
  console.log(datasetsPromise);
  return defer({ datasets: datasetsPromise });
}

function Datasets(props) {
  const data = useLoaderData();

  return (
    <div id="datasets">
      {/* <Navigation location={["Datasets"]} /> */}

      <React.Suspense fallback={<ProgressIndicator />}>
        <Await
          resolve={data.datasets}
          errorElement={<p>Error loading datasets.</p>}
        >
          {(datasets) => <DatasetList datasets={datasets} />}
        </Await>
      </React.Suspense>
    </div>
  );
}

export default Datasets;
