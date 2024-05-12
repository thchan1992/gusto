import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("DB error", err);
    process.exit(1);
  }
};

export default dbConnect;
