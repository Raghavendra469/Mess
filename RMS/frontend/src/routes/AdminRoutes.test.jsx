import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import { act } from "react"; // Ensure correct act usage

// Mock child components
jest.mock("../pages/AdminDashboard", () => () => <div>Admin Dashboard</div>);
jest.mock("../components/dashboard/adminPages/AdminSummary", () => () => <div>Admin Summary</div>);
jest.mock("../components/dashboard/adminPages/CreateUserForm", () => () => <div>Create User Form</div>);
jest.mock("../components/dashboard/adminPages/DeleteUserForm", () => () => <div>Delete User Form</div>);
jest.mock("../components/dashboard/adminPages/ViewAdminForm", () => () => <div>View Profile</div>);
jest.mock("../components/dashboard/adminPages/AdminPayments", () => () => <div>Admin Payments</div>);

describe("AdminRoutes", () => {
  const renderWithRoute = (initialRoute) => {
    return act(() => {
      render(
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/*" element={<AdminRoutes />} />
          </Routes>
        </MemoryRouter>
      );
    });
  };

  test("renders the Admin Dashboard", async () => {
    await renderWithRoute("/");
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  test("renders the Admin Summary page", async () => {
    await renderWithRoute("/");
    expect(screen.getByText("Admin Summary")).toBeInTheDocument();
  });

  test("renders Create User Form page", async () => {
    await renderWithRoute("/create-user-account");
    expect(screen.getByText("Create User Form")).toBeInTheDocument();
  });

  test("renders Delete User Form page", async () => {
    await renderWithRoute("/delete-users");
    expect(screen.getByText("Delete User Form")).toBeInTheDocument();
  });

  test("renders Admin Payments page", async () => {
    await renderWithRoute("/payments");
    expect(screen.getByText("Admin Payments")).toBeInTheDocument();
  });

  test("renders View Profile page", async () => {
    await renderWithRoute("/view-profile");
    expect(screen.getByText("View Profile")).toBeInTheDocument();
  });
});
