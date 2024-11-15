require('dotenv').config();
const swaggerDocs = require('./src/config/swagger.js');    
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

swaggerDocs(app);
app.use(bodyParser.json());
app.use('/api/Auths', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Auth Service is running on port ${PORT}`);
});

module.exports = app;