import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null); // Store logged-in user data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await axios.get("http://localhost:3000/api/auth/verify", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.data.success) {
                        const loggedInUser = response.data.user;
                        setUser(loggedInUser);
                        await fetchRoleData(loggedInUser); // Ensure role data is fetched before setting loading to false
                    }
                } else {
                    setUser(null);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Verification failed:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    // Fetch artist or manager data based on role
    const fetchRoleData = async (loggedInUser) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/users/${loggedInUser.username}`);
            if (response.data.success) {
                // console.log("User Data:", response.data.user);
                setUserData(response.data.user);
            }
        } catch (error) {
            console.error("Error fetching role data:", error);
        }
    };

    // Handle login
    const login = async (userData, token) => {
        localStorage.setItem("token", token);
        setUser(userData);
        await fetchRoleData(userData); // Fetch role data for the logged-in user
    };

    // Handle logout
    const logout = () => {
        setUser(null);
        setUserData(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, userData, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use authentication context
export const useAuth = () => useContext(AuthContext);
