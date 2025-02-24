import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { act } from "react";
import ArtistDashboard from "./ArtistDashboard";
import { useAuth } from "../context/authContext";
import "@testing-library/jest-dom";
 
 
// Mock useAuth hook
jest.mock("../context/authContext", () => ({
  useAuth: jest.fn(),
}));
 
// Mock child components
jest.mock("../components/commonComponents/Navbar", () => ({ toggleSidebar }) => (
  <button onClick={toggleSidebar}>Toggle Sidebar</button>
));
jest.mock("../components/dashboard/ArtistSidebar", () => ({ isOpen }) => (
  <div>{isOpen ? "Sidebar Open" : "Sidebar Closed"}</div>
));
 
describe("ArtistDashboard", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: { name: "Artist" } });
  });
 
  it("renders the ArtistDashboard with Navbar and Sidebar", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ArtistDashboard />
        </MemoryRouter>
      );
    });
 
    expect(screen.getByText("Sidebar Closed")).toBeInTheDocument();
    expect(screen.getByText("Toggle Sidebar")).toBeInTheDocument();
  });
 
  it("toggles the sidebar when button is clicked", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ArtistDashboard />
        </MemoryRouter>
      );
    });
 
    const toggleButton = screen.getByText("Toggle Sidebar");
    expect(screen.getByText("Sidebar Closed")).toBeInTheDocument();
 
    await act(async () => {
      fireEvent.click(toggleButton);
    });
 
    expect(screen.getByText("Sidebar Open")).toBeInTheDocument();
  });
}); 