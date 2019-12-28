const Response = require('./response');

class ErrorResponse extends Response {
    constructor(statusCode, responseMessage, action) {
        super(statusCode, responseMessage);
        if (action) {
            this._action = action;
        }
    }
}

class NotAuthenticated extends ErrorResponse {
    constructor(action) {
        super(403, 'user not authenticated', action);
    }
}

class NotFound extends ErrorResponse {
    constructor(action) {
        super(404, 'resource not found', action);
    }
}

class InternalError extends ErrorResponse {
    constructor(action) {
        super(500, 'internal server error', action);
    }
}

module.exports = {
    ErrorResponse: ErrorResponse,
    NotAuthenticated: NotAuthenticated,
    NotFound: NotFound,
    InternalError: InternalError
};