import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    let rawUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/makecv';
    const uri = rawUri.trim().replace(/^["']|["']$/g, '');

    const match = uri.match(/:\/\/([^:]+):([^@]+)@(.+)/);
    if (match) {
      const user = match[1];
      const pass = match[2];
      const host = match[3];
      console.log(`[DB Check] Connecting as user: "${user}", pass length: ${pass.length} (${pass.slice(0, 2)}...${pass.slice(-2)}), host: ${host}`);
    } else {
      console.log(`[DB Check] Connecting to URI without credentials: ${uri}`);
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
