const express = require('express');
const cors = require('cors');
const usersRoutes = require('./src/routes/usersRoutes');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('api/users',usersRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});