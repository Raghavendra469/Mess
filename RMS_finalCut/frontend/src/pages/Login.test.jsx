import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Router } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { loginUser } from "../services/AuthServices";
import Login from "../pages/Login";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";

jest.mock("../context/authContext", () => ({
  useAuth: jest.fn()
}));

jest.mock("../services/AuthServices", () => ({
  loginUser: jest.fn()
}));

describe("Login Component", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ login: mockLogin });
    jest.clearAllMocks();
  });

  test("renders login form correctly", () => {
    render(<Login />, { wrapper: MemoryRouter });

    expect(screen.getAllByText(/Royalty Management System/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("validates empty form submission", async () => {
    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  test("validates incorrect email and short password", async () => {
    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "invalidemail" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  test("handles successful login for Admin", async () => {
    loginUser.mockResolvedValue({
      success: true,
      token: "fake-token",
      user: { role: "Admin" }
    });

    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "admin@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith("admin@example.com", "password123");
      expect(mockLogin).toHaveBeenCalledWith({ role: "Admin" }, "fake-token");
    });
  });

  test("handles first-time login scenario", async () => {
    loginUser.mockResolvedValue({ loginStatus: { status: "first time login" } });

    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "firsttime@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(history.location.pathname).toBe("/reset-password");
    });
  });

  // test("handles login failure", async () => {
  //   loginUser.mockResolvedValue({
  //     success: false,
  //     message: "Invalid credentials"
  //   });
  
  //   render(<Login />, { wrapper: MemoryRouter });
  
  //   fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "wrong@example.com" } });
  //   fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "wrongpass" } });
  //   fireEvent.click(screen.getByRole("button", { name: /login/i }));
  
  //   await waitFor(() => {
  //     expect(screen.getByText((content) => content.includes("Invalid credentials"))).toBeInTheDocument();
  //   });
  // });
  

  test("stores token in sessionStorage on successful login", async () => {
    loginUser.mockResolvedValue({
      success: true,
      token: "valid-token",
      user: { role: "Admin" }
    });

    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "admin@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem("token")).toBe("valid-token");
    });
  });
});
