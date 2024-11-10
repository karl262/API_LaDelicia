const express = require('express');
const employeesRoutes = require('./src/routes/employeeRoutes');

require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/employees', employeesRoutes);

const port = process.env.PORT || 3000;
app.listen(port,'0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
}); 