import './App.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";



function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [age,setAge]=useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3010/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users. please try again.')
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!dob) {
      errors.dob = 'Date of Birth is required';
    }
    if (!age) {
      errors.age = 'Age is required';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };
  


  const handleAddUser = async () => {
    if (!validateForm()) {
      return;
    }

    const newUser = {
      name: name,
      email: email,
      dob: dob,
      age: age
    };

    try {
      if (editingIndex !== null) {
        await axios.put(`http://localhost:3010/api/users/${users[editingIndex].id}`, newUser);
      } else {
        await axios.post('http://localhost:3010/api/users', newUser);
      }
      fetchUsers();
      setName('');
      setEmail('');
      setDob('');
      setAge('');
      setEditingIndex(null);
    } catch (error) {
      console.error('Error adding/updating user:', error);
    }
  };

  const handleEditUser = (index) => {
    const user = users[index];
    setName(user.name);
    setEmail(user.email);
    setDob(user.dob);
    setAge(user.age);
    setEditingIndex(index);
  };

  const handleDeleteUser = async (index) => {
    try {
      await axios.delete(`http://localhost:3010/api/users/${users[index].id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };


  return (
    <div className="App">
      <h1>User Registration</h1>
      <div className={formErrors.name ? 'field-error' : ''}>
        <label>Name:</label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
        {formErrors.name && <p className='error'>{formErrors.name}</p>}
      </div>
      <div className={formErrors.email ? 'field-error' : ''}>
        <label>Email:</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        {formErrors.email && <p className='error'>{formErrors.email}</p>}
      </div>
      <div className={formErrors.dob ? 'field-error' : ''}>
        <label>Date of Birth:</label>
        <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} />
        {formErrors.dob && <p className='error'>{formErrors.dob}</p>}
      </div>
      <div className={formErrors.age ? 'field-error' : ''}>
        <label>Age:</label>
        <input type="number" required value={age} onChange={(e) => setAge(e.target.value)} />
        {formErrors.age && <p className='error'>{formErrors.age}</p>}
      </div>
      <button className='add-user-btn' onClick={handleAddUser}>{editingIndex !== null ? 'Update User' : 'Add User'}</button>
      {error && <p className='error'>{error}</p>}
      <h2>Registered Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.dob}</td>
              <td>{user.age}</td>
              <td className='buttons'>
                <button onClick={() => handleEditUser(index)}><FaRegEdit/>Edit</button>
                <button onClick={() => handleDeleteUser(index)}><RiDeleteBinLine/>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;