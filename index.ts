import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { PORT } from "./config";
import listRoute from "./routes/listednfts.routes";
import collectionRoute from "./routes/collection.routes";

// import uploadMusicRoute from "./routes/nfts.routes";
const app = express();
const port = PORT;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/nft", listRoute);
app.use("/collection", collectionRoute);

// MongoDB Connection
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.NODE_ENV_MONGO_URL!)
  .then(async () => {
    console.log("==========> Server is running! ⏲  <==========");
    app.listen(port, () => {
      console.log(`==========> Connected MongoDB 👌  <==========`);
    });
  })
  .catch((err) => {
    console.log("Cannot connect to the bot! 😩", err);
    process.exit();
  });

// Routes
app.get("/", (req, res) => {
  res.send("Server is running.👌");
});
