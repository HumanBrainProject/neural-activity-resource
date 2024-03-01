import React from "react";
import { Await, defer, useLoaderData } from "react-router-dom";

import { buildKGQuery, simpleProperty as S, linkProperty as L, reverseLinkProperty as R } from "../queries";
import { datastore } from "../datastore";
import Navigation from "../components/Navigation";
import DatasetList from "../components/DatasetList";
import ProgressIndicator from "../components/ProgressIndicator";


const query = buildKGQuery(
  "core/DatasetVersion",
  [
      S("@id"),
      S("fullName"),
      S("description"),
      S("shortName"),
      S("versionIdentifier"),
      R("isVersionOf", "hasVersion", [S("fullName"), S("description"), S("shortName")]),
      L("accessibility/name", [], {filter: "free access", required: true}),
      L("experimentalApproach/name", [], {filter: "electrophysiology", required: true})
  ]
)


export async function loader() {
  const datasetsPromise = datastore.getKGData("datasets summary", query);
  console.log(datasetsPromise);
  return defer({ datasets: datasetsPromise });
}

function Datasets(props) {
  const data = useLoaderData();

  return (
    <div id="datasets">
      <Navigation location={["Datasets"]} />

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
