import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // Import jest-dom for assertions like toBeInTheDocument
import { MemoryRouter } from "react-router-dom";
import UserTransactions from "./UserTransactions";
import { useAuth } from "../../context/authContext";
import TransactionService from "../../services/TransactionService";

// Mock the useAuth context to provide mock user data
jest.mock("../../context/authContext", () => ({
  useAuth: jest.fn(),
}));

// Mock TransactionService
jest.mock("../../services/TransactionService", () => ({
  fetchTransactions: jest.fn(),
  fetchWalletAmount: jest.fn(),
  downloadTransactionsPDF: jest.fn(),
}));

describe("UserTransactions Component", () => {
  const mockUser = {
    _id: "123",
    role: "artist",
  };

  const mockUserData = {
    _id: "123",
    role: "artist",
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
    // Mock the global alert function
    global.alert = jest.fn();
  });

  it("should display loading state while transactions are being fetched", () => {
    useAuth.mockReturnValue({
      user: mockUser,
      userData: mockUserData,
      loading: false,
    });

    render(
      <MemoryRouter>
        <UserTransactions />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading transactions...")).toBeInTheDocument();
  });

  it("should render transactions correctly", async () => {
    const mockTransactions = [
      {
        _id: "tx1",
        songId: { songName: "Song 1" },
        transactionAmount: 10.0,
        artistShare: 5.0,
        managerShare: 5.0,
        status: "Approved",
      },
      {
        _id: "tx2",
        songId: { songName: "Song 2" },
        transactionAmount: 20.0,
        artistShare: 10.0,
        managerShare: 10.0,
        status: "Pending",
      },
    ];

    TransactionService.fetchTransactions.mockResolvedValue(mockTransactions);
    TransactionService.fetchWalletAmount.mockReturnValue(15.0);

    useAuth.mockReturnValue({
      user: mockUser,
      userData: mockUserData,
      loading: false,
    });

    render(
      <MemoryRouter>
        <UserTransactions />
      </MemoryRouter>
    );

    // Wait for the transactions to load
    await waitFor(() => {
      expect(screen.getByText("Song 1")).toBeInTheDocument();
      expect(screen.getByText("Song 2")).toBeInTheDocument();
      expect(screen.getByText("$10.00")).toBeInTheDocument();
      expect(screen.getByText("$20.00")).toBeInTheDocument();
    });
  });

  it("should render wallet balance correctly", async () => {
    const mockTransactions = [];
    TransactionService.fetchTransactions.mockResolvedValue(mockTransactions);
    TransactionService.fetchWalletAmount.mockReturnValue(15.0);

    useAuth.mockReturnValue({
      user: mockUser,
      userData: mockUserData,
      loading: false,
    });

    render(
      <MemoryRouter>
        <UserTransactions />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("$15.00")).toBeInTheDocument();
    });
  });

  it("should show 'No transactions available' when there are no transactions", async () => {
    TransactionService.fetchTransactions.mockResolvedValue([]);
    TransactionService.fetchWalletAmount.mockReturnValue(0.0);

    useAuth.mockReturnValue({
      user: mockUser,
      userData: mockUserData,
      loading: false,
    });

    render(
      <MemoryRouter>
        <UserTransactions />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No transactions available")).toBeInTheDocument();
    });
  });

  it("should handle PDF download correctly", async () => {
    const mockTransactions = [
      {
        _id: "tx1",
        songId: { songName: "Song 1" },
        transactionAmount: 10.0,
        artistShare: 5.0,
        managerShare: 5.0,
        status: "Approved",
      },
    ];

    TransactionService.fetchTransactions.mockResolvedValue(mockTransactions);
    TransactionService.fetchWalletAmount.mockReturnValue(15.0);
    TransactionService.downloadTransactionsPDF.mockResolvedValue(new Blob(["PDF content"], { type: "application/pdf" }));

    useAuth.mockReturnValue({
      user: mockUser,
      userData: mockUserData,
      loading: false,
    });

    render(
      <MemoryRouter>
        <UserTransactions />
      </MemoryRouter>
    );

    const downloadButton = screen.getByText("📥 Download Transactions PDF");
    fireEvent.click(downloadButton);

    // Wait for the PDF to download
    await waitFor(() => {
      expect(TransactionService.downloadTransactionsPDF).toHaveBeenCalledTimes(1);
    });
  });

  it("should show an alert when trying to download PDF with no transactions", async () => {
    const mockTransactions = [];
    TransactionService.fetchTransactions.mockResolvedValue(mockTransactions);

    useAuth.mockReturnValue({
      user: mockUser,
      userData: mockUserData,
      loading: false,
    });

    render(
      <MemoryRouter>
        <UserTransactions />
      </MemoryRouter>
    );

    const downloadButton = screen.getByText("📥 Download Transactions PDF");
    fireEvent.click(downloadButton);

    // Expecting an alert with the appropriate message
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("No transactions available to download.");
    });
  });

  it("should handle errors in fetching transactions gracefully", async () => {
    TransactionService.fetchTransactions.mockRejectedValue(new Error("Error fetching transactions"));

    useAuth.mockReturnValue({
      user: mockUser,
      userData: mockUserData,
      loading: false,
    });

    render(
      <MemoryRouter>
        <UserTransactions />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Loading transactions...")).toBeInTheDocument();
    });
  });

  it("should handle the full PDF download logic", async () => {
    const mockTransactions = [
      {
        _id: "tx1",
        songId: { songName: "Song 1" },
        transactionAmount: 10.0,
        artistShare: 5.0,
        managerShare: 5.0,
        status: "Approved",
      },
    ];

    const mockBlob = new Blob(["PDF content"], { type: "application/pdf" });
    TransactionService.fetchTransactions.mockResolvedValue(mockTransactions);
    TransactionService.fetchWalletAmount.mockReturnValue(15.0);
    TransactionService.downloadTransactionsPDF.mockResolvedValue(mockBlob);

    useAuth.mockReturnValue({
      user: mockUser,
      userData: mockUserData,
      loading: false,
    });

    // Mocking window.URL.createObjectURL
    const createObjectURLMock = jest.spyOn(window.URL, "createObjectURL").mockReturnValue("mock-url");

    render(
      <MemoryRouter>
        <UserTransactions />
      </MemoryRouter>
    );

    const downloadButton = screen.getByText("📥 Download Transactions PDF");
    fireEvent.click(downloadButton);

    // Wait for the download logic to complete
    await waitFor(() => {
      // Check if createObjectURL was called
      expect(createObjectURLMock).toHaveBeenCalledTimes(1);

      // Check if the download link was created and clicked
      const aElement = document.createElement("a");
      expect(aElement.href).toBe("mock-url");
      expect(aElement.download).toBe("transactions.pdf");

      // Clean up mock
      createObjectURLMock.mockRestore();
    });
  });
});
