import express from "express";
import "dotenv/config";
import AuthRouter from "./router/auth.router"

// import config from "./config/environment.config"
// const {PORT} = config;
const PORT = process.env.PORT;

const server = express();

server.use(express.json({ limit: "1mb" }));
server.use(express.urlencoded({ extended: true, limit: "1mb" }));

server.use("/",(req,res,next)=>{
  console.log(req.path)
  next()
})

server.use("/api/auth",AuthRouter);
// server.use("/product");

server.listen(PORT, () => {
  console.clear();
  console.log(`Server started at PORT : ${PORT}`);
});
