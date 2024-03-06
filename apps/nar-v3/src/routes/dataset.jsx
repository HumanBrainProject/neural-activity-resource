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

const MULTIPLE = { expectSingle: false };

const actorQuery = [
  S("@id"),
  S("@type"),
  S("givenName"),
  S("familyName"),
  S("fullName"),
  S("shortName"),
];

const quantValQuery = [
  S("value"),
  S("minValue"),
  S("maxValue"),
  L("unit/name"),
  L("minValueUnit/name"),
  L("maxValueUnit/name"),
];

const solutionQuery = [
  S("name"),
  S("@id"),
  L(
    "hasPart",
    [
      L("amount", quantValQuery),
      L("chemicalProduct", [S("name"), S("@id"), S("@type")])
    ],
    MULTIPLE
  ),
];

const deviceQuery = L("device", [
  S("lookupLabel"),
  S("name"),
  S("@type"),
  S("internalIdentifier"),
  S("description"),
  L("deviceType/name"),
  L("manufacturer", [S("shortName", S("longName"))]),
]);

const query = buildKGQuery("core/DatasetVersion", [
  S("@id"),
  S("fullName"),
  S("description"),
  S("shortName"),
  S("versionIdentifier"),
  L("ethicsAssessment/name"),
  L("license/shortName"),
  S("releaseDate"),
  L("custodian", actorQuery, MULTIPLE),
  L("author", actorQuery, MULTIPLE),
  R("isVersionOf", "hasVersion", [
    S("fullName"),
    S("description"),
    S("shortName"),
    L("custodian", actorQuery, MULTIPLE),
    L("author", actorQuery, MULTIPLE),
  ]),
  L(
    "studiedSpecimen",
    [
      S("lookupLabel"),
      L("species", [S("name"), L("species/name")]),
      L("biologicalSex/name"),
      L(
        "studiedState",
        [
          S("lookupLabel"),
          L("age", quantValQuery),
          L("ageCategory/name"),
          L("pathology", [S("name")], MULTIPLE),
          R(
            "slicePreparation",
            "input",
            [
              // slice preparation
              S("lookupLabel"),
              S("@type"),
              L(
                "device",
                [
                  // device usage
                  S("lookupLabel"),
                  deviceQuery,
                  L("sliceThickness", quantValQuery),
                  L("slicingPlane/name"),
                ],
                MULTIPLE
              ),
              L("studyTarget/name", [], MULTIPLE),
              L("temperature", [S("value"), L("unit/name")]),
              L("tissueBathSolution", solutionQuery),
              L(
                "output",
                [
                  // slices
                  S("lookupLabel"),
                  S("internalIdentifier"),
                  R("slice", "studiedState", [
                    S("lookupLabel"),
                    S("@type"),
                    S("internalIdentifier"),
                    L("anatomicalLocation", [S("name"), S("@type")], MULTIPLE),
                    L("type/name"),
                  ]),
                  R("cellPatching", "input", [
                    S("lookupLabel"),
                    S("@type"),
                    L("device", [
                      // device usage
                      S("lookupLabel"),
                      deviceQuery,
                      L("pipetteSolution", solutionQuery),
                      L("sealResistance", [
                        L("value", quantValQuery, MULTIPLE),
                      ]),
                      L("seriesResistance", [
                        L("value", quantValQuery, MULTIPLE),
                      ]),
                      L("holdingPotential", [
                        L("value", quantValQuery, MULTIPLE),
                      ]),
                    ], MULTIPLE),
                    L("tissueBathSolution", solutionQuery),
                    L("bathTemperature", quantValQuery),
                    S("description"),
                    L("variation/name"),
                    L("output", [
                      // patched cells
                      S("lookupLabel"),
                      S("@type"),
                      R("cell", "studiedState", [
                        S("internalIdentifier"),
                        L(
                          "anatomicalLocation",
                          [S("name"), S("@type")],
                          MULTIPLE
                        ),
                        L("type/name"),
                      ]),
                      R(
                        "recordingActivity",
                        "input",
                        [
                          S("lookupLabel"),
                          S("@type"),
                          S("description"),
                          S("internalIdentifier"),
                          L("device", [
                            R("metadata", "recordedWith", [
                              S("name"),
                              S("additionalRemarks"),
                              L("samplingFrequency", quantValQuery),
                              L(
                                "channel",
                                [S("internalIdentifier"), L("unit/name")],
                                MULTIPLE
                              ),
                            ]),
                          ]),
                          L(
                            "output",
                            [
                              S("@id"),
                              S("name"),
                              S("IRI"),
                              S("dataType/name"),
                              S("format/name"),
                              L(
                                "hash",
                                [S("algorithm"), S("digest")],
                                MULTIPLE
                              ),
                              L("storageSize", [S("value"), L("unit/name")]),
                            ],
                            MULTIPLE
                          ),
                        ],
                        { type: "ephys/RecordingActivity", expectSingle: false }
                      ),
                      R(
                        "stimulationActivity",
                        "input",
                        [
                          S("lookupLabel"),
                          S("@type"),
                          L(
                            "stimulus",
                            [
                              S("lookupLabel"),
                              S("@type"),
                              S("description"),
                              L("epoch", quantValQuery),
                              S("internalIdentifier"),
                              L("specification", [
                                S("lookupLabel"),
                                S("configuration"),
                              ]),
                            ],
                            MULTIPLE
                          ),
                        ],
                        {
                          type: "stimulation/StimulationActivity",
                          expectSingle: false,
                        }
                      ),
                    ], MULTIPLE),
                  ], MULTIPLE),
                ],
                MULTIPLE
              ),
            ],
            MULTIPLE
          ),
        ],
        MULTIPLE
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

function Dataset() {
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
