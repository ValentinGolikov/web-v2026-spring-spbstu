const express = require('express');
const cors = require('cors');

const goodsRouter = require('./routes/goods');
const { router: authRouter } = require('./routes/auth');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/goods', goodsRouter);
app.use('/api/login', authRouter);
app.use('/api/orders', ordersRouter);

app.listen(PORT, () => {
  console.log(`Gadget Hub server is running on http://localhost:${PORT}`);
});

module.exports = app;
