import { render, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./authContext";
import axios from "axios";
import { act } from "react";

jest.mock("axios");

const TestComponent = () => {
  const { user, userData, login, logout, loading, setUserData } = useAuth();

  return (
    <div>
      <p data-testid="user">{user ? user.username : "No User"}</p>
      <p data-testid="user-data">{userData ? userData.role : "No Data"}</p>
      <p data-testid="loading">{loading ? "Loading..." : "Loaded"}</p>
      <button onClick={() => login({ username: "testUser", role: "Manager" }, "fake-token")}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => setUserData({ role: "Updated Role" })}>Update Data</button>
    </div>
  );
};

describe("AuthContext", () => {
  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("renders and verifies user on mount", async () => {
    sessionStorage.setItem("token", "fake-token");
    axios.get.mockResolvedValueOnce({ data: { success: true, user: { username: "testUser", role: "Manager" } } });
    axios.get.mockResolvedValueOnce({ data: { success: true, user: { role: "Manager" } } });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(getByTestId("user").textContent).toBe("testUser"));
    expect(getByTestId("loading").textContent).toBe("Loaded");
  });

  it("handles login correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, user: { username: "testUser", role: "Manager" } } });
    axios.get.mockResolvedValueOnce({ data: { success: true, user: { role: "Manager" } } });

    const { getByText, getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      getByText("Login").click();
    });

    await waitFor(() => expect(getByTestId("user").textContent).toBe("testUser"));
    expect(sessionStorage.getItem("token")).toBe("fake-token");
  });

  it("handles logout correctly", async () => {
    sessionStorage.setItem("token", "fake-token");
    const { getByText, getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      getByText("Logout").click();
    });

    await waitFor(() => expect(getByTestId("user").textContent).toBe("No User"));
    expect(sessionStorage.getItem("token")).toBeNull();
  });

  it("handles failed verification", async () => {
    sessionStorage.setItem("token", "fake-token");
    axios.get.mockRejectedValueOnce(new Error("Unauthorized"));

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(getByTestId("user").textContent).toBe("No User"));
  });

  it("updates userData correctly", async () => {
    const { getByText, getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      getByText("Update Data").click();
    });

    await waitFor(() => expect(getByTestId("user-data").textContent).toBe("Updated Role"));
  });
});