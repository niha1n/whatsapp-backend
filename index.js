const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Middleware to parse JSON
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

app.post('/api/sendMessage', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Formatting the message
  const formattedMessage = `
    Name: ${name}
    Email: ${email}
    Subject: ${subject}

    Message:
    ${message}
  `;

  try {
    // Sending message to WhatsApp using Twilio
    await client.messages.create({
      body: formattedMessage,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.PERSONAL_WHATSAPP_NUMBER
    });

    res.status(200).send({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Failed to send message:', error);
    res.status(500).send({ success: false, message: 'Failed to send message.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
