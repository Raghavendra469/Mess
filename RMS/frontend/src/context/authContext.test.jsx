import { render, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./authContext";
import axios from "axios";

jest.mock("axios");

const TestComponent = () => {
  const { user, loading } = useAuth();
  return <div>{loading ? "Loading..." : user ? user.username : "No user"}</div>;
};

describe("AuthContext", () => {
  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("handles no token case", async () => {
    sessionStorage.removeItem("token");

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(axios.get).not.toHaveBeenCalled();
  });

  it("handles API failure during user verification", async () => {
    sessionStorage.setItem("token", "dummy-token");
    axios.get.mockRejectedValue(new Error("Network error"));

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });

  it("handles failed verification (response.success=false)", async () => {
    sessionStorage.setItem("token", "dummy-token");
    axios.get.mockResolvedValue({ data: { success: false } });

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(axios.get).toHaveBeenCalled();
  });

  it("handles role-based data fetching", async () => {
    sessionStorage.setItem("token", "dummy-token");
    axios.get
      .mockResolvedValueOnce({
        data: { success: true, user: { username: "managerUser", role: "Manager" } },
      })
      .mockResolvedValueOnce({ data: { success: true, user: { details: "Extra Data" } } });

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(axios.get).toHaveBeenCalledTimes(2); // verifyUser + fetchRoleData
  });

  it("handles fetchRoleData error", async () => {
    sessionStorage.setItem("token", "dummy-token");
    axios.get
      .mockResolvedValueOnce({
        data: { success: true, user: { username: "managerUser", role: "Manager" } },
      })
      .mockRejectedValueOnce(new Error("Fetch role data error"));

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});
