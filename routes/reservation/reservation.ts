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

export { deleteReservationGraphql }