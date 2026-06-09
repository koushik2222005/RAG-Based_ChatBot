import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import { register, login } from './controllers/authController.js';
import { uploadDocument } from './controllers/documentController.js';
import { handleChat } from './controllers/chatController.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// Base Middleware Initializations
app.use(cors({ origin: '*' }));
app.use(express.json());

// Synchronously assert folder existences to prevent runtime file failures
const uploadDir = './uploads';
const vectorDir = './vector_store';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(vectorDir)) fs.mkdirSync(vectorDir);

// File Handler Config Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Open Access Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Protected RAG Core Operations
app.post('/api/documents/upload', protect, upload.single('file'), uploadDocument);
app.post('/api/chat', protect, handleChat);

// Initialize Server Core Listeners
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing securely on node network port: ${PORT}`);
});