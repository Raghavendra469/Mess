import axios from "axios";
import { loginUser, resetPassword, forgotPassword } from "./AuthServices";

jest.mock("axios");

describe("AuthServices", () => {
  const API_URL = "http://localhost:3000/api/auth";

  test("loginUser makes a POST request and returns data", async () => {
    const mockData = { token: "123abc", user: { id: 1, email: "test@example.com" } };
    axios.post.mockResolvedValue({ data: mockData });

    const result = await loginUser("test@example.com", "password123");

    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/login`, { email: "test@example.com", password: "password123" });
    expect(result).toEqual(mockData);
  });

  test("loginUser throws specific error when server returns an error response", async () => {
    axios.post.mockRejectedValue({ response: { data: { error: "Invalid credentials" } } });

    await expect(loginUser("test@example.com", "wrongpassword")).rejects.toBe("Invalid credentials");
  });

  test("loginUser throws default error when no error response", async () => {
    axios.post.mockRejectedValue({});

    await expect(loginUser("test@example.com", "password123")).rejects.toBe("Server Error");
  });

  test("resetPassword makes a POST request and returns data", async () => {
    axios.post.mockResolvedValue({ data: { message: "Password reset successful" } });

    const result = await resetPassword("userId123", "resetToken", "newpassword");

    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/reset-password/userId123/resetToken`, { password: "newpassword" });
    expect(result).toEqual({ message: "Password reset successful" });
  });

  test("resetPassword throws specific error when server returns an error response", async () => {
    axios.post.mockRejectedValue({ response: { data: { message: "Invalid token" } } });

    await expect(resetPassword("userId123", "resetToken", "newpassword")).rejects.toBe("Invalid token");
  });

  test("resetPassword throws default error when response is missing message", async () => {
    axios.post.mockRejectedValue({ response: {} });

    await expect(resetPassword("userId123", "resetToken", "newpassword"))
      .rejects.toBe("Server Error. Please try again later.");
  });

  test("forgotPassword makes a POST request and returns data", async () => {
    axios.post.mockResolvedValue({ data: { message: "Reset email sent" } });

    const result = await forgotPassword("test@example.com");

    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/forgot-password`, { email: "test@example.com" });
    expect(result).toEqual({ message: "Reset email sent" });
  });

  test("forgotPassword throws specific error when server returns an error response", async () => {
    axios.post.mockRejectedValue({ response: { data: { message: "Email not found" } } });

    await expect(forgotPassword("test@example.com")).rejects.toBe("Email not found");
  });

  test("forgotPassword throws default error when response structure is unexpected", async () => {
    axios.post.mockRejectedValue(new Error("Network Error"));

    await expect(forgotPassword("test@example.com"))
      .rejects.toBe("Server error. Please try again later.");
  });
});
