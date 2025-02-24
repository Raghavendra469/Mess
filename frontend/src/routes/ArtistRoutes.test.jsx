import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ArtistRoutes from "../routes/ArtistRoutes";

// Utility function to render with routing
const renderWithRoute = (route) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/*" element={<ArtistRoutes />} />
      </Routes>
    </MemoryRouter>
  );
};

test("renders Artist Dashboard with Artist Summary by default", async () => {
  renderWithRoute("/");
  expect(screen.getByText("Artist Dashboard")).toBeInTheDocument();
  expect(await screen.findByText(/artist summary/i)).toBeInTheDocument();
});

test("renders Song List Page", async () => {
  renderWithRoute("/my-songs");
  expect(await screen.findByText(/song list page/i)).toBeInTheDocument();
});

test("renders Add Song Form", async () => {
  renderWithRoute("/add-songs");
  expect(await screen.findByText(/add song form/i)).toBeInTheDocument();
});

test("renders Delete Song", async () => {
  renderWithRoute("/delete-songs");
  expect(await screen.findByText(/delete song/i)).toBeInTheDocument();
});

test("renders Request Manager List", async () => {
  renderWithRoute("/collaboration");
  expect(await screen.findByText(/request manager list/i)).toBeInTheDocument();
});

test("renders View My Manager", async () => {
  renderWithRoute("/view-manager");
  expect(await screen.findByText(/view my manager/i)).toBeInTheDocument();
});

test("renders User Transactions", async () => {
  renderWithRoute("/royalty-transactions");
  expect(await screen.findByText(/user transactions/i)).toBeInTheDocument();
});

test("renders Update Artist Profile Form", async () => {
  renderWithRoute("/update-profile");
  expect(await screen.findByText(/update artist profile form/i)).toBeInTheDocument();
});
