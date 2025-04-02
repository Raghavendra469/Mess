import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ArtistsManagersContext = createContext();

export const ArtistsManagersProvider = ({ children }) => {
    const [artists, setArtists] = useState([]);
    const [managers, setManagers] = useState([]);
    const [managerStats, setManagerStats] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const storedToken = sessionStorage.getItem("token"); // Always get latest token
            if (!storedToken) return; // If token is missing, stop here


            try {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedToken}`,
                };

                const [artistsRes, managersRes] = await Promise.all([
                    axios.get("http://localhost:5005/api/users/role/Artist", { headers }),
                    axios.get("http://localhost:5005/api/users/role/Manager", { headers })
                ]);

               

                const fetchedArtists = artistsRes.data?.users || [];
                const fetchedManagers = managersRes.data?.users || [];

                const formattedArtists = fetchedArtists.sort((a, b) => {
                    if (b.totalStreams !== a.totalStreams) return b.totalStreams - a.totalStreams;
                    return b.fullRoyalty - a.fullRoyalty;
                });

                setArtists(formattedArtists);
                setManagers(fetchedManagers);

                // Initialize and calculate manager statistics
                const managerData = fetchedManagers.reduce((acc, manager) => {
                    acc[manager._id] = {
                        fullName: manager.fullName,
                        totalStreams: 0,
                        fullRoyalty: 0,
                    };
                    return acc;
                }, {});

                fetchedArtists.forEach((artist) => {
                    if (artist.manager && managerData[artist.manager]) {
                        managerData[artist.manager].totalStreams += artist.totalStreams || 0;
                        managerData[artist.manager].fullRoyalty += artist.fullRoyalty || 0;
                    }
                });

                const formattedManagerStats = Object.values(managerData).sort((a, b) => {
                    if (b.totalStreams !== a.totalStreams) return b.totalStreams - a.totalStreams;
                    return b.fullRoyalty - a.fullRoyalty;
                });

                

                setManagerStats(formattedManagerStats);
            } catch (error) {
                console.error("Error fetching artists and managers:", error);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 60000); // Fetch every 1 min

        return () => clearInterval(interval); // Cleanup on unmount

    }, []);

    return (
        <ArtistsManagersContext.Provider value={{ artists, managers, managerStats }}>
            {children}
        </ArtistsManagersContext.Provider>
    );
};

export const useArtistsManagers = () => useContext(ArtistsManagersContext);


