import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateUserForm from "./CreateUserForm";
import { createUser } from "../../../services/userService";

jest.mock("../../../services/userService", () => ({
  createUser: jest.fn(),
}));

describe("CreateUserForm", () => {
  beforeEach(() => {
    createUser.mockClear();
  });

  test("renders form fields correctly", () => {
    render(<CreateUserForm />);

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile No/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create User/i })).toBeInTheDocument();
  });

  test("updates input fields correctly", () => {
    render(<CreateUserForm />);

    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    expect(usernameInput.value).toBe("testuser");
  });

  test("submits the form successfully", async () => {
    createUser.mockResolvedValue({ message: "User created successfully!" });

    render(<CreateUserForm />);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "Password123!" } });
    fireEvent.change(screen.getByLabelText(/Mobile No/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "123 Test Street" } });

    fireEvent.click(screen.getByRole("button", { name: /Create User/i }));

    await waitFor(() => {
      expect(createUser).toHaveBeenCalledWith({
        username: "testuser",
        fullName: "Test User",
        email: "test@example.com",
        password: "Password123!",
        mobileNo: "1234567890",
        role: "Artist",
        address: "123 Test Street",
      });

      expect(screen.getByText(/User created successfully!/i)).toBeInTheDocument();
    });
  });

  test("displays error message on API failure", async () => {
    createUser.mockRejectedValue(new Error("Error creating user"));

    render(<CreateUserForm />);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
    fireEvent.click(screen.getByRole("button", { name: /Create User/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error creating user/i)).toBeInTheDocument();
    });
  });
});
