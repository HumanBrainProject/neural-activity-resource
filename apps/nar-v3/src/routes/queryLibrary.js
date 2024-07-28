import {
  buildKGQuery,
  simpleProperty as S,
  linkProperty as L,
  reverseLinkProperty as R,
} from "../queries";

const MULTIPLE = { expectSingle: false };

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

const basicDatasetProperties = [
  ...minimalDatasetProperties,
  ...[L("ethicsAssessment/name"), L("license/shortName"), S("releaseDate")],
];

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
        L("species", [S("name"), L("species/name")]),
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
                L("temperature", [S("value"), L("unit/name")]),
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
                                L("device", [
                                  R("metadata", "recordedWith", [
                                    S("name"),
                                    S("additionalRemarks"),
                                    L("samplingFrequency", quantValProperties),
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
                                    L("hash", [S("algorithm"), S("digest")], MULTIPLE),
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
                                    L("epoch", quantValProperties),
                                    S("internalIdentifier"),
                                    L("specification", [S("lookupLabel"), S("configuration")]),
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
