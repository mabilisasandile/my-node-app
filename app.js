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


const birthDate = new Date("1993-01-22");

// Function to calculate age
function calculateAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}


const knowledgeBase = {
  name: "Sandile Mabilisa",
  about: "I am a Software Developer with over one year of work experience. I possess a Diploma in IT Software Development. I have a strong passion of crafting innovative solutions through web and mobile app development. With hands-on experience gained during my time at mLab and Bavelile Consultants, I have honed my skills in both front-end and back-end development.",
  skills: ["HTML5", "CSS", "JavaScript", "React", "Express.js", "Python", "Django", "C#", "MySQL", "PostgreSQL", "MongoDB", "Firebase", "Microsoft Azure"],
  projects: ["Portfolio website", "Smart Campus Service Web App", "E-Commerce Web App", "E-learning platform", "Hotel Booking app", "and many more"],
  education: "National Diploma in IT - Software Development",
  experience: "I have over a year of work experience in the software development field. For more details, download my CV at: https://sandile-mabilisa.netlify.app/assets/Resume_Sandile.pdf",
  goals: "To become a Software Engineer",
  age: calculateAge(birthDate),
  location: "I live in Pretoria, Gauteng, South Africa.",
  phone: "You can call me at +2773 490 8931",
  email: "Here is my email address: mabilisasandile@gmail.com",
  resume: "https://sandile-mabilisa.netlify.app/assets/Resume_Sandile.pdf"
};

app.post('/chat', (req, res) => {
  const question = req.body.message.toLowerCase();

  let reply = `I'm not sure how to answer that. You can <a href="${knowledgeBase.resume}" target="_blank" rel="noopener noreferrer">view/download my Resume</a>.`;

  if (question.includes("name")) reply = `My name is ${knowledgeBase.name}.`;
  else if (question.includes("skill")) reply = `My skills include: ${knowledgeBase.skills.join(", ")}.`;
  else if (question.includes("project")) reply = `I've worked on: ${knowledgeBase.projects.join(", ")}.`;
  else if (question.includes("education") || question.includes("qualification")) reply = `I studied ${knowledgeBase.education}.`;
  else if (question.includes("about") || question.includes("profile")) reply = knowledgeBase.about;
  else if (question.includes("goal") || question.includes("dream")) reply = knowledgeBase.goals;
  else if (question.includes("age") || question.includes("old")) reply = `I am ${knowledgeBase.age} years old`;
  else if (question.includes("location") || question.includes("address") || question.includes("live") || question.includes("stay")) reply = knowledgeBase.location;
  else if (question.includes("experience") || question.includes("work")) reply = knowledgeBase.experience;
  else if (question.includes("phone") || question.includes("contact")) reply = knowledgeBase.phone;
  else if (question.includes("email") || question.includes("message")) reply = knowledgeBase.email;
  else if (question.includes("resume") || question.includes("cv")) {
    reply = `You can <a href="${knowledgeBase.resume}" target="_blank" rel="noopener noreferrer">view/download my Resume here</a>.`;
  }


  res.json({ reply });
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
