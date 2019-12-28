module.exports = class Response {
    // _statusCode = 200;
    // _responseMessage = 'success';
    // _data = {};

    constructor(statusCode, responseMessage, data) {
        this._statusCode = statusCode;
        this._responseMessage = responseMessage;
        
        if (data) {
            this._data = data;
        }
    }

    get statusCode() {
        return this._statusCode;
    }
    set statusCode(statusCode) {
        this._statusCode = statusCode;
    }
    
    get responseMessage() {
        return this._responseMessage;
    }
    set responseMessage(responseMessage) {
        this._responseMessage = responseMessage;
    }

    get data() {
        return this._data;
    }
    set data(data) {
        this._data = data;
    }

    get res() {
        return {
            statusCode: this._statusCode,
            responseMessage: this._responseMessage,
            data: this._data
        };
    }

    sendResponse(response) {
        response.status(this._statusCode).json(this._data);
    }
    
}