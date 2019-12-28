const Response = require('./response');

class ErrorResponse extends Response {
    constructor(statusCode, responseMessage, action) {
        super(statusCode, responseMessage);
        if (action) {
            this._action = action;
        }
    }
}

class NotAuthenticatedResponse extends ErrorResponse {
    constructor(action) {
        super(403, 'user not authenticated', action);
    }
}

class NotFoundResponse extends ErrorResponse {
    constructor(action) {
        super(404, 'resource not found', action);
    }
}

class InternalErrorResponse extends ErrorResponse {
    constructor(action) {
        super(500, 'internal server error', action);
    }
}

module.exports = {
    ErrorResponse,
    NotAuthenticatedResponse,
    NotFoundResponse,
    InternalErrorResponse
};