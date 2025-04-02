class Response {
    private _statusCode: number;
    private _responseMessage: string;
    protected _data?: any;
  
    constructor(statusCode: number, responseMessage: string, data?: any) {
      this._statusCode = statusCode;
      this._responseMessage = responseMessage;
  
      if (data) {
        this._data = data;
      }
    }
  
    get statusCode(): number {
      return this._statusCode;
    }
  
    set statusCode(statusCode: number) {
      this._statusCode = statusCode;
    }
  
    get responseMessage(): string {
      return this._responseMessage;
    }
  
    set responseMessage(responseMessage: string) {
      this._responseMessage = responseMessage;
    }
  
    get data(): any {
      return this._data;
    }
  
    set data(data: any) {
      this._data = data;
    }
  
    get res(): { statusCode: number; responseMessage: string; data?: any } {
      return {
        statusCode: this._statusCode,
        responseMessage: this._responseMessage,
        data: this._data,
      };
    }
  
    sendResponse(response: any): void {
      response.status(this._statusCode).json(this._data);
    }
  }
  
  export default Response;