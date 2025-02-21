import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPassword from "./ResetPassword";
import { MemoryRouter, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/AuthServices";

// Mock react-router hooks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

// Mock resetPassword service
jest.mock("../services/AuthServices", () => ({
  resetPassword: jest.fn(),
}));

const mockNavigate = jest.fn();

const renderWithProviders = () => {
  return render(
    <MemoryRouter>
      <ResetPassword />
    </MemoryRouter>
  );
};

describe("ResetPassword Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ id: "123", token: "token123" });

    renderWithProviders();
  });

  it("renders ResetPassword component correctly", () => {
    expect(screen.getByText(/reset password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter new password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm new password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  it("shows validation error for weak password", async () => {
    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: "pass" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: "pass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters long/i)).toBeInTheDocument();
    });
  });

  it("shows error when passwords do not match", async () => {
    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: "DifferentPass123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("calls resetPassword API and navigates on success", async () => {
    resetPassword.mockResolvedValueOnce("Success");

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: "Password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith("123", "token123", "Password123");
      expect(screen.getByText(/password reset successful/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("displays error on API failure", async () => {
    resetPassword.mockRejectedValueOnce(new Error("Reset failed"));

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: "Password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/reset failed/i)).toBeInTheDocument();
    });
  });
});
