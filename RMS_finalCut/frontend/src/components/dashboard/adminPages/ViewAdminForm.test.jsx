import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ViewAdminForm from "./ViewAdminForm";
import { useAuth } from "../../../context/authContext";
 
// Mock the useAuth context
jest.mock("../../../context/authContext");
 
describe("ViewAdminForm Component", () => {
  test("renders without crashing and displays admin details", async () => {
    const mockUser = { username: "admin_user", email: "admin@example.com" };
    useAuth.mockReturnValue({ user: mockUser });
 
    render(<ViewAdminForm />);
 
    expect(screen.getByText("Admin Profile")).toBeInTheDocument();
    expect(screen.getByText("User Name")).toBeInTheDocument();
    expect(screen.getByText("admin_user")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("admin@example.com")).toBeInTheDocument();
  });
});
 
 