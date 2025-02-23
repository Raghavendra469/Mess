import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/AuthServices";
import ForgotPassword from "../pages/ForgotPassword";
import "@testing-library/jest-dom";

jest.mock("../services/AuthServices", () => ({
  forgotPassword: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("ForgotPassword Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders Forgot Password form correctly", () => {
    render(<ForgotPassword />, { wrapper: MemoryRouter });

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Send Reset Link/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Back to Login/i })
    ).toBeInTheDocument();
  });

//   test("displays error when email is invalid", async () => {
//     render(<ForgotPassword />, { wrapper: MemoryRouter });

//     fireEvent.change(screen.getByLabelText(/Email Address/i), {
//       target: { value: "invalid-email" },
//     });
//     fireEvent.click(screen.getByRole("button", { name: /Send Reset Link/i }));

//     await waitFor(() => {
//       expect(screen.queryByText(/invalid email/i)).not.toBeNull();
//     });
//   });

  test("handles successful password reset request", async () => {
    forgotPassword.mockResolvedValue({ success: true });

    render(<ForgotPassword />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Send Reset Link/i }));

    await waitFor(() => {
      expect(screen.queryByText(/password reset email sent/i)).not.toBeNull();
    });
  });

//   test("handles failed password reset request", async () => {
//     forgotPassword.mockRejectedValue({ message: "Error sending reset link" });

//     render(<ForgotPassword />, { wrapper: MemoryRouter });

//     fireEvent.change(screen.getByLabelText(/Email Address/i), {
//       target: { value: "test@example.com" },
//     });
//     fireEvent.click(screen.getByRole("button", { name: /Send Reset Link/i }));

//     await waitFor(() => {
//       expect(screen.queryByText(/Error sending reset link/i)).not.toBeNull();
//     });
//   });

  test("navigates back to login page when 'Back to Login' is clicked", () => {
    render(<ForgotPassword />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByRole("button", { name: /Back to Login/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
