import dns from "dns"
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);
import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function Connect() {
 
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, 
      maxPoolSize: 10,      
    };

    console.log("--- Establishing New MongoDB Connection ---");
    
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("--- MongoDB Connected Successfully ---");
      return mongoose;
    });
  }

  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; 
    console.error("--- MongoDB Connection Failed! ---", e);
    throw e;
  }

  return cached.conn;
}

export default Connect;
