import React, { useState } from "react";
import TransactionService from "../../../services/TransactionService";

const CreateTransactionForm = ({ 
    selectedRoyalty = {}, 
    setSelectedRoyalty, 
    fetchTransactions, 
    selectedArtist, 
    setStatusMessage 
}) => {
    const [transactionAmount, setTransactionAmount] = useState("");

    // Validate input before submitting
    const validateTransaction = (amount) => {
        const numericAmount = parseFloat(amount);
        if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
            setStatusMessage({ type: "error", text: "Enter a valid transaction amount!" });
            return false;
        }
        if (numericAmount > (selectedRoyalty?.royaltyDue || 0)) {
            setStatusMessage({ 
                type: "error", 
                text: `Transaction amount cannot exceed the royalty due $${(selectedRoyalty?.royaltyDue || 0).toFixed(2)}!`
            });
            return false;
        }
        return true;
    };

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: "", text: "" });

        if (!validateTransaction(transactionAmount)) return;

        try {
            const transactionData = {
                userId: selectedArtist,
                songId: selectedRoyalty.songId?._id,
                royaltyId: selectedRoyalty._id,
                transactionAmount: parseFloat(transactionAmount),
            };

            const response = await TransactionService.createTransaction(transactionData);

            setStatusMessage({ type: response.success ? "success" : "error", text: response.message });

            if (response.success) {
                setSelectedRoyalty(null);
                setTransactionAmount("");
                fetchTransactions(selectedArtist);
            }
        } catch (error) {
            setStatusMessage({ type: "error", text: "Transaction failed. Please try again later." });
        }
    };

    return (
        <div className="mt-6 p-4 border rounded bg-gray-100">
            <h3 className="text-lg font-bold mb-2">Create Transaction</h3>
            <form onSubmit={handleTransactionSubmit}>
                <input 
                    type="number" 
                    className="border p-2 rounded w-full mb-2"
                    value={transactionAmount} 
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    min="0"
                />
                <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer">
                    Submit
                </button>
                <button 
                    type="button" 
                    className="bg-gray-400 text-white px-3 py-1 rounded ml-2 cursor-pointer" 
                    onClick={() => setSelectedRoyalty(null)}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default CreateTransactionForm;
