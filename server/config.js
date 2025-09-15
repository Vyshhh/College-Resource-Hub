import dotenv from "dotenv";

dotenv.config();

// Export configs (with fallbacks if .env is missing)
export const MONGO_URI = process.env.MONGO_URI ;
export const JWT_SECRET = process.env.JWT_SECRET ;
export const PORT =5000;
