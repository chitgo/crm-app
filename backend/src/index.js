const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const customersRoutes = require('./routes/customers');
const leadsRoutes = require('./routes/leads');

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/leads', leadsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
