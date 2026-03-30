import { describe, expect, test } from "vitest";
import { getKGSearchUrl, mergeItems } from "../src/utility";
import inProgressResult from "./fixtures/kg_result_in_progress.json";
import releasedResult from "./fixtures/kg_result_released.json";

test("generates EBRAINS Search URL as expected", () => {
  expect(
    getKGSearchUrl("https://kg.ebrains.eu/api/instances/2843990a-69dd-468b-a1d3-ff9589b485ae")
  ).toBe("https://search.kg.ebrains.eu/instances/2843990a-69dd-468b-a1d3-ff9589b485ae");
});

describe("mergeItems", () => {
  const inProgress = inProgressResult.data[0];
  const released = releasedResult.data[0];
  const merged = mergeItems(inProgress, released);

  test("preserves top-level fields from IN_PROGRESS", () => {
    expect(merged.id).toBe(inProgress.id);
    expect(merged.shortName).toBe(inProgress.shortName);
    expect(merged.versionIdentifier).toBe(inProgress.versionIdentifier);
  });

  test("preserves all studiedSpecimen entries", () => {
    expect(merged.studiedSpecimen).toHaveLength(inProgress.studiedSpecimen.length);
  });

  test("each studiedSpecimen has studiedState", () => {
    for (const specimen of merged.studiedSpecimen) {
      expect(specimen.studiedState.length).toBeGreaterThan(0);
    }
  });

  test("each studiedState has slicePreparation", () => {
    for (const specimen of merged.studiedSpecimen) {
      for (const state of specimen.studiedState) {
        expect(state.slicePreparation.length).toBeGreaterThan(0);
      }
    }
  });

  test("preserves string values in type arrays", () => {
    // type arrays are arrays of URL strings; merging must not corrupt them into
    // character-indexed objects via object spread of a string
    const slicePrep =
      merged.studiedSpecimen[0].studiedState[0].slicePreparation[0];
    expect(typeof slicePrep.type[0]).toBe("string");
  });

  test("fills empty cellPatching arrays from RELEASED", () => {
    // IN_PROGRESS has cellPatching=[] for all outputs; RELEASED has cellPatching=[1 item]
    for (const specimen of merged.studiedSpecimen) {
      for (const state of specimen.studiedState) {
        for (const slicePrep of state.slicePreparation) {
          for (const output of slicePrep.output) {
            expect(
              output.cellPatching.length,
              `cellPatching empty for output: ${output.lookupLabel}`
            ).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});
