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
    const mockUser = {
        role: "Artist",
        _id: "123",
    };

    const mockUserData = {
        _id: "123",
    };

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
        // Mock the useAuth hook
        useAuth.mockReturnValue({
            user: mockUser,
            userData: mockUserData,
            loading: false,
        });

        // Mock the TransactionService functions
        TransactionService.fetchTransactions.mockResolvedValue(mockTransactions);
        TransactionService.fetchWalletAmount.mockReturnValue(210); // Total wallet amount
        TransactionService.downloadTransactionsPDF.mockResolvedValue(new Blob());

        // Mock global.alert
        global.alert = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders loading state when transactions are being fetched", async () => {
        // Mock the loading state
        useAuth.mockReturnValueOnce({
            user: mockUser,
            userData: mockUserData,
            loading: true,
        });

        render(<UserTransactions />);

        // Check if the loading message is displayed
        expect(screen.getByText(/Loading transactions.../i)).toBeInTheDocument();
    });

    test("renders transactions when data is fetched successfully", async () => {
        render(<UserTransactions />);

        // Wait for the transactions to be loaded
        await waitFor(() => {
            expect(screen.getByText(/💰 Your Transactions/i)).toBeInTheDocument();
        });

        // Check if the wallet balance is displayed
        expect(screen.getByText(/🏦 Wallet Balance: \$210.00/i)).toBeInTheDocument();

        // Check if the transactions are displayed
        expect(screen.getByText(/Song 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Song 2/i)).toBeInTheDocument();

        // Check if the download PDF button is displayed
        expect(screen.getByRole("button", { name: /📥 Download Transactions PDF/i })).toBeInTheDocument();
    });

    test("renders no transactions message when there are no transactions", async () => {
        // Mock empty transactions
        TransactionService.fetchTransactions.mockResolvedValueOnce([]);

        render(<UserTransactions />);

        // Wait for the component to render
        await waitFor(() => {
            expect(screen.getByText(/No transactions available/i)).toBeInTheDocument();
        });
    });

    test("handles PDF download when the download button is clicked", async () => {
        render(<UserTransactions />);

        // Wait for the transactions to be loaded
        await waitFor(() => {
            expect(screen.getByText(/💰 Your Transactions/i)).toBeInTheDocument();
        });

        // Simulate clicking the download button
        const downloadButton = screen.getByRole("button", { name: /📥 Download Transactions PDF/i });
        fireEvent.click(downloadButton);

        // Check if the download function was called
        await waitFor(() => {
            expect(TransactionService.downloadTransactionsPDF).toHaveBeenCalledWith(mockUser.role, mockUserData._id);
        });
    });

    test("displays an alert when there are no transactions to download", async () => {
        // Mock empty transactions
        TransactionService.fetchTransactions.mockResolvedValueOnce([]);

        render(<UserTransactions />);

        // Wait for the component to render
        await waitFor(() => {
            expect(screen.getByText(/No transactions available/i)).toBeInTheDocument();
        });

        // Simulate clicking the download button
        const downloadButton = screen.getByRole("button", { name: /📥 Download Transactions PDF/i });
        fireEvent.click(downloadButton);

        // Check if the alert was called
        expect(global.alert).toHaveBeenCalledWith("No transactions available to download.");
    });

    test("logs an error when PDF download fails", async () => {
        // Mock an error during PDF download
        TransactionService.downloadTransactionsPDF.mockRejectedValueOnce(new Error("Download failed"));

        // Mock console.error
        console.error = jest.fn();

        render(<UserTransactions />);

        // Wait for the transactions to be loaded
        await waitFor(() => {
            expect(screen.getByText(/💰 Your Transactions/i)).toBeInTheDocument();
        });

        // Simulate clicking the download button
        const downloadButton = screen.getByRole("button", { name: /📥 Download Transactions PDF/i });
        fireEvent.click(downloadButton);

        // Check if the error was logged
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Error downloading PDF:", expect.any(Error));
        });
    });
});