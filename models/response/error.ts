import Response from './response';

class ErrorResponse extends Response {
  private _action?: string;

  constructor(statusCode: number, responseMessage: string, action?: string) {
    super(statusCode, responseMessage);
    if (action) {
      this._action = action;
    }
  }
}

class NotAuthenticatedResponse extends ErrorResponse {
  constructor(action?: string) {
    super(403, 'user not authenticated', action);
  }
}

class NotFoundResponse extends ErrorResponse {
  constructor(action?: string) {
    super(404, 'resource not found', action);
  }
}

class InternalErrorResponse extends ErrorResponse {
  constructor(action?: string) {
    super(500, 'internal server error', action);
  }
}

export {
  ErrorResponse,
  NotAuthenticatedResponse,
  NotFoundResponse,
  InternalErrorResponse,
};