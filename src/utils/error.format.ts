export class ErrorFormat {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;

  constructor(status: number, error: string, message: string, path: string) {
    this.timestamp = new Date().toISOString();
    this.status = status;
    this.error = error;
    this.message = message;
    this.path = path;
  }
}
