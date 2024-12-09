import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Instructor from '../models/Instructor';
import { config } from '../config/config';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, full_name, role, phone } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const password_hash = await bcrypt.hash(password, 10);
      
      const user = new User({
        email,
        password_hash,
        full_name,
        role,
        phone
      });

      await user.save();

      if (role === 'instructor') {
        const instructor = new Instructor({
          user_id: user._id,
          bio: '',
          expertise: []
        });
        await instructor.save();
      }

      const token = jwt.sign({ userId: user._id }, config.jwt.secret, { expiresIn: '1h' });
      await sendVerificationEmail(email, token);

      res.status(201).json({ message: 'Registration successful. Please verify your email.' });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error });
      console.log(error)
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (!user.is_active) {
        return res.status(401).json({ message: 'Account is not active' });
      }

      user.last_login = new Date();
      await user.save();

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.json({ token, user: { 
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }});
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error });
    }
  }
  static loggedUser = async(req:Request,res:Response)=>{
     const authHeader = req.headers["authorization"];
     const token = authHeader && authHeader.split(" ")[1];

     if (!token) {
       return res
         .status(401)
         .json({ message: "Authentication token required" });
     }

     try {
       const decoded = jwt.verify(token, config.jwt.secret) as any;
       res.status(200).json({user:decoded})
 
     } catch (error) {
       return res.status(403).json({ message: "Invalid or expired token" });
     }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const token = jwt.sign({ userId: user._id }, config.jwt.secret, { expiresIn: '1h' });
      await sendPasswordResetEmail(email, token);

      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to process password reset request', error });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const password_hash = await bcrypt.hash(newPassword, 10);
      user.password_hash = password_hash;
      await user.save();

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      res.status(500).json({ message: 'Password reset failed', error });
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.query;
      
      const decoded = jwt.verify(token as string, config.jwt.secret) as any;
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.is_active = true;
      await user.save();

      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Email verification failed', error });
    }
  }
}