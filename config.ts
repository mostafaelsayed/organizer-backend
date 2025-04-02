import util from 'util';
import dbConnection from './database/connection';

export const utilOptions = { depth: null };
export const port = process.env.PORT || 4000;
export const secret = process.env.SECRET || '987fdgo1z09qjla0934lksdp0';

export { dbConnection, util };