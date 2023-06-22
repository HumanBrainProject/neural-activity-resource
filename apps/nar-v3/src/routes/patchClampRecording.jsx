import React from "react";
import { Await, defer, useLoaderData } from "react-router-dom";

import { buildKGQuery, simpleProperty as S, linkProperty as L, reverseLinkProperty as R } from "../queries";
import { datastore } from "../datastore";
//import Navigation from "../components/Navigation";
import PatchClampRecordingCard from "../components/PatchClampRecordingCard";
import ProgressIndicator from "../components/ProgressIndicator";


const query = buildKGQuery(
    "core/TissueSample",
    [
        S("@id"),
        S("lookupLabel"),
        L("anatomicalLocation", [S("name"), S("@type")], {expectSingle: false}),
        L("biologicalSex/name"),
        L("laterality/name"),
        L("origin", [S("name"), S("@type")]),
        L("species", [
            S("name"),
            S("@type"),
            R("species", "species", [S("name")], {type: "core/Strain"})
        ]),
        L("strain/name"),
        L("type/name"),
        L("studiedState", [
            S("lookupLabel"),
            L("descendedFrom", [
                S("lookupLabel"),
                S("@type"),
                R("isStateOf", "studiedState", [
                    S("lookupLabel"),
                    S("@id"),
                    L("type/name")
                ])
            ]),
            L("age", [
                S("value"),
                S("uncertainty"),
                S("minValue"),
                S("maxValue"),
                L("unit/name"),
                L("minValueUnit/name"),
                L("maxValueUnit/name"),
            ]),
            L("attribute", [S("name"), S("@type")], {expectSingle: false}),
            S("additionalRemarks"),
            L("pathology", [S("name"), S("@type")], {expectSingle: false})
        ],
        {expectSingle: false}),
        R("belongsToDataset", "studiedSpecimen", [
            S("fullName"),
            S("shortName"),
            S("@id"),
            L("technique/name", [], {filter: "patch clamp", expectSingle: false}),
            L("accessibility/name", [], {filter: "free access", required: true}),
            R("isVersionOf", "hasVersion", [S("shortName"), S("fullName")])
        ], {required: true})
    ]
  )

console.log(query);

export async function loader({ params }) {
  const tissueSamplePromise = datastore.getKGItem("patch clamp recordings detail", query, params.expId);
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
          {(tissueSample) => <PatchClampRecordingCard tissueSample={tissueSample} />}
        </Await>
      </React.Suspense>
    </div>
  );
}

export default PatchClamp;
