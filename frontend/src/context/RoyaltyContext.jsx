import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const RoyaltyContext = createContext();

export const RoyaltyProvider = ({ children }) => {
    const [royalties, setRoyalties] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState(null);

    const fetchRoyaltyByArtist = async (artistId) => {
        const token = sessionStorage.getItem("token");
        try {
            // console.log("Fetching royalties for artistId:", artistId); // Debugging log
            const res = await axios.get(`https://localhost:5003/api/royalty/artists/${artistId}`,{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log("API Response:", res.data);
            setRoyalties(res.data?.royalties|| []);
        } catch (error) {
            console.error("Error fetching royalty data:", error);
        }
    };
    

    return (
        <RoyaltyContext.Provider value={{ royalties, selectedArtist, setSelectedArtist, fetchRoyaltyByArtist }}>
            {children}
        </RoyaltyContext.Provider>
    );
};

export const useRoyalty = () => {
    const context = useContext(RoyaltyContext);
    if (!context) {
        throw new Error("useRoyalty must be used within a RoyaltyProvider");
    }
    return context;
};
