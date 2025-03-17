import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ScrumDetails from '../Scrum Details/ScrumDetails';
import { UserContext } from '../../context/UserContext';
// Declaring State Variables
const Dashboard = () => {
    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [scrumData, setScrumData] = useState({ name: '', title: '', description: '', status: 'To Do', assignedTo: '' });
    const { user } = useContext(UserContext);
     
    // Fetching Scrum & User Data (When Component Loads)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [scrumResponse, userResponse] = await Promise.all([
                    axios.get('http://localhost:4000/scrums'),
                    axios.get('http://localhost:4000/users')
                ]);
                setScrums(scrumResponse.data);
                setUsers(userResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    // Fetching Scrum Details When Clicking "Get Details"
    const handleGetDetails = async (scrumId) => {
        try {
            const response = await axios.get(`http://localhost:4000/scrums/${scrumId}`);
            setSelectedScrum(response.data);
        } catch (error) {
            console.error('Error fetching scrum details:', error);
        }
    };
    // Handling Form Input Changes
    const handleInputChange = (e) => {
        setScrumData({ ...scrumData, [e.target.name]: e.target.value });
    };

    const handleAddScrum = async (event) => {
        event.preventDefault();   //Prevents page refresh
        try {
            const { name, title, description, status, assignedTo } = scrumData;
            const newScrumResponse = await axios.post('http://localhost:4000/scrums', { name });
            const newScrum = newScrumResponse.data;
            
            await axios.post('http://localhost:4000/tasks', {
                title,
                description,
                status,
                scrumId: newScrum.id,
                assignedTo,
                history: [{ status, date: new Date().toISOString().split('T')[0] }],
            });
            
            const updatedScrums = await axios.get('http://localhost:4000/scrums');
            setScrums(updatedScrums.data);
            setShowForm(false);
            setScrumData({ name: '', title: '', description: '', status: 'To Do', assignedTo: '' });
        } catch (error) {
            console.error('Error adding scrum:', error);
        }
    };

    return (
        <div>
            <h2>Scrum Teams</h2>
            {user?.role === 'admin' && (     //if admin  
                <div>
                    <button onClick={() => setShowForm(!showForm)}> 
                        {/* Add Scrum */}
                        {showForm ? 'Cancel' : 'Add New Scrum'} 
                    </button>
                    {showForm && (
                        <form onSubmit={handleAddScrum}>
                            {['scrum Name', 'task Title', 'task Description'].map((field) => (
                                <div key={field}>
                                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={scrumData[field]}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            ))}
                            <div>
                                <label>Task Status:</label>
                                <select name="status" value={scrumData.status} onChange={handleInputChange} required>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div>
                                <label>Assign To:</label>
                                <select name="assignedTo" value={scrumData.assignedTo} onChange={handleInputChange} required>
                                    <option value="">Select a user</option>
                                    {users.map(({ id, name, email }) => (
                                        <option key={id} value={id}>{name} ({email})</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit">Create Scrum</button>
                        </form>
                    )}
                </div>
            )}
             {/* Showing details */}
            <ul>
                {scrums.map(({ id, name }) => (
                    <li key={id}>
                        {name}
                        <button onClick={() => handleGetDetails(id)}>Get Details</button>
                    </li>
                ))}
            </ul>
            {selectedScrum && <ScrumDetails scrum={selectedScrum} />}
        </div>
    );
};

export default Dashboard;
