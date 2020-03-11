require('dotenv').config();

const express = require('express');

const socketio = require('socket.io');

const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const app = express();
const PORT = process.env.PORT || 3003;
const apiRouter = require('./routes/api');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
require('./configurations/passport')(passport);

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send(`Listening on port ${PORT}`);
});

app.use(function(req, res, next) {
  res.status(404).json({ message: 'Not found' });
});

mongoose
  .connect(process.env.db_uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Database Connected'))
  .catch(err => console.log(err));

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const io = socketio(server, { pingTimeout: 60000 });
require('./configurations/socket')(io);
