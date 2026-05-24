const express = require('express');
const authRoutes = require('./routes/auth.route');


const app = express();
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
}       
);
app.use('/api/auth', authRoutes);

module.exports = app;