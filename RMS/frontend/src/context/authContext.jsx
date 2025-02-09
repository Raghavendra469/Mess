import React, { createContext, useState, useContext, useEffect } from "react";
import axios from 'axios'
const AuthContext = createContext();

export const AuthProvider = ({ children }) => { // Renamed to PascalCase
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const verifyUser= async () => {
            
            try{
                const token = localStorage.getItem('token')
            if (token){
                const response = await axios.get('http://localhost:3000/api/auth/verify', {
                    headers:{
                        "Authorization" : `Bearer ${token}`
                    }
                })
                if(response.data.success){
                    // console.log("password",response.data.user.password);
                    setUser(response.data.user)
                    console.log(response.data.user);
                }
            }
            else{
                setUser(null);
                setLoading(false);
            }    
            }catch(error){
               if(error.response && !error.response.data.error){
                setUser(null)
               }
            }finally{
                setLoading(false)
            }
        }   
        verifyUser()
     }, [])

    const login = (user) => {
        setUser(user);
        // console.log("login",user);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Ensure `useAuth` returns the context
export const useAuth = () => {
    return useContext(AuthContext);
};
