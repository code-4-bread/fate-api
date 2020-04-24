import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const mongoManager = {
  async connect() {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  },
};

export default mongoManager;
