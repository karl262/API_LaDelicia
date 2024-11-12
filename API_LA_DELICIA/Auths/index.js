// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const authRoutes = require('./src/routes/authRoutes.js');
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './src/routes/authRoutes.js';
const app = express();

app.use(bodyParser.json());
app.use('/api/auths', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Auth Service is running on port ${PORT}`);
});

// module.exports = app;
export default app;