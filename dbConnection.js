import mongoose from "mongoose";

class DBConnection {
  static async connect() {
    await mongoose
      .connect(
        "mongodb+srv://saurabharora393:cqWPz6R60GRBE8l0@cluster0.mbq8dhy.mongodb.net/?retryWrites=true&w=majority",
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
