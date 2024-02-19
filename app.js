const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to my dashboard!');
});

// Allow requests from http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

app.options('/submit-form', cors());

// Send the email
app.post('/submit-form', async (req, res) => {
  // Assuming the form includes 'email' and 'message' fields
  const { FormData } = req.body;
  const userName = FormData.name;
  const userEmail = FormData.email;
  const userSubject = FormData.subject;
  const userMessage = FormData.message;

  //View form data
  console.log("FormData: ", FormData);

  // Replace with your email provider and credentials
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
    // Optionally, you can handle success or show a confirmation message
    res.send('Email sent successfully');
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    // Handle error, show error message, etc.
    res.status(500).send('Error sending email');
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
