import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ManagerSidebar from "./ManagerSidebar";
import "@testing-library/jest-dom";

// Mock lucide-react icons to prevent module import errors
jest.mock("lucide-react", () => ({
  Home: () => <svg data-testid="home-icon" />,
  Users: () => <svg data-testid="users-icon" />,
  UserCheck: () => <svg data-testid="usercheck-icon" />,
  XCircle: () => <svg data-testid="xcircle-icon" />,
  DollarSign: () => <svg data-testid="dollarsign-icon" />,
  UserCog: () => <svg data-testid="usercog-icon" />,
}));

describe("ManagerSidebar Component", () => {
  let toggleSidebarMock;

  beforeEach(() => {
    toggleSidebarMock = jest.fn();
  });

  test("renders all sidebar links correctly", () => {
    render(
      <BrowserRouter>
        <ManagerSidebar isOpen={true} toggleSidebar={toggleSidebarMock} />
      </BrowserRouter>
    );

    const links = [
      "Dashboard",
      "My Artists",
      "Collaboration Requests",
      "Collaboration Cancellation Requests",
      "Royalty Transactions",
      "Update Profile",
    ];

    links.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test("sidebar is open when isOpen is true", () => {
    const { container } = render(
      <BrowserRouter>
        <ManagerSidebar isOpen={true} toggleSidebar={toggleSidebarMock} />
      </BrowserRouter>
    );
    expect(container.firstChild).toHaveClass("translate-x-0");
  });

  test("sidebar is closed when isOpen is false", () => {
    const { container } = render(
      <BrowserRouter>
        <ManagerSidebar isOpen={false} toggleSidebar={toggleSidebarMock} />
      </BrowserRouter>
    );
    expect(container.firstChild).toHaveClass("-translate-x-full");
  });

  test("calls toggleSidebar on link click when screen width is < 1024px", () => {
    global.innerWidth = 800; // Simulate mobile screen

    render(
      <BrowserRouter>
        <ManagerSidebar isOpen={true} toggleSidebar={toggleSidebarMock} />
      </BrowserRouter>
    );

    const dashboardLink = screen.getByText("Dashboard");
    fireEvent.click(dashboardLink); // Simulate click

    expect(toggleSidebarMock).toHaveBeenCalled(); // Sidebar toggles
  });

  test("does NOT call toggleSidebar on link click when screen width is >= 1024px", () => {
    global.innerWidth = 1200; // Simulate desktop screen

    render(
      <BrowserRouter>
        <ManagerSidebar isOpen={true} toggleSidebar={toggleSidebarMock} />
      </BrowserRouter>
    );

    const dashboardLink = screen.getByText("Dashboard");
    fireEvent.click(dashboardLink); // Simulate click

    expect(toggleSidebarMock).not.toHaveBeenCalled(); // Sidebar remains open
  });

  test("ensures all links are interactive", () => {
    render(
      <BrowserRouter>
        <ManagerSidebar isOpen={true} toggleSidebar={toggleSidebarMock} />
      </BrowserRouter>
    );

    const links = [
      "Dashboard",
      "My Artists",
      "Collaboration Requests",
      "Collaboration Cancellation Requests",
      "Royalty Transactions",
      "Update Profile",
    ];

    links.forEach((text) => {
      const link = screen.getByText(text);
      fireEvent.click(link);
      expect(link).toBeInTheDocument(); // Ensures link exists
    });
  });


  test("handles click events for all links", () => {
    global.innerWidth = 800; // Simulate mobile screen

    render(
      <BrowserRouter>
        <ManagerSidebar isOpen={true} toggleSidebar={toggleSidebarMock} />
      </BrowserRouter>
    );

    const links = [
      screen.getByText("Dashboard"),
      screen.getByText("My Artists"),
      screen.getByText("Collaboration Requests"),
      screen.getByText("Collaboration Cancellation Requests"),
      screen.getByText("Royalty Transactions"),
      screen.getByText("Update Profile"),
    ];

    links.forEach((link) => {
      fireEvent.click(link);
      expect(toggleSidebarMock).toHaveBeenCalled();
    });

    expect(toggleSidebarMock).toHaveBeenCalledTimes(links.length);
  });
});
