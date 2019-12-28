const Response = require('./response');

module.exports = class SuccessResponse extends Response {
    constructor(action, data) {
        super(200, 'success', data);

        if (action) {
            this._action = action;
        }
    }
}