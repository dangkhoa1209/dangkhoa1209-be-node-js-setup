import mongoose from "mongoose";

import { database } from "@config/index";
class MongoDBManager {
  constructor() {
    this.isConnected = false;

    // Kiểm tra nếu đã có một instance được tạo ra trước đó
    if (MongoDBManager.instance) {
      return MongoDBManager.instance;
    }

    MongoDBManager.instance = this;
  }

  async connect(callback) {
    try {
      await mongoose.connect(database.connectionString);
      this.isConnected = true;
      await callback();
    } catch (error) {
      console.error("Connect db error:", error);
    }
  }

  async disconnect() {
    try {
      if (!this.isConnected) {
        return;
      }

      await mongoose.disconnect();
      console.log("Disconnected db success");
    } catch (error) {
      console.error("Error disconnecting db:", error);
    }
  }
}

// Tạo một instance duy nhất của MongoDBManager
const instance = new MongoDBManager();

export default instance;
