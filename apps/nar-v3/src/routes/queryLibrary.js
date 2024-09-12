/*
This file contains a library of queries for the KG Core API of the
EBRAINS Knowledge Graph.

These queries (which have the form of JSON-LD documents) are built using
an internal API provided by queries.js:
  simpleProperty ("S") - for metadata with simple datatypes, such as strings, numbers
  linkProperty ("L") - for traversing forward links in the graph
  reverseLinkProperty ("R") - for traversing backward links in the graph

The queries are used by the functions in datastore.js to retrieve data from the KG.


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

import {
  buildKGQuery,
  simpleProperty as S,
  linkProperty as L,
  reverseLinkProperty as R,
} from "../queries";

const MULTIPLE = { expectSingle: false };

// Define some lists of properties that are used in multiple queries,
// and/or in multiple places in a single query.

const actorProperties = [
  S("@id"),
  S("@type"),
  S("givenName"),
  S("familyName"),
  S("fullName"),
  S("shortName"),
];

const quantValProperties = [
  S("value"),
  S("minValue"),
  S("maxValue"),
  L("unit/name"),
  L("minValueUnit/name"),
  L("maxValueUnit/name"),
];

const controlledTermProperties = [
  S("name"),
  S("@type"),
  S("definition"),
  S("description"),
  S("interlexIdentifier"),
  S("knowledgeSpaceLink"),
  S("preferredOntologyIdentifier"),
];

const solutionProperties = [
  S("name"),
  S("@id"),
  S("additionalRemarks"),
  L(
    "hasPart",
    [L("amount", quantValProperties), L("chemicalProduct", [S("name"), S("@id"), S("@type")])],
    MULTIPLE
  ),
];

const deviceProperty = L("device", [
  S("lookupLabel"),
  S("name"),
  S("@type"),
  S("internalIdentifier"),
  S("description"),
  L("material/name"),
  L("deviceType", controlledTermProperties),
  L("manufacturer", [S("shortName", S("longName"))]),
]);

const minimalDatasetProperties = [
  S("@id"),
  S("fullName"),
  S("description"),
  S("shortName"),
  S("versionIdentifier"),
  L("custodian", actorProperties, MULTIPLE),
  L("author", actorProperties, MULTIPLE),
  R("isVersionOf", "hasVersion", [
    S("fullName"),
    S("description"),
    S("shortName"),
    L("custodian", actorProperties, MULTIPLE),
    L("author", actorProperties, MULTIPLE),
  ]),
  L("technique/name", [], MULTIPLE),
];

const fileProperties = [
  S("@id"),
  S("name"),
  S("IRI"),
  S("dataType/name"),
  S("format/name"),
  L("hash", [S("algorithm"), S("digest")], MULTIPLE),
  L("storageSize", [S("value"), L("unit/name")]),
];

const basicDatasetProperties = [
  ...minimalDatasetProperties,
  ...[L("ethicsAssessment/name"), L("license/shortName"), S("releaseDate")],
];

// The library of pre-defined queries

const ephysDatasetsQuery = buildKGQuery("core/DatasetVersion", [
  ...minimalDatasetProperties,
  ...[
    L("accessibility/name", [], { filter: "free access", required: true }),
    L("experimentalApproach/name", [], { filter: "electrophysiology", required: true }),
    L("studiedSpecimen", [S("lookupLabel")], { type: "core/Subject", expectSingle: false }),
    R("activities", "isPartOf", [S("@id"), S("@type")], MULTIPLE),
  ],
]);

const techniquesQuery = buildKGQuery("core/DatasetVersion", [L("technique/name", [], MULTIPLE)]);

const basicDatasetQuery = buildKGQuery("core/DatasetVersion", [
  ...basicDatasetProperties,
  ...[
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
            L("age", quantValProperties),
            L("ageCategory/name"),
            L("pathology", [S("name")], MULTIPLE),
          ],
          MULTIPLE
        ),
      ],
      { type: "core/Subject", expectSingle: false }
    ),
  ],
]);

const patchClampDatasetQuery = buildKGQuery("core/DatasetVersion", [
  ...basicDatasetProperties,
  ...[
    L(
      "studiedSpecimen",
      [
        S("lookupLabel"),
        L("species", [...controlledTermProperties, ...[L("species/name")]]),
        L("biologicalSex/name"),
        L(
          "studiedState",
          [
            S("lookupLabel"),
            L("age", quantValProperties),
            L("ageCategory/name"),
            L("pathology", [S("name")], MULTIPLE),
            R(
              "slicePreparation",
              "input",
              [
                // slice preparation
                S("lookupLabel"),
                S("@type"),
                S("description"),
                L(
                  "device",
                  [
                    // device usage
                    S("lookupLabel"),
                    deviceProperty,
                    L("sliceThickness", quantValProperties),
                    L("slicingPlane", controlledTermProperties),
                    L("slicingAngle", quantValProperties),
                  ],
                  MULTIPLE
                ),
                L("studyTarget", controlledTermProperties, MULTIPLE),
                L("temperature", quantValProperties),
                L("tissueBathSolution", solutionProperties),
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
                      L("anatomicalLocation", controlledTermProperties, MULTIPLE),
                      L("type/name"),
                    ]),
                    R(
                      "cellPatching",
                      "input",
                      [
                        S("lookupLabel"),
                        S("@type"),
                        L(
                          "device",
                          [
                            // device usage
                            S("lookupLabel"),
                            deviceProperty,
                            L("pipetteSolution", solutionProperties),
                            L("sealResistance", [L("value", quantValProperties, MULTIPLE)]),
                            L("seriesResistance", [L("value", quantValProperties, MULTIPLE)]),
                            L("holdingPotential", [L("value", quantValProperties, MULTIPLE)]),
                            L("liquidJunctionPotential", [L("value", quantValProperties, MULTIPLE)]),
                          ],
                          MULTIPLE
                        ),
                        L("tissueBathSolution", solutionProperties),
                        L("bathTemperature", quantValProperties),
                        S("description"),
                        L("variation", controlledTermProperties),
                        L(
                          "output",
                          [
                            // patched cells
                            S("lookupLabel"),
                            S("@type"),
                            R("cell", "studiedState", [
                              S("internalIdentifier"),
                              // todo: handle the case where anatomicalLocation is a ParcellationEntityVersion
                              L("anatomicalLocation", controlledTermProperties, MULTIPLE),
                              L("origin", controlledTermProperties),
                            ]),
                            R(
                              "recordingActivity",
                              "input",
                              [
                                S("lookupLabel"),
                                S("@type"),
                                S("description"),
                                S("internalIdentifier"),
                                L("output", fileProperties, MULTIPLE),
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
                                    L("epoch", quantValProperties),
                                    S("internalIdentifier"),
                                    L("specification", [S("lookupLabel"), S("configuration")]),
                                  ],
                                  MULTIPLE
                                ),
                                L(
                                  "output",
                                  [
                                    ...fileProperties,
                                    ...[
                                      R("metadata", "dataLocation", [
                                        S("name"),
                                        S("additionalRemarks"),
                                        L("samplingFrequency", quantValProperties),
                                        L(
                                          "channel",
                                          [S("internalIdentifier"), L("unit/name")],
                                          MULTIPLE
                                        ),
                                      ]),
                                    ],
                                  ],
                                  MULTIPLE
                                ),
                              ],
                              {
                                type: "stimulation/StimulationActivity",
                                expectSingle: false,
                              }
                            ),
                          ],
                          MULTIPLE
                        ),
                      ],
                      MULTIPLE
                    ),
                  ],
                  MULTIPLE
                ),
                L("variation/name"),
              ],
              MULTIPLE
            ),
          ],
          MULTIPLE
        ),
      ],
      { type: "core/Subject", expectSingle: false }
    ),
  ],
]);

export { ephysDatasetsQuery, techniquesQuery, basicDatasetQuery, patchClampDatasetQuery };
