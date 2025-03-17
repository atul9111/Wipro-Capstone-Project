import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

//Creating the UserProvider Component
const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        //Saved user from localStorage
        return JSON.parse(localStorage.getItem('user')) || null;
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    //Saves the user info in localStorage
    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };
     //Removes the user from localStorage.
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider, UserContext };
