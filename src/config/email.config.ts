import nodemailer from "nodemailer";

export const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error(
      "Email configuration missing: EMAIL_USER and EMAIL_PASSWORD are required"
    );
    throw new Error(
      "Email configuration missing: EMAIL_USER and EMAIL_PASS are required"
    );
  }

  const config = {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  console.log(
    `📧 Email transporter configured for: ${config.host}:${config.port}`
  );
  return nodemailer.createTransport(config);
};

export const emailProviders = {
  gmail: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
  },
};
