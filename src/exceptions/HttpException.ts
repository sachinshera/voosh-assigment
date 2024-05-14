export class HttpException extends Error {
  public status: number;
  public message: string;
  public timestamp: Date;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.timestamp = new Date();
  }
}
