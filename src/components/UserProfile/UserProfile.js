import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
// Declaring State and Context
const UserProfile = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'employee' });
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user?.role === 'admin') {  // If admin, fetch all users
            fetchUsers();
        } else {
            setSelectedUser(user);   // If employee, set themselves as selected
            fetchTasks(user?.id);
        }
    }, [user]);
    // Fetching All Users (Only for Admin)
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:4000/users');
            setUsers(response.data.filter(u => u?.role !== 'admin'));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    //Fetching Tasks for a Specific User
    const fetchTasks = async (userId) => {
        if (!userId) return;
        try {
            const response = await axios.get(`http://localhost:4000/tasks?assignedTo=${userId}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };
    // Fetching Task History for a Selected User (Admin Feature)
    const handleGetHistory = (userId) => {
        const foundUser = users.find(u => u?.id === userId);
        setSelectedUser(foundUser);
        fetchTasks(userId);
    };
    // Adding a New User (Admin Feature)
    const handleAddUser = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:4000/users', newUser);
            fetchUsers();
            setShowForm(false);
            setNewUser({ name: '', email: '', password: '', role: 'employee' });
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <div>
            <h2>User Profiles</h2>

            {user?.role === 'admin' && (     //if admin
    <>
        <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New User'}
        </button>
         {/* New User Form (Only for Admin) */}
        {showForm && (
            <form onSubmit={handleAddUser}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>Role:</label>
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        required
                    >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button type="submit">Create User</button>
            </form>
        )}
          
        {/* List of Users (Only for Admin) */}
        <ul>
            {users.map((u) => (
                <li key={u.id}>
                    <strong>Name:</strong> {u.name} <br />
                    <strong>Email:</strong> {u.email} <br />
                    {/* Get history button */}
                    <button onClick={() => handleGetHistory(u.id)}>Get History</button> 
                </li>
            ))}
        </ul>
    </>
)}
            {/* Get histroy details */}
            {(user?.role !== 'admin' || selectedUser) && (
                <div>
                    <h3>Tasks Worked By {selectedUser?.name}</h3>
                    <ul>
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <li key={task.id}>
                                    <strong>Title:</strong> {task.title} <br />
                                    <strong>Description:</strong> {task.description} <br />
                                    <strong>Status:</strong> {task.status}
                                </li>
                            ))
                        ) : (
                            <p>No tasks assigned.</p>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
