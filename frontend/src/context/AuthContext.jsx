import { useEffect, createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // check saved login 
    useEffect(() => {
        const savedToken = localStorage.getItem("token");

        const savedUser = localStorage.getItem("user");

        if(savedToken && savedUser) {
            setToken(savedToken);

            setUser(JSON.parse(savedUser));

        }
    }, []);

    // login 
    const login = (userData, jwtToken) => {
        localStorage.setItem("token", jwtToken);

        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);

        setToken(jwtToken);
    };

    //logout
    const logout = () => {
        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

        setToken(null);
    };

    return (
        <AuthContext.Provider value={{
            user, token, login, logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;