import axios from "axios";
import TransactionService from "./TransactionService";

jest.mock("axios");

describe("TransactionService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetchTransactions should return transactions on success", async () => {
    const mockData = { transactions: [{ id: "TXN1", amount: 100 }] };
    axios.get.mockResolvedValue({ data: mockData });

    const result = await TransactionService.fetchTransactions("Artist", "123");
    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith("http://localhost:3000/api/transactions/user/artist/123");
  });

  test("fetchTransactions should return empty array on failure", async () => {
    axios.get.mockRejectedValue(new Error("Server error"));

    const result = await TransactionService.fetchTransactions("Artist", "123");
    expect(result).toEqual([]);
  });

  test("fetchWalletAmount should calculate the correct total", () => {
    const transactions = [
      { artistShare: 50, managerShare: 30 },
      { artistShare: 100, managerShare: 50 },
    ];
    expect(TransactionService.fetchWalletAmount(transactions, "Artist")).toBe(150);
    expect(TransactionService.fetchWalletAmount(transactions, "Manager")).toBe(80);
  });

  test("downloadTransactionsPDF should return data on success", async () => {
    const mockBlob = new Blob(["test"], { type: "application/pdf" });
    axios.get.mockResolvedValue({ data: mockBlob });

    const result = await TransactionService.downloadTransactionsPDF("Artist", "123");
    expect(result).toEqual(mockBlob);
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/transactions/export/artist/123",
      { responseType: "blob" }
    );
  });

  test("downloadTransactionsPDF should throw error on failure", async () => {
    axios.get.mockRejectedValue(new Error("Download failed"));

    await expect(TransactionService.downloadTransactionsPDF("Artist", "123")).rejects.toThrow(
      "Failed to download PDF"
    );
  });

  test("createTransaction should return success message on success", async () => {
    axios.post.mockResolvedValue({ data: { message: "Success" } });

    const result = await TransactionService.createTransaction({ amount: 100 });
    expect(result).toEqual({ success: true, message: "Transaction created successfully!" });
  });

  test("createTransaction should handle API failure", async () => {
    axios.post.mockRejectedValue(new Error("Server error"));

    const result = await TransactionService.createTransaction({ amount: 100 });
    expect(result).toEqual({ success: false, message: "Error creating transaction." });
  });

  test("deleteTransaction should return success message on success", async () => {
    axios.delete.mockResolvedValue({});

    const result = await TransactionService.deleteTransaction("TXN777");
    expect(result).toEqual({ success: true, message: "Transaction deleted successfully!" });
  });

  test("deleteTransaction should handle API failure", async () => {
    axios.delete.mockRejectedValue(new Error("Delete failed"));

    const result = await TransactionService.deleteTransaction("TXN777");
    expect(result).toEqual({ success: false, message: "Error deleting transaction." });
  });

  test("payTransaction should return success message on success", async () => {
    axios.post.mockResolvedValue({});

    const result = await TransactionService.payTransaction("TXN888", 150);
    expect(result).toEqual({ success: true, message: "Payment successful!" });
  });

  test("payTransaction should handle API failure", async () => {
    axios.post.mockRejectedValue(new Error("Payment failed"));

    const result = await TransactionService.payTransaction("TXN888", 150);
    expect(result).toEqual({ success: false, message: "Error processing payment." });
  });
});
