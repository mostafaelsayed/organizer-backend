import Reservation from '../../models/reservation/reservation';
import { util, utilOptions } from '../../config';
import {
  InternalErrorResponse,
  BadRequestErrorResponse,
} from '../../models/response/error';
import SuccessResponse from '../../models/response/success';
import { getUserByEmail } from '../user/user';
import User from '../../models/user/user';
import Response from '../../models/response/response';
import { ValidationError } from 'sequelize';
import { MyContext } from '../../models/my-context';

async function deleteReservationGraphql(args: User): Promise<Response> {
  const { email } = args;
  
  try {
    const user = await getUserByEmail(email);
    const id = user?.id;
    await Reservation.destroy({
      where: {
        userId: id
      }
    })

    console.log('reservations deleted!');

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

async function createReservationGraphql(args: Reservation, context: MyContext): Promise<Response> {
  const { name, description } = args;
  console.log('req: ', JSON.stringify(context.req.session));
  try {
    const reservation: Reservation = await Reservation.create({
      userId: context.req.session.user.id,
      name,
      description
    });

    return new SuccessResponse('create-reservation', { id: reservation.id});
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

export { deleteReservationGraphql, createReservationGraphql }