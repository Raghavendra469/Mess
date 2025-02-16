import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/transactions";

const TransactionService = {

    fetchTransactions: async (role,id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user/${role.toLowerCase()}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching transactions:", error);
            return [];
        }
    },


    createTransaction: async (transactionData) => {
        try {
            const response = await axios.post(API_BASE_URL, transactionData);
            return { success: true, message: "Transaction created successfully!" };
        } catch (error) {
            return { success: false, message: error.response?.data?.error || "Error creating transaction." };
        }
    },

    deleteTransaction: async (transactionId) => {
        try {
            await axios.delete(`${API_BASE_URL}/${transactionId}`);
            return { success: true, message: "Transaction deleted successfully!" };
        } catch (error) {
            return { success: false, message: error.response?.data?.error || "Error deleting transaction." };
        }
    },

    payTransaction: async (transactionId,paymentAmount) => {
        try {
            await axios.post(`${API_BASE_URL}/pay`, { transactionId, paymentAmount });
            return { success: true, message: "Payment successful!" };
        } catch (error) {
            return { success: false, message: error.response?.data?.error || "Error processing payment." };
        }
    }
};

export default TransactionService;
