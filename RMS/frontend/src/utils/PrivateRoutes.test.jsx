import { render, screen } from "@testing-library/react";
import PrivateRoutes from "./PrivateRoutes";
import { useAuth } from "../context/authContext";

// Mock the auth context
jest.mock("../context/authContext", () => ({
  useAuth: jest.fn()
}));

// Mock Navigate component
jest.mock("react-router-dom", () => ({
  Navigate: jest.fn(() => null)
}));

describe("PrivateRoutes Component", () => {
  // Mock child component
  const MockChild = () => <div>Protected Content</div>;

  test("shows loading state", () => {
    useAuth.mockReturnValue({ loading: true, user: null });
    
    render(<PrivateRoutes><MockChild /></PrivateRoutes>);
    
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders children when user is authenticated", () => {
    useAuth.mockReturnValue({ loading: false, user: { id: 1 } });
    
    render(<PrivateRoutes><MockChild /></PrivateRoutes>);
    
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  test("redirects to login when user is not authenticated", () => {
    const { Navigate } = require("react-router-dom");
    useAuth.mockReturnValue({ loading: false, user: null });
    
    render(<PrivateRoutes><MockChild /></PrivateRoutes>);
    
    expect(Navigate).toHaveBeenCalledWith({ to: "/login" }, {});
  });
});