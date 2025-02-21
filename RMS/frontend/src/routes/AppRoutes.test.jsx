import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AppRoutes from "./AppRoutes";

// Mock child components
jest.mock("../pages/HomePage", () => () => <div>Home Page</div>);
jest.mock("../pages/Login", () => () => <div>Login Page</div>);
jest.mock("../pages/ForgotPassword", () => () => <div>Forgot Password</div>);
jest.mock("../pages/ResetPassword", () => () => <div>Reset Password</div>);
jest.mock("../utils/PrivateRoutes", () => ({ children }) => <>{children}</>);
jest.mock("../utils/RoleBaseRoutes", () => ({ children }) => <>{children}</>);

// Mock dashboard routes
jest.mock("./AdminRoutes", () => () => <div>Admin Dashboard</div>);
jest.mock("./ArtistRoutes", () => () => <div>Artist Dashboard</div>);
jest.mock("./ManagerRoutes", () => () => <div>Manager Dashboard</div>);

describe("AppRoutes", () => {
  const renderWithRoute = (initialRoute) => {
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test("renders Home Page", () => {
    renderWithRoute("/home-page");
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  test("renders Login Page", () => {
    renderWithRoute("/login");
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  test("renders Forgot Password Page", () => {
    renderWithRoute("/forgot-password");
    expect(screen.getByText("Forgot Password")).toBeInTheDocument();
  });

  test("renders Reset Password Page", () => {
    renderWithRoute("/reset-password/1/sampletoken");
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
  });

  test("renders Admin Dashboard for /admin-dashboard route", () => {
    renderWithRoute("/admin-dashboard");
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  test("renders Artist Dashboard for /artist-dashboard route", () => {
    renderWithRoute("/artist-dashboard");
    expect(screen.getByText("Artist Dashboard")).toBeInTheDocument();
  });

  test("renders Manager Dashboard for /manager-dashboard route", () => {
    renderWithRoute("/manager-dashboard");
    expect(screen.getByText("Manager Dashboard")).toBeInTheDocument();
  });
});
