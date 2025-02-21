import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // ✅ Import Jest DOM matchers
import App from "./App";

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>,
}));

// Mock AppRoutes
jest.mock("./routes/AppRoutes", () => () => <div>App Routes</div>);

describe("App Component", () => {
  test("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText("App Routes")).toBeInTheDocument();
  });
});
