import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserTransactions from "./UserTransactions";
import { useAuth } from "../../context/authContext";
import TransactionService from "../../services/TransactionService";

// Mock the useAuth hook
jest.mock("../../context/authContext", () => ({
    useAuth: jest.fn(),
}));

// Mock the TransactionService
jest.mock("../../services/TransactionService", () => ({
    fetchTransactions: jest.fn(),
    fetchWalletAmount: jest.fn(),
    downloadTransactionsPDF: jest.fn(),
}));

describe("UserTransactions Component", () => {
    const mockUser = { role: "Artist", _id: "123" };
    const mockUserData = { _id: "123" };
    const mockTransactions = [
        {
            _id: "tx1",
            songId: { songName: "Song 1" },
            transactionAmount: 100,
            artistShare: 70,
            managerShare: 30,
            status: "Approved",
        },
        {
            _id: "tx2",
            songId: { songName: "Song 2" },
            transactionAmount: 200,
            artistShare: 140,
            managerShare: 60,
            status: "Pending",
        },
    ];

    beforeEach(() => {
        useAuth.mockReturnValue({ user: mockUser, userData: mockUserData, loading: false });
        TransactionService.fetchTransactions.mockResolvedValue(mockTransactions);
        TransactionService.fetchWalletAmount.mockResolvedValue(210);
        TransactionService.downloadTransactionsPDF.mockResolvedValue(new Blob());
        global.alert = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders loading state when transactions are being fetched", async () => {
        useAuth.mockReturnValueOnce({ user: mockUser, userData: mockUserData, loading: true });
        render(<UserTransactions />);
        expect(screen.getByText(/Loading transactions.../i)).toBeInTheDocument();
    });

    test("renders transactions when data is fetched successfully", async () => {
        render(<UserTransactions />);
        await waitFor(() => expect(screen.getByText(/💰 Your Transactions/i)).toBeInTheDocument());
        expect(screen.getByText(/🏦 Wallet Balance: \$210.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Song 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Song 2/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /📥 Download Transactions PDF/i })).toBeInTheDocument();
    });

    test("renders no transactions message when there are no transactions", async () => {
        TransactionService.fetchTransactions.mockResolvedValueOnce([]);
        render(<UserTransactions />);
        await waitFor(() => expect(screen.getByText(/No transactions available/i)).toBeInTheDocument());
    });

    test("handles PDF download when the download button is clicked", async () => {
        render(<UserTransactions />);
        await waitFor(() => expect(screen.getByText(/💰 Your Transactions/i)).toBeInTheDocument());
        const downloadButton = screen.getByRole("button", { name: /📥 Download Transactions PDF/i });
        fireEvent.click(downloadButton);
        await waitFor(() => {
            expect(TransactionService.downloadTransactionsPDF).toHaveBeenCalledWith(mockUser.role, mockUserData._id);
        });
    });

    test("displays an alert when there are no transactions to download", async () => {
        TransactionService.fetchTransactions.mockResolvedValueOnce([]);
        render(<UserTransactions />);
        await waitFor(() => expect(screen.getByText(/No transactions available/i)).toBeInTheDocument());
        fireEvent.click(screen.getByRole("button", { name: /📥 Download Transactions PDF/i }));
        expect(global.alert).toHaveBeenCalledWith("No transactions available to download.");
    });

    test("logs an error when PDF download fails", async () => {
        TransactionService.downloadTransactionsPDF.mockRejectedValueOnce(new Error("Download failed"));
        console.error = jest.fn();
        render(<UserTransactions />);
        await waitFor(() => expect(screen.getByText(/💰 Your Transactions/i)).toBeInTheDocument());
        fireEvent.click(screen.getByRole("button", { name: /📥 Download Transactions PDF/i }));
        await waitFor(() => expect(console.error).toHaveBeenCalledWith("Error downloading PDF:", expect.any(Error)));
    });

    test("handles errors when fetching transactions", async () => {
        TransactionService.fetchTransactions.mockRejectedValueOnce(new Error("Fetch failed"));
        console.error = jest.fn();
        render(<UserTransactions />);
        await waitFor(() => expect(console.error).toHaveBeenCalledWith("Error fetching artist transactions:", expect.any(Error)));
    });

    test("renders mobile view for transactions", async () => {
        render(<UserTransactions />);
        await waitFor(() => expect(screen.getByText(/💰 Your Transactions/i)).toBeInTheDocument());
        expect(screen.getByText(/Transaction ID/i)).toBeInTheDocument();
        expect(screen.getByText(/Song 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Song 2/i)).toBeInTheDocument();
    });

    test("renders desktop view for transactions", async () => {
        render(<UserTransactions />);
        await waitFor(() => expect(screen.getByText(/💰 Your Transactions/i)).toBeInTheDocument());
        expect(screen.getByText(/Transaction ID/i)).toBeInTheDocument();
        expect(screen.getByText(/Song 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Song 2/i)).toBeInTheDocument();
    });
});
