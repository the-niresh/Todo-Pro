import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContent = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;
    
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)

    const getAuthState = async () => {
        try {
            const {data} = await axios.post(backendURL + "/api/auth/is-auth")
            if(data.success) {
                setIsLoggedIn(true)
                getUserData()
            }
        } catch (error) {
            // toast.error(error.message)
        }
    }
    
    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendURL + '/api/auth/me')
            data ? setUserData(data) : toast.error("Login fail")
        } catch (error) {
            // toast.error(error.message)
        }
    }

    useEffect(() => {
        getAuthState();
    });

    const value = {
        backendURL,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData
    }
    return(
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}