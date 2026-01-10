import { User } from "../models/models";
import bcrypt from 'bcryptjs';

export async function createBasicAuthUser(email: string, firstName: string | undefined, lastName: string | undefined, phoneNumber: string | undefined, password: string): Promise<User> {
    const salt: string = await bcrypt.genSalt(10);
    const passwordHash: string = await bcrypt.hash(password, salt);
    const user: User = await User.create({
        email,
        firstName,
        lastName,
        phoneNumber,
        passwordHash,
        authType: 'basic'
    });

    return user;
}

export async function createOauthUser(email: string, firstName: string | undefined, lastName: string | undefined, phoneNumber: string | undefined): Promise<User> {
    const user: User = await User.create({
        email,
        firstName,
        lastName,
        phoneNumber,
        authType: 'oauth'
    });

    return user;
}