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
import { deleteReservationGraphql } from '../../routes/reservation/reservation';
import { MyContext } from '../../models/my-context';

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

async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await User.findOne({
      where: {
        email
      }
    })
    return user;
  }
  catch(e) {
    console.error('error getting all users: ', e);
  }
  return null;
}

async function getUserReservations(context: MyContext) {
  try {
    if (!context.req.session.user) {
      return new NotAuthenticatedResponse('login');
    }
    const reservations = await Reservation.findAll({
      where: {
        userId: context.req.session.user.id
      }
    });

    const user = reservations[0] ? reservations[0].getUser() : undefined;

    return new SuccessResponse('userReservations', {user,reservations});
  }
  catch(error) {
    console.error('Error when getting user reservations:', util.inspect(error, utilOptions));
    return new InternalErrorResponse('userReservations');
  }
}

async function loginGraphql (args: User, context: MyContext) {
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
      context.req.session.user = userRecord;
      context.req.session.save();
      return new SuccessResponse('login', { jwt, ...userRecord.toJSON() });
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

async function deleteUserGraphql(args: User) {
  const { email } = args;
  
  try {
    await deleteReservationGraphql(args);
    const user = await getUserByEmail(email);
    await user?.destroy();

    console.log('user deleted!');

    return new SuccessResponse('delete', { email });
  }
  catch (error: unknown) {
    console.error('Error during delete:', util.inspect(error, utilOptions));
    if (error instanceof ValidationError) {
      return new BadRequestErrorResponse('delete', error.errors[0].message);
    }
    else {
      return new InternalErrorResponse('delete');
    }
  }
}

export { loginGraphql, registerUserGraphql, getAllUsers, deleteUserGraphql, getUserByEmail, getUserReservations }