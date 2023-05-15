import mongoose from "mongoose";
import * as dotenv from 'dotenv'
dotenv.config();

class DBConnection {
  static async connect() {
    await mongoose
      .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.mbq8dhy.mongodb.net/?retryWrites=true&w=majority`,
        {
          keepAlive: true,
          useUnifiedTopology: true
        }
      )
      .then(() => {
        console.log("DB connected successfully");
        return true;
      })
      .catch((err) => {
        console.log("Errrr", err);
        return false;
      });
  }
}

DBConnection.connect();

export default DBConnection;
