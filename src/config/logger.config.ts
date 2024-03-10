import winston, { format, transports } from "winston";
import "winston-mongodb"



const logger = winston.createLogger({
  level: "debug",

  format: format.combine( format.timestamp(), format.json(), format.metadata()),

  transports: [
    new transports.MongoDB({
      db : process.env.MONGODB_URI as string,
      collection : "groceryLogs"
    })
  ],
});

export default logger;
