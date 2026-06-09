import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password assets' });
  }

  try {
    const userExists = await db('users').where({ email }).first();
    if (userExists) {
      return res.status(400).json({ error: 'User registration identity already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [userId] = await db('users').insert({
      email,
      password: hashedPassword
    });

    res.status(201).json({
      id: userId,
      email,
      token: generateToken(userId, email)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server registration routine faulted' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide authentication parameters' });
  }

  try {
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: 'Invalid core credentials profile' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid core credentials profile' });
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      token: generateToken(user.id, user.email)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server validation routine faulted' });
  }
};