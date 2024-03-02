import express from "express";
import "dotenv/config";

// import config from "./config/environment.config"
// const {PORT} = config;
const PORT = process.env.PORT;

const server = express();

server.get("/", (req, res) => {
  res.send(" Server is running");
});

server.listen(PORT, () => {
  console.clear();
  console.log(`Server started at PORT : ${PORT}`);
});
