import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ArtistsManagersContext = createContext();

export const ArtistsManagersProvider = ({ children }) => {
    const [artists, setArtists] = useState([]);
    const [managers, setManagers] = useState([]);
    const [managerStats, setManagerStats] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Artists and Managers data from API
                const artistsRes = await axios.get("http://localhost:3000/api/users/role/Artist");
                const managersRes = await axios.get("http://localhost:3000/api/users/role/Manager");

                // console.log("Artists API Response:", artistsRes.data);
                // console.log("Managers API Response:", managersRes.data);

                const fetchedArtists = artistsRes.data?.users || [];
                const fetchedManagers = managersRes.data?.users || [];

                setArtists(fetchedArtists);
                setManagers(fetchedManagers);

                // Initialize manager statistics with all managers
                const managerData = fetchedManagers.reduce((acc, manager) => {
                    acc[manager._id] = {
                        name: manager.fullName,
                        totalStreams: 0,
                        totalRoyalty: 0,
                    };
                    return acc;
                }, {});

                // Calculate manager statistics based on artist data
                fetchedArtists.forEach((artist) => {
                    if (artist.manager && managerData[artist.manager]) {
                        managerData[artist.manager].totalStreams += artist.totalStreams || 0;
                        managerData[artist.manager].totalRoyalty += artist.fullRoyalty || 0;
                    }
                });

                // Convert object to sorted array
                const formattedManagerStats = Object.values(managerData).sort((a, b) => {
                    if (b.totalStreams !== a.totalStreams) {
                        return b.totalStreams - a.totalStreams;
                    }
                    return b.totalRoyalty - a.totalRoyalty;
                });

                setManagerStats(formattedManagerStats);
            } catch (error) {
                console.error("Error fetching artists and managers:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <ArtistsManagersContext.Provider value={{ artists, managers, managerStats }}>
            {children}
        </ArtistsManagersContext.Provider>
    );
};

export const useArtistsManagers = () => useContext(ArtistsManagersContext);
