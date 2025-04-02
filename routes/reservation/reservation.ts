import { Router } from 'express';
import Reservation from '../../models/reservation/reservation';
import { util, utilOptions } from '../../config';
import {
  NotFoundResponse,
  InternalErrorResponse,
} from '../../models/response/error';
import SuccessResponse from '../../models/response/success';

const router = Router();

router.get('/getAll', async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { userId: res.locals.user.id },
    });
    if (reservations.length > 0) {
      const data = reservations.map((e) => e.toJSON());
      new SuccessResponse('getting reservations', { reservations: data }).sendResponse(res);
    } else {
      new NotFoundResponse('getting reservations').sendResponse(res);
    }
  } catch (error) {
    console.error('Error fetching reservations:', util.inspect(error, utilOptions));
    new InternalErrorResponse('getting reservations').sendResponse(res);
  }
});

router.get('/get/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      where: { userId: res.locals.user.id, id: req.params.id },
    });
    if (reservation) {
      new SuccessResponse('getting one reservation', { reservation: reservation.toJSON() }).sendResponse(res);
    } else {
      new NotFoundResponse('getting one reservation').sendResponse(res);
    }
  } catch (error) {
    console.error('Error fetching reservation:', util.inspect(error, utilOptions));
    new InternalErrorResponse('getting one reservation').sendResponse(res);
  }
});

router.post('/add', async (req, res) => {
  try {
    const reservation = await Reservation.create({
      name: req.body.reservation.name,
      userId: res.locals.user.id,
    });
    new SuccessResponse('adding one reservation', { reservation: reservation.toJSON() }).sendResponse(res);
  } catch (error) {
    console.error('Error creating reservation:', util.inspect(error, utilOptions));
    new InternalErrorResponse('adding one reservation').sendResponse(res);
  }
});

router.post('/delete', async (req, res) => {
  try {
    const result = await Reservation.destroy({
      where: { userId: res.locals.user.id, id: req.body.reservationId },
    });
    if (result) {
      new SuccessResponse('deleting one reservation').sendResponse(res);
    } else {
      new NotFoundResponse('deleting one reservation').sendResponse(res);
    }
  } catch (error) {
    console.error('Error deleting reservation:', util.inspect(error, utilOptions));
    new InternalErrorResponse('deleting one reservation').sendResponse(res);
  }
});

export default router;