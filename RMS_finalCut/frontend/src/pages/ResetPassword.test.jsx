import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/AuthServices";
import ResetPassword from "../pages/ResetPassword";
import "@testing-library/jest-dom";


jest.mock("../services/AuthServices", () => ({
  resetPassword: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe("ResetPassword Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ id: "123", token: "fakeToken" });
  });

  test("renders reset password form correctly", () => {
    render(<ResetPassword />, { wrapper: MemoryRouter });

    expect(screen.getByRole("heading", { name: /Reset Password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reset Password/i })).toBeInTheDocument();
  });

  test("shows error when passwords do not match", async () => {
    render(<ResetPassword />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "differentpass" } });
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test("handles successful password reset", async () => {
    resetPassword.mockResolvedValue({ success: true, message: "Password reset successful" });

    render(<ResetPassword />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith("123", "fakeToken", "password123");
      expect(screen.getByText(/Password reset successful/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    }, { timeout: 2500 });
  });

//   test("handles failed password reset", async () => {
//     resetPassword.mockRejectedValueOnce({ message: "Error resetting password" });

//     render(<ResetPassword />, { wrapper: MemoryRouter });

//     fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: "password123" } });
//     fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } });
//     fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

//     await waitFor(() => {
//       expect(resetPassword).toHaveBeenCalledWith("123", "fakeToken", "password123");
//       expect(screen.getByText(/Error resetting password/i)).toBeInTheDocument();
//     });
//   });
});
