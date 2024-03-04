import React from "react";
import { Await, defer, useLoaderData } from "react-router-dom";

import {
  buildKGQuery,
  simpleProperty as S,
  linkProperty as L,
  reverseLinkProperty as R,
} from "../queries";
import { datastore } from "../datastore";
import { uuidFromUri } from "../utility.js";
import Navigation from "../components/Navigation";
import DatasetCard from "../components/DatasetCard";
import ProgressIndicator from "../components/ProgressIndicator";

const actorQuery = [
  S("@id"),
  S("@type"),
  S("givenName"),
  S("familyName"),
  S("fullName"),
  S("shortName")
]

const query = buildKGQuery("core/DatasetVersion", [
  S("@id"),
  S("fullName"),
  S("description"),
  S("shortName"),
  S("versionIdentifier"),
  L("ethicsAssessment/name"),
  L("license/shortName"),
  S("releaseDate"),
  L("custodian", actorQuery, { expectSingle: false }),
  L("author", actorQuery, { expectSingle: false }),
  R("isVersionOf", "hasVersion", [
    S("fullName"),
    S("description"),
    S("shortName"),
    L("custodian", actorQuery, { expectSingle: false }),
    L("author", actorQuery, { expectSingle: false }),
  ]),
  L(
    "studiedSpecimen",
    [
      S("lookupLabel"),
      L("species", [
        S("name"),
        L("species/name")
      ]),
      L("biologicalSex/name"),
      L(
        "studiedState",
        [
          S("lookupLabel"),
          L("age", [
            S("value"),
            S("minValue"),
            S("maxValue"),
            L("unit/name"),
            L("minValueUnit/name"),
            L("maxValueUnit/name"),
          ]),
          L("ageCategory/name"),
          L("pathology", [], { expectSingle: false }),
        ],
        { expectSingle: false }
      ),
    ],
    { type: "core/Subject", expectSingle: false }
  ),
]);

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
      <React.Suspense fallback={<ProgressIndicator />}>
        <Await
          resolve={data.dataset}
          errorElement={<p>Error loading dataset.</p>}
        >
          {(dataset) => {
            console.log("Resolving dataset in dataset.jsx");
            console.log(dataset);
            return (
              <>
                <Navigation
                  location={[
                    "Datasets",
                    uuidFromUri(dataset.id || dataset["@id"]),
                  ]}
                />
                <DatasetCard dataset={dataset} />
              </>
            );
          }}
        </Await>
      </React.Suspense>
    </div>
  );
}

export default Dataset;
