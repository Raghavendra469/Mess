import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import { AuthProvider } from "../context/authContext";
import { loginUser } from "../services/AuthServices";

// Mock loginUser API
jest.mock("../services/AuthServices", () => ({
  loginUser: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Wrapper component to provide context
const AllTheProviders = ({ children }) => (
  <AuthProvider>
    <MemoryRouter>{children}</MemoryRouter>
  </AuthProvider>
);

// Remove explicit `act`, as `render` handles it internally
const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("renders login form correctly", () => {
    customRender(<Login />);

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("*******")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows error when fields are empty", async () => {
    customRender(<Login />);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("shows error for invalid email format", async () => {
    customRender(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: "invalidemail" },
    });
    fireEvent.change(screen.getByPlaceholderText("*******"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  it("handles successful login", async () => {
    loginUser.mockResolvedValue({
      success: true,
      token: "test-token",
      user: { role: "Artist" },
    });

    customRender(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("*******"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem("token")).toBe("test-token");
      expect(mockNavigate).toHaveBeenCalledWith("/artist-dashboard");
    });
  });

  it("redirects to forgot-password on first login", async () => {
    loginUser.mockResolvedValue({
      success: false,
      loginStatus: { status: "first time login" },
    });

    customRender(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("*******"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/forgot-password");
    });
  });

  it("handles failed login attempt", async () => {
    loginUser.mockRejectedValue(new Error("Invalid credentials"));

    customRender(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("*******"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
