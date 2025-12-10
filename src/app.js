const express = require('express');
require('express-async-errors');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const { setupGraphQL } = require('./routes/graphql');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// REST routes
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

// GraphQL
setupGraphQL(app);

// error handler (last)
app.use(errorMiddleware);

module.exports = app;
