import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const isDbConnected = () => mongoose.connection.readyState === 1;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('MONGODB_URI is not set. Starting server without a database connection.');
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('MongoDB connected');
    return true;

  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return false;
  }
};

export default connectDB;
