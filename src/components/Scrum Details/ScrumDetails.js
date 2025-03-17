import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { useHistory } from 'react-router-dom';

// Declaring State and Context
const ScrumDetails = ({ scrum }) => {
    const { user } = useContext(UserContext);
    const history = useHistory();
    
    const [scrumData, setScrumData] = useState({
        tasks: [],
        users: []
    });
     //Checking If User Is Logged In
    useEffect(() => {
        if (!localStorage.getItem('user')) {
            history.push('/login');
        }
    }, [history]);
    
    //Fetching Scrum Details
    useEffect(() => {
        const fetchScrumDetails = async () => {
            try {
                const { data: tasks } = await axios.get(`http://localhost:4000/tasks?scrumId=${scrum.id}`);
                const { data: allUsers } = await axios.get('http://localhost:4000/users');

                const assignedUsers = allUsers.filter(u => tasks.some(t => t.assignedTo === u.id));
                
                setScrumData({ tasks, users: assignedUsers });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchScrumDetails();
    }, [scrum.id]);
    
    //Updating Task Status
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await axios.patch(`http://localhost:4000/tasks/${taskId}`, {
                status: newStatus,
                history: [
                    ...scrumData.tasks.find(task => task.id === taskId).history,
                    { status: newStatus, date: new Date().toISOString().split('T')[0] }
                ]
            });

            setScrumData(prevData => ({
                ...prevData,
                tasks: prevData.tasks.map(task =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            }));
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    return (
        <div>  
            {/* scrum details */}
            <h3>Scrum Details: {scrum.name}</h3>

            <h4>Tasks</h4>
            <ul>
                {scrumData.tasks.map(({ id, title, description, status }) => (
                    <li key={id}>
                        <strong>{title}:</strong> {description} - <em>{status}</em>
                        {/* If Admin */}
                        {user?.role === 'admin' && (  
                            <select value={status} onChange={(e) => handleStatusChange(id, e.target.value)}>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        )}
                    </li>
                ))}
            </ul>

            <h4>Users</h4>
            <ul>
                {scrumData.users.map(({ id, name, email }) => (
                    <li key={id}>{name} ({email})</li>
                ))}
            </ul>
        </div>
    );
};

export default ScrumDetails;
