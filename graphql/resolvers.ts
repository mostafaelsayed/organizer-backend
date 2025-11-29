import User from "../models/user/user";
import { deleteReservationGraphql } from "../routes/reservation/reservation";
import { loginGraphql, registerUserGraphql, getAllUsers, deleteUserGraphql } from '../routes/user/user';

const resolvers = {
    Query: {
        registerUser: async (parent: any, args: User) => {
            return await registerUserGraphql(args);
        },
        deleteUser: async (parent: any, args: User) => {
            return await deleteUserGraphql(args);
        },
        deleteReservation: async (parent: any, args: User) => {
            return await deleteReservationGraphql(args);
        },
        loginUser: async (parent: any, args: User) => {return await loginGraphql(args)},
        getAllUsers: async (parent: any) => { return await getAllUsers() }
    }
}

export { resolvers };