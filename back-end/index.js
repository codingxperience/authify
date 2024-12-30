// const express = require('express');
import express from 'express';
// const bodyParser = require('body-parser');
// const cors = require('cors');
import cors from 'cors';
const app = express();
import authRouter from './routes/authRoutes.js';

// Middleware
// app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);

// Routes
// app.get('/', (req, res) => {
//   res.send('Welcome to the Authify API');
// });

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});