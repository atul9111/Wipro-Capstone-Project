import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
// Declaring State Variables
const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const history = useHistory();
    const { login } = useContext(UserContext);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    //Handling Login
    const handleLogin = async (e) => {
        e.preventDefault();
    
        // validation checks
        if (!credentials.email.includes("@")) {
            alert("Please enter a valid email.");
            return;
        }
        if (credentials.password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }
         //Sending API Request
        try {
            const response = await axios.get(
                `http://localhost:4000/users?email=${credentials.email}&password=${credentials.password}`
            );
            //Checking User Existence
            if (response.data.length > 0) {
                const user = response.data[0];
                login(user);
                history.push(user.role === "admin" ? "/" : "/profiles"); 
            } else {
                alert("Invalid email or password");
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };
    

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <label>
                    Email:
                    <input 
                        type="email" 
                        name="email" 
                        value={credentials.email} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Password:
                    <input 
                        type="password" 
                        name="password" 
                        value={credentials.password} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <button type="submit">Login</button>
            </form>
            <button onClick={() => history.push('/signup')}>Sign Up</button>
        </div>
    );
};

export default Login;
