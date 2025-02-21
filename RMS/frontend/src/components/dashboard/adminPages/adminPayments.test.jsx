import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Payments from "./AdminPayments";
import { useArtistsManagers } from "../../../context/ArtistsManagersContext";
import { useRoyalty } from "../../../context/RoyaltyContext";
import TransactionService from "../../../services/TransactionService";

// Mock context and service
jest.mock("../../../context/ArtistsManagersContext", () => ({
  useArtistsManagers: jest.fn(),
}));

jest.mock("../../../context/RoyaltyContext", () => ({
  useRoyalty: jest.fn(),
}));

jest.mock("../../../services/TransactionService", () => ({
  fetchTransactions: jest.fn(),
}));

describe("AdminPayments Component", () => {
  let mockSetSelectedArtist, mockFetchRoyaltyByArtist, mockSetSelectedRoyalty, mockSetStatusMessage;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetSelectedArtist = jest.fn();
    mockFetchRoyaltyByArtist = jest.fn();
    mockSetSelectedRoyalty = jest.fn();
    mockSetStatusMessage = jest.fn();
  });

  it("should render with no artists and display default UI", () => {
    useArtistsManagers.mockReturnValue({ artists: [] });
    useRoyalty.mockReturnValue({
      royalties: [],
      selectedArtist: "",
      setSelectedArtist: mockSetSelectedArtist,
      fetchRoyaltyByArtist: mockFetchRoyaltyByArtist,
    });

    render(<Payments />);

    expect(screen.getByText("Manage Payments")).toBeInTheDocument();
    expect(screen.getByText("Select Artist:")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("should allow selecting an artist and trigger state update", () => {
    useArtistsManagers.mockReturnValue({
      artists: [{ _id: "1", fullName: "Artist One" }],
    });

    useRoyalty.mockReturnValue({
      royalties: [],
      selectedArtist: "",
      setSelectedArtist: mockSetSelectedArtist,
      fetchRoyaltyByArtist: mockFetchRoyaltyByArtist,
    });

    render(<Payments />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });

    expect(mockSetSelectedArtist).toHaveBeenCalledWith("1");
  });

  it("should show error message when no artist is selected and transactions are attempted", async () => {
    useArtistsManagers.mockReturnValue({ artists: [] });

    useRoyalty.mockReturnValue({
      royalties: [],
      selectedArtist: "",
      setSelectedArtist: mockSetSelectedArtist,
      fetchRoyaltyByArtist: mockFetchRoyaltyByArtist,
    });

    TransactionService.fetchTransactions.mockResolvedValue([]);

    render(<Payments />);

    await waitFor(() => {
      expect(screen.queryByText("No artist selected.")).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "" } });

    expect(screen.getByText("No artist selected.")).toBeInTheDocument();
  });

  it("should fetch transactions when an artist is selected", async () => {
    TransactionService.fetchTransactions.mockResolvedValue([
      { id: "t1", amount: 100, date: "2024-02-18" },
    ]);

    useArtistsManagers.mockReturnValue({
      artists: [{ _id: "1", fullName: "Artist One" }],
    });

    useRoyalty.mockReturnValue({
      royalties: [],
      selectedArtist: "1",
      setSelectedArtist: mockSetSelectedArtist,
      fetchRoyaltyByArtist: mockFetchRoyaltyByArtist,
    });

    render(<Payments />);

    await waitFor(() => {
      expect(TransactionService.fetchTransactions).toHaveBeenCalledWith("artist", "1");
    });
  });

  it("should display royalties when available", () => {
    useArtistsManagers.mockReturnValue({
      artists: [{ _id: "1", fullName: "Artist One" }],
    });

    useRoyalty.mockReturnValue({
      royalties: [
        {
          _id: "r1",
          songId: { songName: "Song A" },
          totalRoyalty: 100,
          royaltyDue: 50,
        },
      ],
      selectedArtist: "1",
      setSelectedArtist: mockSetSelectedArtist,
      fetchRoyaltyByArtist: mockFetchRoyaltyByArtist,
    });

    render(<Payments />);

    expect(screen.getByText("Song A")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("$50.00")).toBeInTheDocument();
  });

  it("should show 'Create Transaction' button and open the transaction form when clicked", () => {
    useArtistsManagers.mockReturnValue({
      artists: [{ _id: "1", fullName: "Artist One" }],
    });

    useRoyalty.mockReturnValue({
      royalties: [
        {
          _id: "r1",
          songId: { songName: "Song A" },
          totalRoyalty: 100,
          royaltyDue: 50,
        },
      ],
      selectedArtist: "1",
      setSelectedArtist: mockSetSelectedArtist,
      fetchRoyaltyByArtist: mockFetchRoyaltyByArtist,
    });

    render(<Payments />);

    const createTransactionButton = screen.getByText("Create Transaction");
    fireEvent.click(createTransactionButton);

    expect(mockSetSelectedRoyalty).toHaveBeenCalledWith(expect.objectContaining({ _id: "r1" }));
  });

  it("should handle the case when no royalties are available", () => {
    useArtistsManagers.mockReturnValue({
      artists: [{ _id: "1", fullName: "Artist One" }],
    });

    useRoyalty.mockReturnValue({
      royalties: [],
      selectedArtist: "1",
      setSelectedArtist: mockSetSelectedArtist,
      fetchRoyaltyByArtist: mockFetchRoyaltyByArtist,
    });

    render(<Payments />);

    expect(screen.queryByText("Total Royalty")).not.toBeInTheDocument();
    expect(screen.queryByText("Create Transaction")).not.toBeInTheDocument();
  });

  it("should display transactions inside TransactionList", async () => {
    TransactionService.fetchTransactions.mockResolvedValue([
      { id: "t1", amount: 200, date: "2024-02-18" },
    ]);

    useArtistsManagers.mockReturnValue({
      artists: [{ _id: "1", fullName: "Artist One" }],
    });

    useRoyalty.mockReturnValue({
      royalties: [],
      selectedArtist: "1",
      setSelectedArtist: mockSetSelectedArtist,
      fetchRoyaltyByArtist: mockFetchRoyaltyByArtist,
    });

    render(<Payments />);

    await waitFor(() => {
      expect(screen.getByText("$200.00")).toBeInTheDocument();
    });
  });
});
