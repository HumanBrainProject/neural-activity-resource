import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../../src/main";
import { authToken } from "../globals";

describe("test with real KG queries", () => {
  // this test requires a valid auth token to have been set in globals.js,
  // since it actually makes KG queries
  test("check home route with KG", { timeout: 10000 }, async () => {
    const auth = {
      token: authToken,
    };
    render(<App auth={auth} />);

    expect(screen.getByText("EBRAINS: Neural Activity Resource (alpha)")).toBeDefined();

    const label = await screen.findByText("Patch clamp recording", {}, { timeout: 10000 });
    expect(label).toBeDefined();

    const datasetCountChip = await screen.findByTitle(
      "All neural activity datasets count",
      {},
      { timeout: 10000 }
    );
    expect(parseInt(datasetCountChip.textContent)).toBeGreaterThan(0);
  });
});
