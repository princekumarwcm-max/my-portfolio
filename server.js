const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); 

// Serve static frontend files
app.use(express.static(path.join(__dirname, '')));

// Email Configuration
// IMPORTANT: You need to create a Gmail App Password
// Go to Google Account -> Security -> 2-Step Verification -> App passwords
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'princekumar.wcm@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || 'YOUR_GMAIL_APP_PASSWORD' 
    }
});

// API endpoint to handle contact form submission
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    const newMessage = {
        id: Date.now(),
        name,
        email,
        message,
        date: new Date().toISOString()
    };

    try {
        // 1. Save to local file (Note: This may fail on Vercel as filesystem is read-only/ephemeral)
        try {
            const messagesFile = path.join(__dirname, 'messages.json');
            let messages = [];
            if (fs.existsSync(messagesFile)) {
                const data = fs.readFileSync(messagesFile, 'utf8');
                if (data) messages = JSON.parse(data);
            }
            messages.push(newMessage);
            fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
        } catch (fsError) {
            console.warn('FileSystem write failed (Expected on Vercel):', fsError.message);
        }

        // 2. Send Email
        const mailOptions = {
            from: 'princekumar.wcm@gmail.com',
            to: 'princekumar.wcm@gmail.com',
            subject: `New Portfolio Query from ${name}`,
            text: `You have a new message from your portfolio:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        };

        if (!process.env.GMAIL_APP_PASSWORD) {
            throw new Error('GMAIL_APP_PASSWORD not set in environment variables');
        }

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
