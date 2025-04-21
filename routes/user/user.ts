import bcrypt from 'bcryptjs';
import { getToken } from '../../utils';
import { util, utilOptions } from '../../config';
import {
  NotAuthenticatedResponse,
  InternalErrorResponse,
  BadRequestErrorResponse,
} from '../../models/response/error';
import SuccessResponse from '../../models/response/success';
import { ValidationError } from 'sequelize';
import Response from '../../models/response/response';
import { Reservation, User } from '../../models/models';

async function getAllUsers(): Promise<Response> {
  try {
    const users = await User.findAll();
    return new SuccessResponse('get users', users);
  }
  catch(e) {
    console.error('error getting all users: ', e);
    return new InternalErrorResponse('get users');
  }
}

async function loginGraphql (args: User) {
  console.log('args: ', args);
  try {
    const userRecord: User | null = await User.findOne({ where: { email: args.email } });
    if (!userRecord) {
      return null;
    }

    const hash: string = userRecord.passwordHash;
    const reservations: Reservation[] = await userRecord.getReservations();

    const isMatch: boolean = await bcrypt.compare(args.password, hash);
    if (isMatch) {
      const jwt: string = getToken(args.email, userRecord.id);
      return new SuccessResponse('login', { jwt, ...userRecord.toJSON(), reservations });
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
    const salt: string = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(password, salt);

    const user: User = await User.create({
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

export { loginGraphql, registerUserGraphql, getAllUsers }