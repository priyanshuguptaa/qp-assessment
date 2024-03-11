export class ErrorFormat {
  timestamp: string;
  status: number;
  error: string;
  message: string | {};
  path: string;

  constructor(status: number, error: string, message: string | {}, path: string) {
    this.timestamp = new Date().toISOString();
    this.status = status;
    this.error = error;
    this.message = message;
    this.path = path;
  }
}

export const formatJOIError = (error: any) => {
  console.log("ERROR",error)

  let errorMessage = {};
  for (const err of error?.details) {
    const [field, message] = err.message?.match(/"(.*?)"\s(.*)/).slice(1);
    errorMessage[field] = message;
  }
  return errorMessage;
};
