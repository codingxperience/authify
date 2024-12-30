import express from 'express';
import {connectToDatabase} from '../lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({message: 'User already exists'});
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashPassword]);
    res.status(201).json({message: 'User created successfully'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Internal Server Error'});
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({message: 'Invalid credentials'});
    }
    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(404).json({message: 'Wrong Password'});
    }
    const token = jwt.sign({id: rows[0].id}, process.env.JWT_KEY, {expiresIn: '5h'});
    res.status(201).json({token: token});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Internal Server Error'});
  }
}); 

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
      if (!token) {
        return res.status(401).json({message: 'Unauthorized'});
      }
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      req.userId = user.id;
      next();  
  } catch (error) {
    return res.status(401).json({message: 'Unauthorized'});
  }
  
}

router.get('/home', verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.userId]);
    if (rows.length === 0) {
      return res.status(404).json({message: 'User not found'});
    }
    return res.status(200).json({user: rows[0]});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Internal Server Error'});
  }
});
export default router;