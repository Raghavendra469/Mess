import React from "react";
import { createRoot } from "react-dom/client";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { AuthProvider } from "./context/authContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ArtistsManagersProvider } from "./context/ArtistsManagersContext";
import { RoyaltyProvider } from "./context/RoyaltyContext";

// Mock createRoot properly
const mockRender = jest.fn();
const mockUnmount = jest.fn();

jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(() => ({
    render: mockRender,
    unmount: mockUnmount, // Ensure unmount exists
  })),
}));

describe("Root Index File", () => {
  let rootElement;

  beforeEach(() => {
    // Create and append the root element
    rootElement = document.createElement("div");
    rootElement.id = "root";
    document.body.appendChild(rootElement);
  });

  afterEach(() => {
    // Cleanup DOM
    document.getElementById("root")?.remove();
    jest.clearAllMocks();
  });

  test("renders App inside all providers", () => {
    render(
      <AuthProvider>
        <NotificationProvider>
          <ArtistsManagersProvider>
            <RoyaltyProvider>
              <App />
            </RoyaltyProvider>
          </ArtistsManagersProvider>
        </NotificationProvider>
      </AuthProvider>
    );

    // Adjust this based on actual content inside <App />
    expect(screen.getByText(/App Component/i)).toBeInTheDocument();
  });

  test("calls createRoot and renders App correctly", () => {
    require("./main"); // Import the main entry file to trigger execution

    expect(createRoot).toHaveBeenCalledWith(rootElement);
    expect(mockRender).toHaveBeenCalled(); // Ensure render was called
  });
});
