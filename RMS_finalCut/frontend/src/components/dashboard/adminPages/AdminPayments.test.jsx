// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import Payments from "./AdminPayments";
// import { useArtistsManagers } from "../../../context/ArtistsManagersContext";
// import { useRoyalty } from "../../../context/RoyaltyContext";
// import TransactionService from "../../../services/TransactionService";
 
// // Mocking the context providers
// jest.mock("../../../context/ArtistsManagersContext", () => ({
//     useArtistsManagers: jest.fn(),
// }));
 
// jest.mock("../../../context/RoyaltyContext", () => ({
//     useRoyalty: jest.fn(),
// }));
 
// jest.mock("../../../services/TransactionService");
 
// describe("Payments Component", () => {
//     const mockArtists = [
//         { _id: "artist-1", fullName: "Artist One" },
//         { _id: "artist-2", fullName: "Artist Two" },
//     ];
 
//     const mockRoyalties = [
//         {
//             _id: "royalty-1",
//             songId: { songName: "Song A" },
//             totalRoyalty: 200.5,
//             royaltyDue: 100.75,
//         },
//     ];
 
//     const mockTransactions = [
//         {
//             _id: "transaction-1",
//             transactionAmount: 50,
//             transactionDate: "2025-02-10",
//         },
//     ];
 
//     let mockSetSelectedArtist;
//     let mockFetchRoyaltyByArtist;
 
//     beforeEach(() => {
//         mockSetSelectedArtist = jest.fn();
//         mockFetchRoyaltyByArtist = jest.fn();
 
//         useArtistsManagers.mockReturnValue({
//             artists: mockArtists,
//         });
 
//         useRoyalty.mockReturnValue({
//             royalties: mockRoyalties,
//             selectedArtist: "",
//             setSelectedArtist: mockSetSelectedArtist,
//             fetchRoyaltyByArtist: mockFetchRoyaltyByArtist,
//         });
 
//         TransactionService.fetchTransactions.mockResolvedValue(mockTransactions);
//     });
 
//     it("renders the Payments component", () => {
//         render(<Payments />);
//         expect(screen.getByText("Manage Payments")).toBeInTheDocument();
//         expect(screen.getByLabelText("Select Artist:")).toBeInTheDocument();
//     });
 
//     it("displays artists in the dropdown", () => {
//         render(<Payments />);
//         const select = screen.getByLabelText("Select Artist:");
//         expect(select).toBeInTheDocument();
//         expect(select.children.length).toBe(3); // Default option + 2 artists
//     });
 
//     it("fetches royalty and transactions when artist is selected", async () => {
//         render(<Payments />);
//         const select = screen.getByLabelText("Select Artist:");
 
//         fireEvent.change(select, { target: { value: "artist-1" } });
 
//         await waitFor(() => {
//             expect(mockSetSelectedArtist).toHaveBeenCalledWith("artist-1");
//             expect(mockFetchRoyaltyByArtist).toHaveBeenCalledWith("artist-1");
//         });
 
//         await waitFor(() => {
//             expect(TransactionService.fetchTransactions).toHaveBeenCalledWith("artist", "artist-1");
//         });
//     });
 
//     it("displays royalty details for selected artist", async () => {
//         useRoyalty.mockReturnValue({
//             royalties: mockRoyalties,
//             selectedArtist: "artist-1",
//             setSelectedArtist: mockSetSelectedArtist,
//             fetchRoyaltyByArtist: mockFetchRoyaltyByArtist,
//         });
 
//         render(<Payments />);
//         await waitFor(() => {
//             expect(screen.getByText("Song A")).toBeInTheDocument();
//             expect(screen.getByText("$200.50")).toBeInTheDocument();
//             expect(screen.getByText("$100.75")).toBeInTheDocument();
//         });
//     });
 
//     it("triggers Create Transaction form when button is clicked", async () => {
//         useRoyalty.mockReturnValue({
//             royalties: mockRoyalties,
//             selectedArtist: "artist-1",
//             setSelectedArtist: mockSetSelectedArtist,
//             fetchRoyaltyByArtist: mockFetchRoyaltyByArtist,
//         });
 
//         render(<Payments />);
//         const button = screen.getByText("Create Transaction");
//         fireEvent.click(button);
 
//         await waitFor(() => {
//             expect(screen.getByText("Create Transaction")).toBeInTheDocument();
//         });
//     });
// });