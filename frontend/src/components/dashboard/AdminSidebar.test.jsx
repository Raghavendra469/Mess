import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Adjust path accordingly
import "@testing-library/jest-dom";

// Mock toggleSidebar function
const mockToggleSidebar = jest.fn();

describe("AdminSidebar Component", () => {
  test("renders sidebar with correct links", () => {
    render(
      <BrowserRouter>
        <AdminSidebar isOpen={true} toggleSidebar={mockToggleSidebar} />
      </BrowserRouter>
    );

    // Check if all links are present
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Create User Account")).toBeInTheDocument();
    expect(screen.getByText("Manage Users")).toBeInTheDocument();
    expect(screen.getByText("Payments")).toBeInTheDocument();
    expect(screen.getByText("View My Profile")).toBeInTheDocument();
  });

  test("calls toggleSidebar on mobile when a link is clicked", () => {
    global.innerWidth = 768; // Simulate mobile screen
    render(
      <BrowserRouter>
        <AdminSidebar isOpen={true} toggleSidebar={mockToggleSidebar} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Dashboard"));
    expect(mockToggleSidebar).toHaveBeenCalled();
  });

  test("does not call toggleSidebar on desktop when a link is clicked", () => {
    global.innerWidth = 1024; // Simulate desktop screen
    render(
      <BrowserRouter>
        <AdminSidebar isOpen={true} toggleSidebar={mockToggleSidebar} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Dashboard"));
    expect(mockToggleSidebar).not.toHaveBeenCalled();
  });

  test("clicking a link closes sidebar on mobile", () => {
    const toggleSidebarMock = jest.fn();

    // Mock window.innerWidth < 1024 (simulate mobile)
    global.innerWidth = 768;
    window.dispatchEvent(new Event("resize"));

    render(
      <BrowserRouter>
        <AdminSidebar isOpen={true} toggleSidebar={toggleSidebarMock} />
      </BrowserRouter>
    );

    // Click on a link
    fireEvent.click(screen.getByText("Dashboard"));

    // Ensure toggleSidebar is called on mobile
    expect(toggleSidebarMock).toHaveBeenCalled();
  });

  test("clicking a link does NOT close sidebar on desktop", () => {
    const toggleSidebarMock = jest.fn();

    // Mock window.innerWidth >= 1024 (simulate desktop)
    global.innerWidth = 1280;
    window.dispatchEvent(new Event("resize"));

    render(
      <BrowserRouter>
        <AdminSidebar isOpen={true} toggleSidebar={toggleSidebarMock} />
      </BrowserRouter>
    );

    // Click on a link
    fireEvent.click(screen.getByText("Dashboard"));

    // Ensure toggleSidebar is NOT called on desktop
    expect(toggleSidebarMock).not.toHaveBeenCalled();
  });

//   test("sidebar visibility changes based on isOpen prop", () => {
//     const { rerender } = render(
//       <BrowserRouter>
//         <AdminSidebar isOpen={false} toggleSidebar={() => {}} />
//       </BrowserRouter>
//     );

//     // Select the sidebar container using a role-based query
//     const sidebar = screen.getByRole("navigation");

//     // Check if sidebar is hidden
//     expect(sidebar).toHaveClass("-translate-x-full");

//     // Re-render with isOpen = true
//     rerender(
//       <BrowserRouter>
//         <AdminSidebar isOpen={true} toggleSidebar={() => {}} />
//       </BrowserRouter>
//     );

//     // Check if sidebar is visible
//     expect(sidebar).toHaveClass("translate-x-0");
//   });

  test("sidebar has correct styling and structure", () => {
    render(
      <BrowserRouter>
        <AdminSidebar isOpen={true} toggleSidebar={() => {}} />
      </BrowserRouter>
    );

    // Ensure sidebar header is present
    expect(screen.getByText("RMS")).toBeInTheDocument();

    // Ensure sidebar contains correct number of links
    expect(screen.getAllByRole("link").length).toBe(5);
  });

  
});
