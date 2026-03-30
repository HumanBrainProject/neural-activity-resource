import createFetchMock from "vitest-fetch-mock";
import { vi } from "vitest";

const fetchMocker = createFetchMock(vi);

fetchMocker.enableMocks();
fetchMocker.dontMock();

// Stub browser APIs not implemented by jsdom but called by plotly.js at load time
HTMLCanvasElement.prototype.getContext = vi.fn();
URL.createObjectURL = vi.fn();
