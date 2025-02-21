import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ArtistTable from "./ArtistTable";
import "@testing-library/jest-dom";

describe("ArtistTable Component", () => {
    const mockArtists = [
        { fullName: "John Doe", totalStreams: 50000, fullRoyalty: 1000 },
        { fullName: "Alice Smith", totalStreams: 70000, fullRoyalty: 1500 },
        { fullName: "Bob Brown", totalStreams: 30000, fullRoyalty: 500 },
    ];

    test("renders correctly with artist data", () => {
        render(<ArtistTable artists={mockArtists} />);
        expect(screen.getByText("All Artists")).toBeInTheDocument();
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Alice Smith")).toBeInTheDocument();
        expect(screen.getByText("Bob Brown")).toBeInTheDocument();
    });

    test("displays artists sorted by totalStreams (descending)", () => {
        render(<ArtistTable artists={mockArtists} />);
        const rows = screen.getAllByRole("row");
        expect(rows[1]).toHaveTextContent("Alice Smith"); // Highest streams
        expect(rows[2]).toHaveTextContent("John Doe");
        expect(rows[3]).toHaveTextContent("Bob Brown"); // Lowest streams
    });

    test("filters artists based on search input", () => {
        render(<ArtistTable artists={mockArtists} />);
        const searchInput = screen.getByRole("textbox");

        fireEvent.change(searchInput, { target: { value: "John" } });
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.queryByText("Alice Smith")).not.toBeInTheDocument();
        expect(screen.queryByText("Bob Brown")).not.toBeInTheDocument();
    });

    test("shows 'No artists found' when search term does not match", () => {
        render(<ArtistTable artists={mockArtists} />);
        const searchInput = screen.getByRole("textbox");

        fireEvent.change(searchInput, { target: { value: "XYZ" } });
        expect(screen.getByText("No artists found")).toBeInTheDocument();
    });

    test("handles invalid artist data gracefully", () => {
        const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
        render(<ArtistTable artists={null} />);
        expect(screen.getByText("Error: Invalid artist data")).toBeInTheDocument();
        consoleErrorMock.mockRestore();
    });

    test("renders empty state when no artists are provided", () => {
        render(<ArtistTable artists={[]} />);
        expect(screen.getByText("No artists found")).toBeInTheDocument();
    });
});
