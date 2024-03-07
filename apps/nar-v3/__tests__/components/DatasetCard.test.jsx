import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import DatasetCard from "../../src/components/DatasetCard";

describe("DatasetCard component", () => {
  test("should render without errors", async () => {
    const dataset = {
      "@context": {
        "@vocab": "https://schema.hbp.eu/myQuery/",
      },
      fullName: "",
      description: "",
      id: "https://kg.ebrains.eu/api/instances/ff19f5db-e829-4b85-92eb-fc56991541f1",
      author: [],
      shortName: "An example patch clamp dataset",
      custodian: [],
      isVersionOf: {
        author: [
          {
            givenName: "Stanley",
            shortName: null,
            familyName: "Laurel",
            fullName: null,
            type: ["https://openminds.ebrains.eu/core/Person"],
            id: "https://kg.ebrains.eu/api/instances/a0993482-69dd-468b-a1d3-ff9589b485ae",
          },
          {
            givenName: "Oliver",
            shortName: null,
            familyName: "Hardy",
            fullName: null,
            type: ["https://openminds.ebrains.eu/core/Person"],
            id: "https://kg.ebrains.eu/api/instances/9fe3ffd5-bd56-4aee-979a-6ed15f65d235",
          },
        ],
        shortName: "An example patch clamp dataset",
        custodian: [
          {
            givenName: "Stanley",
            shortName: null,
            familyName: "Laurel",
            fullName: null,
            type: ["https://openminds.ebrains.eu/core/Person"],
            id: "https://kg.ebrains.eu/api/instances/a0993482-69dd-468b-a1d3-ff9589b485ae",
          },
        ],
        fullName: "An example patch clamp dataset, this is the long version of the name",
        description:
          "In this study we analyzed the intrinsic electrophysiological properties of foo in a mouse model of ...",
      },
      releaseDate: "2024-04-01",
      license: "CC BY 4.0",
      ethicsAssessment: "EU compliant, non sensitive",
      versionIdentifier: "v1",
      studiedSpecimen: [
        {
          species: {
            species: null,
            name: "Mus musculus",
          },
          lookupLabel: "sub-42",
          studiedState: [
            {
              age: {
                maxValue: 10,
                minValue: 9,
                maxValueUnit: "month",
                value: null,
                unit: null,
                minValueUnit: "month",
              },
              ageCategory: "adult",
              lookupLabel: "sub-42-state01",
              pathology: [],
              slicePreparation: [
                {
                  tissueBathSolution: {
                    hasPart: [
                      {
                        amount: {
                          maxValue: null,
                          minValue: null,
                          maxValueUnit: null,
                          value: 10,
                          unit: "millimolar",
                          minValueUnit: null,
                        },
                        chemicalProduct: {
                          type: ["https://openminds.ebrains.eu/controlledTerms/MolecularEntity"],
                          name: "magnesium chloride",
                          id: "https://kg.ebrains.eu/api/instances/152ff090-8246-4d0e-a510-b08d49899e77",
                        },
                      },
                      {
                        amount: {
                          maxValue: null,
                          minValue: null,
                          maxValueUnit: null,
                          value: 0.5,
                          unit: "millimolar",
                          minValueUnit: null,
                        },
                        chemicalProduct: {
                          type: ["https://openminds.ebrains.eu/controlledTerms/MolecularEntity"],
                          name: "calcium chloride",
                          id: "https://kg.ebrains.eu/api/instances/470a8fef-5862-4ff7-b1ae-c2c2769d9a7f",
                        },
                      },
                      {
                        amount: {
                          maxValue: null,
                          minValue: null,
                          maxValueUnit: null,
                          value: 2.5,
                          unit: "millimolar",
                          minValueUnit: null,
                        },
                        chemicalProduct: {
                          type: ["https://openminds.ebrains.eu/controlledTerms/MolecularEntity"],
                          name: "potassium chloride",
                          id: "https://kg.ebrains.eu/api/instances/383702b4-52a6-4c72-b70d-b4e66713f39c",
                        },
                      },
                      {
                        amount: {
                          maxValue: null,
                          minValue: null,
                          maxValueUnit: null,
                          value: 234,
                          unit: "millimolar",
                          minValueUnit: null,
                        },
                        chemicalProduct: {
                          type: ["https://openminds.ebrains.eu/controlledTerms/MolecularEntity"],
                          name: "sucrose",
                          id: "https://kg.ebrains.eu/api/instances/096b7e38-c615-4d0a-9578-55ffad5f4fef",
                        },
                      },
                    ],
                    name: "dissecting solution",
                    id: "https://kg.ebrains.eu/api/instances/80739934-f9e6-4045-84ef-03d8d35f6444",
                  },
                  device: [
                    {
                      device: {
                        internalIdentifier: null,
                        lookupLabel: "Vibratome",
                        description: null,
                        deviceType: "vibrating microtome",
                        type: ["https://openminds.ebrains.eu/specimenPrep/SlicingDevice"],
                        manufacturer: {
                          shortName: "Thermo Fisher Scientific",
                        },
                        name: "Microm HM600V",
                      },
                      slicingPlane: "axial plane",
                      sliceThickness: {
                        maxValue: null,
                        minValue: null,
                        maxValueUnit: null,
                        value: 250,
                        unit: "micrometer",
                        minValueUnit: null,
                      },
                      lookupLabel: "Slicing device usage for subject 42",
                    },
                  ],
                  output: [
                    {
                      internalIdentifier: "sub-42_sample_1234",
                      slice: {
                        anatomicalLocation: [
                          {
                            type: [
                              "https://openminds.ebrains.eu/controlledTerms/UBERONParcellation",
                            ],
                            name: "CA1 field of hippocampus",
                          },
                        ],
                        internalIdentifier: "sub-42_sample_1234",
                        lookupLabel: "CA1 slice with reference 1234 from subject 42",
                        type: ["https://openminds.ebrains.eu/core/TissueSample"],
                      },
                      cellPatching: [
                        {
                          tissueBathSolution: {
                            hasPart: [
                              {
                                amount: {
                                  maxValue: null,
                                  minValue: null,
                                  maxValueUnit: null,
                                  value: 26,
                                  unit: "millimolar",
                                  minValueUnit: null,
                                },
                                chemicalProduct: {
                                  type: [
                                    "https://openminds.ebrains.eu/controlledTerms/MolecularEntity",
                                  ],
                                  name: "calcium chloride",
                                  id: "https://kg.ebrains.eu/api/instances/470a8fef-5862-4ff7-b1ae-c2c2769d9a7f",
                                },
                              },
                              {
                                amount: {
                                  maxValue: null,
                                  minValue: null,
                                  maxValueUnit: null,
                                  value: 2.5,
                                  unit: "millimolar",
                                  minValueUnit: null,
                                },
                                chemicalProduct: {
                                  type: [
                                    "https://openminds.ebrains.eu/controlledTerms/MolecularEntity",
                                  ],
                                  name: "potassium chloride",
                                  id: "https://kg.ebrains.eu/api/instances/383702b4-52a6-4c72-b70d-b4e66713f39c",
                                },
                              },
                              {
                                amount: {
                                  maxValue: null,
                                  minValue: null,
                                  maxValueUnit: null,
                                  value: 119,
                                  unit: "millimolar",
                                  minValueUnit: null,
                                },
                                chemicalProduct: {
                                  type: [
                                    "https://openminds.ebrains.eu/controlledTerms/MolecularEntity",
                                  ],
                                  name: "sodium chloride",
                                  id: "https://kg.ebrains.eu/api/instances/1b253db8-f26c-4465-a942-f3237709a8ab",
                                },
                              },
                            ],
                            name: "bath solution (artificial cerebrospinal fluid)",
                            id: "https://kg.ebrains.eu/api/instances/f1520828-8d03-417e-b3a7-81664aac830b",
                          },
                          device: [
                            {
                              device: {
                                internalIdentifier: "sub-42_sample_1234",
                                lookupLabel:
                                  "Pipette used to record cell with reference 1234 from subject 42",
                                description: "fire-polished glass electrodes",
                                deviceType: null,
                                type: ["https://openminds.ebrains.eu/ephys/Pipette"],
                                manufacturer: null,
                                name: "Pipette used to record cell with reference 1234 from subject 42",
                              },
                              seriesResistance: {
                                value: [
                                  {
                                    maxValue: 6,
                                    minValue: 4,
                                    maxValueUnit: null,
                                    value: null,
                                    unit: null,
                                    minValueUnit: "megaohm",
                                  },
                                ],
                              },
                              holdingPotential: {
                                value: [
                                  {
                                    maxValue: null,
                                    minValue: null,
                                    maxValueUnit: null,
                                    value: -65,
                                    unit: "millivolt",
                                    minValueUnit: null,
                                  },
                                ],
                              },
                              lookupLabel:
                                "Usage of pipette used to record cell with reference 1234 from subject 42",
                              sealResistance: {
                                value: [
                                  {
                                    maxValue: null,
                                    minValue: 1,
                                    maxValueUnit: null,
                                    value: null,
                                    unit: null,
                                    minValueUnit: "gigaohm",
                                  },
                                ],
                              },
                              pipetteSolution: {
                                hasPart: [
                                  {
                                    amount: {
                                      maxValue: null,
                                      minValue: null,
                                      maxValueUnit: null,
                                      value: 2,
                                      unit: "millimolar",
                                      minValueUnit: null,
                                    },
                                    chemicalProduct: {
                                      type: [
                                        "https://openminds.ebrains.eu/controlledTerms/MolecularEntity",
                                      ],
                                      name: "magnesium ATP",
                                      id: "https://kg.ebrains.eu/api/instances/8df7e345-d664-4b71-994b-648b02209c6c",
                                    },
                                  },
                                  {
                                    amount: {
                                      maxValue: null,
                                      minValue: null,
                                      maxValueUnit: null,
                                      value: 0.5,
                                      unit: "millimolar",
                                      minValueUnit: null,
                                    },
                                    chemicalProduct: {
                                      type: [
                                        "https://openminds.ebrains.eu/controlledTerms/MolecularEntity",
                                      ],
                                      name: "egtazic acid",
                                      id: "https://kg.ebrains.eu/api/instances/226ca556-0534-49b8-8f79-8ea0d470734e",
                                    },
                                  },
                                  {
                                    amount: {
                                      maxValue: null,
                                      minValue: null,
                                      maxValueUnit: null,
                                      value: 10,
                                      unit: "millimolar",
                                      minValueUnit: null,
                                    },
                                    chemicalProduct: {
                                      type: [
                                        "https://openminds.ebrains.eu/controlledTerms/MolecularEntity",
                                      ],
                                      name: "4-(2-hydroxyethyl)-1-piperazine ethanesulfonic acid",
                                      id: "https://kg.ebrains.eu/api/instances/71aefd46-91b3-444c-a069-c621ec4e7e60",
                                    },
                                  },
                                  {
                                    amount: {
                                      maxValue: null,
                                      minValue: null,
                                      maxValueUnit: null,
                                      value: 2,
                                      unit: "millimolar",
                                      minValueUnit: null,
                                    },
                                    chemicalProduct: {
                                      type: [
                                        "https://openminds.ebrains.eu/controlledTerms/MolecularEntity",
                                      ],
                                      name: "magnesium chloride",
                                      id: "https://kg.ebrains.eu/api/instances/152ff090-8246-4d0e-a510-b08d49899e77",
                                    },
                                  },
                                  {
                                    amount: {
                                      maxValue: null,
                                      minValue: null,
                                      maxValueUnit: null,
                                      value: 5,
                                      unit: "millimolar",
                                      minValueUnit: null,
                                    },
                                    chemicalProduct: {
                                      type: [
                                        "https://openminds.ebrains.eu/controlledTerms/MolecularEntity",
                                      ],
                                      name: "sodium chloride",
                                      id: "https://kg.ebrains.eu/api/instances/1b253db8-f26c-4465-a942-f3237709a8ab",
                                    },
                                  },
                                  {
                                    amount: {
                                      maxValue: null,
                                      minValue: null,
                                      maxValueUnit: null,
                                      value: 135,
                                      unit: "millimolar",
                                      minValueUnit: null,
                                    },
                                    chemicalProduct: {
                                      type: [
                                        "https://openminds.ebrains.eu/controlledTerms/MolecularEntity",
                                      ],
                                      name: "potassium gluconate",
                                      id: "https://kg.ebrains.eu/api/instances/762e5d59-8300-4623-98aa-0167118d4063",
                                    },
                                  },
                                ],
                                name: "pipette solution used in dataset",
                                id: "https://kg.ebrains.eu/api/instances/a19bdadd-12a3-40a1-a82f-78cc9d431783",
                              },
                            },
                          ],
                          bathTemperature: {
                            maxValue: null,
                            minValue: null,
                            maxValueUnit: null,
                            value: 31,
                            unit: "degree Celsius",
                            minValueUnit: null,
                          },
                          output: [
                            {
                              recordingActivity: [
                                {
                                  internalIdentifier: "sub-42_sample_1234",
                                  device: {
                                    metadata: {
                                      channel: [
                                        {
                                          internalIdentifier:
                                            "Membrane potential channel in recording of CA1 pyramidal neuron with reference 1234 from subject 42, stored in file sub-42_sample-1234.abf",
                                          unit: "millivolt",
                                        },
                                      ],
                                      samplingFrequency: {
                                        maxValue: null,
                                        minValue: null,
                                        maxValueUnit: null,
                                        value: 10000,
                                        unit: "hertz",
                                        minValueUnit: null,
                                      },
                                      name: "Metadata about whole-cell patch clamp recording of CA1 pyramidal neuron with reference 1234 from subject 42 stored in file sub-42_sample-1234.abf",
                                      additionalRemarks: "current clamp",
                                    },
                                  },
                                  output: [
                                    {
                                      dataType: [],
                                      storageSize: {
                                        value: 1307648,
                                        unit: "byte",
                                      },
                                      IRI: "https://example.com/sub-42_sample-1234.abf",
                                      format: [],
                                      name: "sub-42_sample-1234.abf",
                                      hash: [
                                        {
                                          digest: "11ef1742029bcca0c12c428d4c9e8a6d",
                                          algorithm: "MD5",
                                        },
                                      ],
                                      id: "https://kg.ebrains.eu/api/instances/03edaf5e-8fee-4e4d-a674-862c5af916b6",
                                    },
                                  ],
                                  lookupLabel:
                                    "Whole-cell patch clamp recording of CA1 pyramidal neuron with reference 1234 from subject 42",
                                  description:
                                    "Signals were collected and stored using a Digidata 9441 B converter and pCLAMP 99.9 software (Molecular Devices, Sunnyvale, CA, United States)",
                                  type: ["https://openminds.ebrains.eu/ephys/RecordingActivity"],
                                },
                              ],
                              lookupLabel:
                                "Patched CA1 pyramidal neuron with reference 1234 from subject 42",
                              type: ["https://openminds.ebrains.eu/core/TissueSampleState"],
                              cell: {
                                anatomicalLocation: [
                                  {
                                    type: ["https://openminds.ebrains.eu/controlledTerms/CellType"],
                                    name: "hippocampus CA1 pyramidal neuron",
                                  },
                                  {
                                    type: [
                                      "https://openminds.ebrains.eu/controlledTerms/UBERONParcellation",
                                    ],
                                    name: "CA1 field of hippocampus",
                                  },
                                ],
                                internalIdentifier: "sub-42_sample_1234",
                                type: "single cell",
                              },
                              stimulationActivity: [
                                {
                                  lookupLabel:
                                    "Step-current stimulus to CA1 pyramidal neuron with reference 1234 from subject 42",
                                  type: [
                                    "https://openminds.ebrains.eu/stimulation/StimulationActivity",
                                  ],
                                  stimulus: [
                                    {
                                      internalIdentifier: "square_pulse_sequence",
                                      epoch: {
                                        maxValue: null,
                                        minValue: null,
                                        maxValueUnit: null,
                                        value: 5000,
                                        unit: "millisecond",
                                        minValueUnit: null,
                                      },
                                      lookupLabel:
                                        "Step-current stimulus with 400 ms pulses of increased intensity in steps of 50 pA (from -200 to 400 pA), separated by 5000 ms.",
                                      description:
                                        "Step-current stimulus with 400 ms pulses of increased intensity in steps of 50 pA (from -200 to 400 pA), separated by 5000 ms.",
                                      type: [
                                        "https://openminds.ebrains.eu/stimulation/EphysStimulus",
                                      ],
                                      specification: {
                                        lookupLabel:
                                          "Step-current stimulus with 400 ms pulses of increased intensity in steps of 50 pA (from -200 to 400 pA), separated by 5000 ms.",
                                        configuration:
                                          '{"onset": 88.2, "duration": 400, "interval": 5000, "amplitudes": [-200, -150, -100, -50, 0, 50, 100, 150, 200, 250, 300, 350, 400], "time_units": "millisecond", "amplitude_units": "picoamp"}',
                                      },
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                          lookupLabel:
                            "Patching of CA1 pyramidal neuron with reference 1234 from subject 42",
                          description:
                            "Slices were visualized on an upright microscope with IR-DIC illumination and epi-fluorescence (Scientifica Ltd, Uckfield, United Kingdom)",
                          type: ["https://openminds.ebrains.eu/ephys/CellPatching"],
                          variation: "whole-cell patch",
                        },
                      ],
                      lookupLabel:
                        "CA1 slice with reference 1234 from subject 42, following slicing",
                    },
                  ],
                  studyTarget: ["CA1 field of hippocampus"],
                  lookupLabel: "Slice preparation from dorsal hippocampus of subject 42",
                  temperature: {
                    value: 0,
                    unit: "degree Celsius",
                  },
                  type: ["https://openminds.ebrains.eu/specimenPrep/TissueSampleSlicing"],
                },
              ],
            },
          ],
          biologicalSex: "male",
        },
      ],
    };

    render(<DatasetCard dataset={dataset} />);

    expect(screen.getByText(/An example patch clamp dataset/i)).toBeInTheDocument();
  });
});
