const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();


// Allow requests from:
const cors = require('cors');
const allowedOrigins = [
  'https://sandile-portfolio.web.app',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'https://sandile-mabilisa.netlify.app',
  'https://fluffy-orbit-x6gp6wpv9rqc5pj-5500.app.github.dev'
];

app.use(cors({ origin: allowedOrigins }));

app.options('/submit-form', cors());
app.options('/chat', cors());

app.use(bodyParser.json());


// AI Config
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
  res.send('Welcome to my dashboard!');
});


// Send the email
app.post('/submit-form', async (req, res) => {
  const { FormData } = req.body;
  const userName = FormData.name;
  const userEmail = FormData.email;
  const userSubject = FormData.subject;
  const userMessage = FormData.message;

  //View form data
  console.log("FormData: ", FormData);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mabilisasandile@gmail.com',
      pass: 'mqyi iljm qznv bocd',
    },
  });

  const mailOptions = {
    from: userEmail,
    to: 'mabilisasandile@gmail.com',
    subject: userSubject,
    text: `Message from my portfolio app!\n\nSender message: ${userMessage} \n\nFrom: ${userEmail} \n\nName: ${userName}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send('Email sent successfully');
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});


// Open AI Chat post method
app.post('/chat', async (req, res) => {
  const question = req.body.message;

  const context = `
  You are a chatbot assistant for Sandile Mabilisa.
  Skills: HTML5, CSS, JavaScript, React, Express.js, Python, Django, C#, MySQL, PostgreSQL, MongoDB, Firebase, Microsoft Azure.
  Projects: Portfolio, E-learning, Booking App.
  Education: National Diploma in IT - Software Development.
  Career Goal: Cloud Engineer.
  `;

  const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: context },
    { role: "user", content: question }
  ]
});

  const reply = response.data.choices[0].message.content;
  res.json({ reply });
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
