const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connecting = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected MongoDB: ${connecting.connection.host}`);
  } catch (error) {
    console.log(`OOPS Error:  ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
