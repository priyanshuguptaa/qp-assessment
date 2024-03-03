import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";



import { AuthRouter, ProductRouter } from "./router";

// import config from "./config/environment.config"
// const {PORT} = config;
const PORT = process.env.PORT;

const server = express();

server.use(express.json({ limit: "1mb" }));
server.use(express.urlencoded({ extended: true, limit: "1mb" }));
server.use(fileUpload());
server.use(cookieParser())
server.use(express.static("public"));



server.use("/api/auth",AuthRouter);
server.use("/api/product",ProductRouter);

server.listen(PORT, () => {
  console.clear();
  console.log(`Server started at PORT : ${PORT}`);
});
