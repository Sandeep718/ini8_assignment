// server.js
const express = require('express');
const mysql2 = require('mysql2');
const bodyParser = require('body-parser');
const cors = require("cors");


const app = express();
app.use(cors())
const PORT = 3010;

// Create MySQL connection
const db = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create table for users if not exists
const createUsersTable = `CREATE TABLE IF NOT EXISTS registration (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  dob DATE NOT NULL,
  age INT NOT NULL
)`;
db.query(createUsersTable, (err) => {
  if (err) {
    console.error('Error creating users table:', err);
    return;
  }
  console.log('Users table created');
});

// Create User
app.post('/api/users', (req, res) => {
  const { name, email, dob,age } = req.body;
  if (!name || !email || !dob||!age) {
    return res.status(400).json({ error: 'Please provide name, email, and date of birth' });
  }

  const insertUserQuery = 'INSERT INTO registration (name, email, dob,age) VALUES (?, ?, ?,?)';
  db.query(insertUserQuery, [name, email, dob,age], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ error: 'Error inserting user' });
    }
    res.status(201).json({ message: 'User created successfully' });
  });
});

// Read Users
app.get('/api/users', (req, res) => {
  const getUsersQuery = 'SELECT * FROM registration';
  db.query(getUsersQuery, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Error fetching users' });
    }
    res.json(results);
  });
});

// Delete User
app.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;

  const deleteUserQuery = 'DELETE FROM registration WHERE id = ?';
  db.query(deleteUserQuery, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Error deleting user' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});
//update
// Update operation
app.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const { name, email, dob, age } = req.body;

  const updateUserQuery = 'UPDATE registration SET name = ?, email = ?, dob = ?, age = ? WHERE ID = ?';
  db.query(updateUserQuery, [name, email, dob, age, id], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'Error updating user' });
    }
    res.json({ message: 'User updated successfully' });
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});