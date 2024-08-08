const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

module.exports = async (req, res) => {
  // Enable CORS by setting headers directly in the serverless function
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin, or specify your frontend URL
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Failed to send message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};
