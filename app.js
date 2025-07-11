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
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    }
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
// app.post('/chat', async (req, res) => {
//   try {
//     const question = req.body.message;

//     const context = `
//     You are a chatbot assistant for Sandile Mabilisa.
//     Skills: HTML5, CSS, JavaScript, React, Express.js, Python, Django, C#, MySQL, PostgreSQL, MongoDB, Firebase, Microsoft Azure.
//     Projects: Portfolio, E-learning, Booking App.
//     Education: National Diploma in IT - Software Development.
//     Career Goal: Cloud Engineer.
//     `;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         { role: "system", content: context },
//         { role: "user", content: question }
//       ]
//     });

//     const reply = response.choices[0].message.content;
//     res.json({ reply });

//   } catch (error) {
//     console.error("OpenAI Error:", error);
//     res.status(500).json({ reply: "Sorry, the chatbot is unavailable at the moment." });
//   }
// });

const knowledgeBase = {
  name: "Sandile Mabilisa",
  skills: ["HTML5", "CSS", "JavaScript", "React", "Express.js", "Python", "Django", "C#", "MySQL", "PostgreSQL", "MongoDB", "Firebase", "Microsoft Azure"],
  projects: ["Portfolio website", "Smart Campus Service Web App", "E-Commerce Web App", "E-learning platform", "Hotel Booking app", "and many more"],
  education: "National Diploma in IT - Software Development",
  experience: "I have 2 years of work experience. For more details, download my CV by clicking on the 'Download CV' button from home screen.",
  goals: "To become a Software Engineer",
  age: "I am 32 years old",
  location: "I live in Pretoria, Gauteng, South Africa.",
  phone: "You can call me at +2773 490 8931",
  email: "Here is my email address: mabilisasandile@gmail.com"
};

app.post('/chat', (req, res) => {
  const question = req.body.message.toLowerCase();

  let reply = "I'm not sure how to answer that.";

  if (question.includes("name")) reply = `My name is ${knowledgeBase.name}.`;
  else if (question.includes("skill")) reply = `My skills include: ${knowledgeBase.skills.join(", ")}.`;
  else if (question.includes("project")) reply = `I've worked on: ${knowledgeBase.projects.join(", ")}.`;
  else if (question.includes("education")) reply = `I studied ${knowledgeBase.education}.`;
  else if (question.includes("goal") || question.includes("dream")) reply = knowledgeBase.goals;
  else if (question.includes("age") || question.includes("old")) reply = knowledgeBase.age;
  else if (question.includes("location") || question.includes("address")) reply = knowledgeBase.location;
  else if (question.includes("experience") || question.includes("work")) reply = knowledgeBase.experience;
  else if (question.includes("phone") || question.includes("contact")) reply = knowledgeBase.experience;
  else if (question.includes("email") || question.includes("message")) reply = knowledgeBase.experience;

  res.json({ reply });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
