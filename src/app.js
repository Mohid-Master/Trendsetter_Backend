const express = require('express');
const authRoutes = require('./routes/auth.route');
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
}       
);
app.use('/api/auth', authRoutes);
app.use('/api/products', require('./routes/product.route'));
app.use('/api/users', require('./routes/user.route'));

module.exports = app;