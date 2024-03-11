import winston, { format, transports } from "winston";


const logger = winston.createLogger({
  level: "debug",

  format: format.combine( format.timestamp(), format.json(), format.metadata(),format.errors({ stack: true })),

  transports: [
    new transports.File({
      level:'error',
      filename : 'logs/errors.log'
    })
  ],
});

export default logger;
