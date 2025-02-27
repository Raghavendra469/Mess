// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import { MemoryRouter } from "react-router-dom";
// import { vi } from "vitest";
// import UserTransactions from "./UserTransactions";
// import { useAuth } from "../../context/authContext";
// import * as TransactionService from "../../services/TransactionService";

// vi.mock("../../context/authContext", () => ({
//   useAuth: vi.fn(),
// }));

// vi.mock("../../services/TransactionService", () => ({
//   fetchTransactions: vi.fn(),
//   fetchWalletAmount: vi.fn(),
//   downloadTransactionsPDF: vi.fn(),
// }));

// describe("UserTransactions Component", () => {
//   const mockUser = { _id: "123", role: "artist" };
//   const mockUserData = { _id: "123", role: "artist" };

//   beforeEach(() => {
//     vi.clearAllMocks();
//     global.alert = vi.fn();
//     global.URL.createObjectURL = vi.fn(() => "mock-url");
//   });

//   it("should display loading state while transactions are being fetched", () => {
//     useAuth.mockReturnValue({ user: mockUser, userData: mockUserData, loading: false });

//     render(
//       <MemoryRouter>
//         <UserTransactions />
//       </MemoryRouter>
//     );

//     expect(screen.getByText("Loading transactions...")).toBeInTheDocument();
//   });

//   it("should render transactions correctly", async () => {
//     const mockTransactions = [
//       { _id: "tx1", songId: { songName: "Song 1" }, transactionAmount: 10.0, artistShare: 5.0, managerShare: 5.0, status: "Approved" },
//       { _id: "tx2", songId: { songName: "Song 2" }, transactionAmount: 20.0, artistShare: 10.0, managerShare: 10.0, status: "Pending" },
//     ];

//     TransactionService.fetchTransactions.mockResolvedValue(mockTransactions);
//     TransactionService.fetchWalletAmount.mockResolvedValue(15.0);
//     useAuth.mockReturnValue({ user: mockUser, userData: mockUserData, loading: false });

//     render(
//       <MemoryRouter>
//         <UserTransactions />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByText("Song 1")).toBeInTheDocument();
//       expect(screen.getByText("Song 2")).toBeInTheDocument();
//       expect(screen.getByText("$10.00")).toBeInTheDocument();
//       expect(screen.getByText("$20.00")).toBeInTheDocument();
//     });
//   });

//   it("should render wallet balance correctly", async () => {
//     TransactionService.fetchTransactions.mockResolvedValue([]);
//     TransactionService.fetchWalletAmount.mockResolvedValue(15.0);
//     useAuth.mockReturnValue({ user: mockUser, userData: mockUserData, loading: false });

//     render(
//       <MemoryRouter>
//         <UserTransactions />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByText("$15.00")).toBeInTheDocument();
//     });
//   });

//   it("should show 'No transactions available' when there are no transactions", async () => {
//     TransactionService.fetchTransactions.mockResolvedValue([]);
//     TransactionService.fetchWalletAmount.mockResolvedValue(0.0);
//     useAuth.mockReturnValue({ user: mockUser, userData: mockUserData, loading: false });

//     render(
//       <MemoryRouter>
//         <UserTransactions />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByText("No transactions available")).toBeInTheDocument();
//     });
//   });

//   it("should show an alert when trying to download PDF with no transactions", async () => {
//     TransactionService.fetchTransactions.mockResolvedValue([]);
//     useAuth.mockReturnValue({ user: mockUser, userData: mockUserData, loading: false });

//     render(
//       <MemoryRouter>
//         <UserTransactions />
//       </MemoryRouter>
//     );

//     const downloadButton = screen.getByText("📥 Download Transactions PDF");
//     fireEvent.click(downloadButton);

//     await waitFor(() => {
//       expect(global.alert).toHaveBeenCalledWith("No transactions available to download.");
//     });
//   });

//   it("should handle errors in fetching transactions gracefully", async () => {
//     TransactionService.fetchTransactions.mockRejectedValue(new Error("Error fetching transactions"));
//     useAuth.mockReturnValue({ user: mockUser, userData: mockUserData, loading: false });

//     render(
//       <MemoryRouter>
//         <UserTransactions />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByText("Loading transactions...")).toBeInTheDocument();
//     });
//   });
// });
