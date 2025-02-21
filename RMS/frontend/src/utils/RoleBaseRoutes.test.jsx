import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RoleBaseRoutes from "./RoleBaseRoutes";
import { useAuth } from "../context/authContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";

jest.mock("../context/authContext", () => ({
  useAuth: jest.fn(),
}));

const renderWithRouter = (ui, initialRoute = "/dashboard") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/dashboard" element={ui} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe("RoleBaseRoutes", () => {
  it("should show loading state when auth is loading", () => {
    useAuth.mockReturnValue({ user: null, loading: true });

    renderWithRouter(
      <RoleBaseRoutes requiredRole={["Admin"]}>
        <div>Protected Content</div>
      </RoleBaseRoutes>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("should redirect to login if user is not authenticated", () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    renderWithRouter(
      <RoleBaseRoutes requiredRole={["Admin"]}>
        <div>Protected Content</div>
      </RoleBaseRoutes>
    );

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  it("should redirect to login if user does not have the required role", () => {
    useAuth.mockReturnValue({ user: { role: "Artist" }, loading: false });

    renderWithRouter(
      <RoleBaseRoutes requiredRole={["Admin"]}>
        <div>Protected Content</div>
      </RoleBaseRoutes>
    );

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  it("should render children if user has the required role", () => {
    useAuth.mockReturnValue({ user: { role: "Admin" }, loading: false });

    renderWithRouter(
      <RoleBaseRoutes requiredRole={["Admin"]}>
        <div>Protected Content</div>
      </RoleBaseRoutes>
    );

    expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
  });

  it("should allow multiple roles access if user has one of the allowed roles", () => {
    useAuth.mockReturnValue({ user: { role: "Manager" }, loading: false });

    renderWithRouter(
      <RoleBaseRoutes requiredRole={["Admin", "Manager"]}>
        <div>Protected Content</div>
      </RoleBaseRoutes>
    );

    expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
  });
});
