const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const paypal = require('paypal-rest-sdk');
const dotenv = require('dotenv');
const Database = require('better-sqlite3');
const axios = require('axios');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// setup db
const db = new Database(process.env.SQLITE_FILE || './data.sqlite');
db.prepare("CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY, buyer TEXT, paid INTEGER)").run();

// paypal config
paypal.configure({
  'mode': 'sandbox', // or 'live'
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

// API route
app.get('/api/tickets', (req, res) => {
  const tickets = db.prepare("SELECT * FROM tickets").all();
  res.json(tickets);
});

// serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));