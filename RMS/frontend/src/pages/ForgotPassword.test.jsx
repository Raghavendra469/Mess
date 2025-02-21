import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import { forgotPassword } from "../services/AuthServices";

jest.mock("../services/AuthServices", () => ({
  forgotPassword: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("ForgotPassword Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the forgot password form", () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("updates email input on change", () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(emailInput.value).toBe("test@example.com");
  });

  it("displays success message when forgot password request succeeds", async () => {
    forgotPassword.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/password reset email sent/i)).toBeInTheDocument();
    });
  });

  it("displays error message when forgot password request fails", async () => {
    forgotPassword.mockResolvedValue({ success: false });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it("displays loading state when submitting", async () => {
    forgotPassword.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });

    const submitButton = screen.getByRole("button", { name: /send reset link/i });
    fireEvent.click(submitButton);

    expect(submitButton).toHaveTextContent(/sending/i);
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).toHaveTextContent(/send reset link/i);
      expect(submitButton).not.toBeDisabled();
    });
  });
});
