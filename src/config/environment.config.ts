import dotEnv from "dotenv";

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./environments/.env.${process.env.NODE_ENV}`;
  console.log("configfile", configFile);

  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

export default {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
};
