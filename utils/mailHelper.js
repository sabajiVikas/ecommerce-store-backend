const nodemailer = require("nodemailer");

const mailHelper = async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const message = {
    from: "ecommerce@dev.dev",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(message);
};

module.exports = mailHelper;
