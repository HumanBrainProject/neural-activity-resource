import { expect, test } from "vitest";
import { getKGSearchUrl } from "../src/utility";

test("generates KG Search URL as expected", () => {
  expect(
    getKGSearchUrl("https://kg.ebrains.eu/api/instances/2843990a-69dd-468b-a1d3-ff9589b485ae")
  ).toBe("https://search.kg.ebrains.eu/instances/2843990a-69dd-468b-a1d3-ff9589b485ae");
});
