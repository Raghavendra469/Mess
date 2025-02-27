import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ArtistsTable from "./ArtistTable";

describe("ArtistsTable Component", () => {
    const mockArtists = [
        { fullName: "Artist A", totalStreams: 500, fullRoyalty: 1000 },
        { fullName: "Artist B", totalStreams: 1000, fullRoyalty: 2000 },
        { fullName: "Artist C", totalStreams: 800, fullRoyalty: 1500 }
    ];

    test("renders table with artists", () => {
        render(<ArtistsTable artists={mockArtists} />);
        expect(screen.getByText("All Artists")).toBeInTheDocument();
        expect(screen.getByText("Artist A")).toBeInTheDocument();
        expect(screen.getByText("Artist B")).toBeInTheDocument();
        expect(screen.getByText("Artist C")).toBeInTheDocument();
    });

    test("renders error message if invalid artists prop is passed", () => {
        console.error = vi.fn();
        render(<ArtistsTable artists={null} />);
        expect(screen.getByText("Error: Invalid artist data")).toBeInTheDocument();
    });

    test("renders message if artists array is empty", () => {
        render(<ArtistsTable artists={[]} />);
        expect(screen.getByText("No artists found")).toBeInTheDocument();
    });

    test("handles artists with missing fullName", () => {
        const artistsWithMissingNames = [{ totalStreams: 500, fullRoyalty: 1000 }];
        render(<ArtistsTable artists={artistsWithMissingNames} />);
    
        // Verify that there is exactly one row (besides the header)
        const rows = screen.getAllByRole("row");
        expect(rows.length).toBe(2); // One header + One artist row
    
        // Check if the first data row contains "Unknown"
        expect(rows[1].cells[0].textContent).toBe("Unknown");
    });
    
    

    test("handles artists with missing totalStreams and fullRoyalty", () => {
        const artistsWithMissingData = [{ fullName: "Artist X" }];
        render(<ArtistsTable artists={artistsWithMissingData} />);
        expect(screen.getByText("Artist X")).toBeInTheDocument();
        expect(screen.getByText("0")).toBeInTheDocument();
        expect(screen.getByText("$0.00")).toBeInTheDocument();
    });

    test("sorts artists by totalStreams in descending order", () => {
        render(<ArtistsTable artists={mockArtists} />);
        const rows = screen.getAllByRole("row");
        expect(rows[1]).toHaveTextContent("Artist B"); // Highest streams
        expect(rows[2]).toHaveTextContent("Artist C");
        expect(rows[3]).toHaveTextContent("Artist A"); // Lowest streams
    });

    test("sorts artists with equal totalStreams by fullRoyalty", () => {
        const equalStreamsArtists = [
            { fullName: "Artist X", totalStreams: 500, fullRoyalty: 2000 },
            { fullName: "Artist Y", totalStreams: 500, fullRoyalty: 1000 }
        ];
        render(<ArtistsTable artists={equalStreamsArtists} />);
        const rows = screen.getAllByRole("row");
        expect(rows[1]).toHaveTextContent("Artist X"); // Higher fullRoyalty first
        expect(rows[2]).toHaveTextContent("Artist Y");
    });

    test("filters artists based on search input", () => {
        render(<ArtistsTable artists={mockArtists} />);
        const searchInput = screen.getByRole("textbox");
        fireEvent.change(searchInput, { target: { value: "Artist A" } });
        expect(screen.getByText("Artist A")).toBeInTheDocument();
        expect(screen.queryByText("Artist B")).not.toBeInTheDocument();
    });

    test("displays message when no artists match search", () => {
        render(<ArtistsTable artists={mockArtists} />);
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "Unknown" } });
        expect(screen.getByText("No artists found")).toBeInTheDocument();
    });

    
});
