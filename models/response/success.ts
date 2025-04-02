import Response from './response';

class SuccessResponse extends Response {
  private _action: string;
  
  constructor(action: string, data?: any) {
    super(200, 'success');
    this._action = action;
    this._data = data;
  }

  get action(): string | undefined {
    return this._action;
  }

  set action(action: string) {
    this._action = action;
  }

  get data(): any {
    return this._data;
  }
}

export default SuccessResponse;