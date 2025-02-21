import { render, screen } from "@testing-library/react";
import { StrictMode } from "react";
import App from "./App";

// Mock all context providers to ensure they wrap App
jest.mock("./context/authContext.jsx", () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
}));
jest.mock("./context/NotificationContext.jsx", () => ({
  NotificationProvider: ({ children }) => <div data-testid="notification-provider">{children}</div>,
}));
jest.mock("./context/ArtistsManagersContext.jsx", () => ({
  ArtistsManagersProvider: ({ children }) => <div data-testid="artists-managers-provider">{children}</div>,
}));
jest.mock("./context/RoyaltyContext.jsx", () => ({
  RoyaltyProvider: ({ children }) => <div data-testid="royalty-provider">{children}</div>,
}));

describe("Main Component", () => {
  test("renders all providers and App without crashing", () => {
    render(
      <StrictMode>
        <AuthProvider>
          <NotificationProvider>
            <ArtistsManagersProvider>
              <RoyaltyProvider>
                <App />
              </RoyaltyProvider>
            </ArtistsManagersProvider>
          </NotificationProvider>
        </AuthProvider>
      </StrictMode>
    );

    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    expect(screen.getByTestId("notification-provider")).toBeInTheDocument();
    expect(screen.getByTestId("artists-managers-provider")).toBeInTheDocument();
    expect(screen.getByTestId("royalty-provider")).toBeInTheDocument();
  });
});
