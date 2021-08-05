require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const mongoose = require("mongoose");

// App
app.use("/", (req, res) => {
  res.send("Hello");
});

app.use(express.json());
app.use(cors());

const connectDb = async () => {
  await mongoose.connect(
    process.env.MONGO_URL,
    {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, db) => {
      if (err) console.log(err);
      console.log("Connected to mongodb");
    }
  );
};

connectDb();

app.listen(PORT, () => console.log(`Server is running is ${PORT}`));
