import nodemailer from 'nodemailer';
import { config } from '../config/config';

const transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: config.email.auth
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `http://localhost:5000/verify-email?token=${token}`;
  
  const mailOptions = {
    from: config.email.auth.user,
    to: email,
    subject: 'Email Verification',
    html: `
      <h1>Verify Your Email</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `
  };

  return transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  
  const mailOptions = {
    from: config.email.auth.user,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Reset Your Password</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 1 hour.</p>
    `
  };

  return transporter.sendMail(mailOptions);
};