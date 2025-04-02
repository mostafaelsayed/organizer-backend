import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/user/user';
import { getToken } from '../../utils';
import { util, utilOptions } from '../../config';
import {
  NotAuthenticatedResponse,
  InternalErrorResponse,
} from '../../models/response/error';
import SuccessResponse from '../../models/response/success';

const router = Router(); 

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('7mada');
  try {
    const userRecord = await User.findOne({ where: { email } });
    if (!userRecord) {
      return new NotAuthenticatedResponse('login').sendResponse(res);
    }

    const user = userRecord.toJSON();
    const hash = userRecord.passwordHash;

    const isMatch = await bcrypt.compare(password, hash);
    if (isMatch) {
      const jwt = getToken(email, user.id);
      new SuccessResponse('login', { jwt }).sendResponse(res);
    } else {
      new NotAuthenticatedResponse('login').sendResponse(res);
    }
  } catch (error) {
    console.error('Error during login:', util.inspect(error, utilOptions));
    new InternalErrorResponse('login').sendResponse(res);
  }
});

router.post('/register', async (req, res) => {
  const { email, firstName, lastName, password, phoneNumber } = req.body;

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

    new SuccessResponse('register', { email: user.email }).sendResponse(res);
  } catch (error) {
    console.error('Error during registration:', util.inspect(error, utilOptions));
    new InternalErrorResponse('register').sendResponse(res);
  }
});

export default router;