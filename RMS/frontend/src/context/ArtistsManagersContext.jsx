import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ArtistsManagersContext = createContext();

export const ArtistsManagersProvider = ({ children }) => {
    const [artists, setArtists] = useState([]);
    const [managers, setManagers] = useState([]);
    const [managerStats, setManagerStats] = useState([]);
    const [token, setToken] = useState(sessionStorage.getItem("token")); // Initialize with sessionStorage

    useEffect(() => {
        const fetchData = async () => {
            const storedToken = sessionStorage.getItem("token"); // Always get latest token
            if (!storedToken) return; // If token is missing, stop here
            // console.log("Fetching data with token:", storedToken); // Debugging log

            try {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedToken}`,
                };

                const [artistsRes, managersRes] = await Promise.all([
                    axios.get("http://localhost:3000/api/users/role/Artist", { headers }),
                    axios.get("http://localhost:3000/api/users/role/Manager", { headers })
                ]);

                // console.log("Artists Response:", artistsRes.data); // Debugging API Response
                // console.log("Managers Response:", managersRes.data);

                const fetchedArtists = artistsRes.data?.users || [];
                const fetchedManagers = managersRes.data?.users || [];

                setArtists(fetchedArtists);
                setManagers(fetchedManagers);

                // Initialize and calculate manager statistics
                const managerData = fetchedManagers.reduce((acc, manager) => {
                    acc[manager._id] = {
                        name: manager.fullName,
                        totalStreams: 0,
                        totalRoyalty: 0,
                    };
                    return acc;
                }, {});

                fetchedArtists.forEach((artist) => {
                    if (artist.manager && managerData[artist.manager]) {
                        managerData[artist.manager].totalStreams += artist.totalStreams || 0;
                        managerData[artist.manager].totalRoyalty += artist.fullRoyalty || 0;
                    }
                });

                const formattedManagerStats = Object.values(managerData).sort((a, b) => {
                    if (b.totalStreams !== a.totalStreams) return b.totalStreams - a.totalStreams;
                    return b.totalRoyalty - a.totalRoyalty;
                });

                setManagerStats(formattedManagerStats);
            } catch (error) {
                console.error("Error fetching artists and managers:", error);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 60000); // Fetch every 1 min

        return () => clearInterval(interval); // Cleanup on unmount

    }, [token]); // Ensure it runs when token changes

    // Listen for token changes
    useEffect(() => {
        const interval = setInterval(() => {
            const newToken = sessionStorage.getItem("token");
            if (newToken !== token) {
                // console.log("Token updated, refetching data...");
                setToken(newToken);
            }
        }, 1000); // Check every second (adjust as needed)

        return () => clearInterval(interval);
    }, [token]);

    return (
        <ArtistsManagersContext.Provider value={{ artists, managers, managerStats }}>
            {children}
        </ArtistsManagersContext.Provider>
    );
};

export const useArtistsManagers = () => useContext(ArtistsManagersContext);


// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// const ArtistsManagersContext = createContext();

// export const ArtistsManagersProvider = ({ children }) => {
//     const [artists, setArtists] = useState([]);
//     const [managers, setManagers] = useState([]);
//     const [managerStats, setManagerStats] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetch Artists and Managers data from API
//                 const artistsRes = await axios.get("http://localhost:3000/api/users/role/Artist");
//                 const managersRes = await axios.get("http://localhost:3000/api/users/role/Manager");

//                 // console.log("Artists API Response:", artistsRes.data);
//                 // console.log("Managers API Response:", managersRes.data);

//                 const fetchedArtists = artistsRes.data?.users || [];
//                 const fetchedManagers = managersRes.data?.users || [];

//                 setArtists(fetchedArtists);
//                 setManagers(fetchedManagers);

//                 // Initialize manager statistics with all managers
//                 const managerData = fetchedManagers.reduce((acc, manager) => {
//                     acc[manager._id] = {
//                         name: manager.fullName,
//                         totalStreams: 0,
//                         totalRoyalty: 0,
//                     };
//                     return acc;
//                 }, {});

//                 // Calculate manager statistics based on artist data
//                 fetchedArtists.forEach((artist) => {
//                     if (artist.manager && managerData[artist.manager]) {
//                         managerData[artist.manager].totalStreams += artist.totalStreams || 0;
//                         managerData[artist.manager].totalRoyalty += artist.fullRoyalty || 0;
//                     }
//                 });

//                 // Convert object to sorted array
//                 const formattedManagerStats = Object.values(managerData).sort((a, b) => {
//                     if (b.totalStreams !== a.totalStreams) {
//                         return b.totalStreams - a.totalStreams;
//                     }
//                     return b.totalRoyalty - a.totalRoyalty;
//                 });

//                 setManagerStats(formattedManagerStats);
//             } catch (error) {
//                 console.error("Error fetching artists and managers:", error);
//             }
//         };

//         fetchData();
//     }, []);

//     return (
//         <ArtistsManagersContext.Provider value={{ artists, managers, managerStats }}>
//             {children}
//         </ArtistsManagersContext.Provider>
//     );
// };

// export const useArtistsManagers = () => useContext(ArtistsManagersContext);
