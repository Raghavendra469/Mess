import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ArtistRoutes from "./ArtistRoutes";
import { act } from "react"; // Ensure correct act usage

// Mock child components
jest.mock("../pages/ArtistDashboard", () => () => <div>Artist Dashboard</div>);
jest.mock("../components/dashboard/artistPages/ArtistSummary", () => () => <div>Artist Summary</div>);
jest.mock("../components/dashboard/artistPages/SongListPage", () => () => <div>Song List Page</div>);
jest.mock("../components/dashboard/artistPages/AddSongForm", () => () => <div>Add Song Form</div>);
jest.mock("../components/dashboard/artistPages/DeleteSong", () => () => <div>Delete Song</div>);
jest.mock("../components/dashboard/artistPages/RequestManagerList", () => () => <div>Request Manager List</div>);
jest.mock("../components/dashboard/artistPages/ViewMyManager", () => () => <div>View My Manager</div>);
jest.mock("../components/dashboard/artistPages/updateArtistProfileForm", () => () => <div>Update Artist Profile Form</div>);
jest.mock("../components/commonComponents/UserTransactions", () => () => <div>User Transactions</div>);

describe("ArtistRoutes", () => {
  const renderWithRoute = async (initialRoute) => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/*" element={<ArtistRoutes />} />
          </Routes>
        </MemoryRouter>
      );
    });
  };

  test("renders the Artist Dashboard", async () => {
    await renderWithRoute("/");
    expect(screen.getByText("Artist Dashboard")).toBeInTheDocument();
  });

  test("renders the Artist Summary page", async () => {
    await renderWithRoute("/");
    expect(screen.getByText("Artist Summary")).toBeInTheDocument();
  });

  test("renders Song List Page", async () => {
    await renderWithRoute("/my-songs");
    expect(screen.getByText("Song List Page")).toBeInTheDocument();
  });

  test("renders Add Song Form page", async () => {
    await renderWithRoute("/add-songs");
    expect(screen.getByText("Add Song Form")).toBeInTheDocument();
  });

  test("renders Delete Song page", async () => {
    await renderWithRoute("/delete-songs");
    expect(screen.getByText("Delete Song")).toBeInTheDocument();
  });

  test("renders Request Manager List page", async () => {
    await renderWithRoute("/collaboration");
    expect(screen.getByText("Request Manager List")).toBeInTheDocument();
  });

  test("renders View My Manager page", async () => {
    await renderWithRoute("/view-manager");
    expect(screen.getByText("View My Manager")).toBeInTheDocument();
  });

  test("renders Royalty Transactions page", async () => {
    await renderWithRoute("/royalty-transactions");
    expect(screen.getByText("User Transactions")).toBeInTheDocument();
  });

  test("renders Update Artist Profile Form page", async () => {
    await renderWithRoute("/update-profile");
    expect(screen.getByText("Update Artist Profile Form")).toBeInTheDocument();
  });
});
