import "@testing-library/jest-dom";
import { server } from "./mocks/server";

// Pornim MSW în testele Jest
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());