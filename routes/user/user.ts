import bcrypt from 'bcryptjs';
import User from '../../models/user/user';
import { getToken } from '../../utils';
import { util, utilOptions } from '../../config';
import {
  NotAuthenticatedResponse,
  InternalErrorResponse,
  BadRequestErrorResponse,
} from '../../models/response/error';
import SuccessResponse from '../../models/response/success';
import { ValidationError } from 'sequelize';

async function loginGraphql (args: User) {
  console.log('args: ', args);
  try {
    const userRecord = await User.findOne({ where: { email: args.email } });
    if (!userRecord) {
      return null;
    }

    const user = userRecord.toJSON();
    const hash = userRecord.passwordHash;

    const isMatch = await bcrypt.compare(args.password, hash);
    if (isMatch) {
      const jwt = getToken(args.email, user.id);
      return new SuccessResponse('login', { jwt, ...user });
    } else {
      return new NotAuthenticatedResponse('login');
    }
  } catch (error) {
    console.error('Error during login:', util.inspect(error, utilOptions));
    return new InternalErrorResponse('login');
  }
}

async function registerUserGraphql(args: User) {
  const { email, firstName, lastName, password, phoneNumber } = args;
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      firstName,
      lastName,
      phoneNumber,
      passwordHash: hash,
    });

    return new SuccessResponse('register', { email: user.email });
  }
  catch (error: unknown) {
    console.error('Error during registration:', util.inspect(error, utilOptions));
    if (error instanceof ValidationError) {
      return new BadRequestErrorResponse('register', error.errors[0].message);
    }
    else {
      return new InternalErrorResponse('register');
    }
  }
}

export { loginGraphql, registerUserGraphql }