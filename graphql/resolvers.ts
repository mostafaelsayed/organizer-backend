import { Reservation } from "../models/models";
import { MyContext } from "../models/my-context";
import User from "../models/user/user";
import { createReservationGraphql } from "../routes/reservation/reservation";
import { loginGraphql, registerUserGraphql, getAllUsers, deleteUserGraphql, getUserReservations} from '../routes/user/user';

const resolvers = {
    Query: {
        registerUser: async (parent: any, args: User) => {
            return await registerUserGraphql(args);
        },
        deleteUser: async (parent: any, args: User) => {
            return await deleteUserGraphql(args);
        },
        // deleteReservation: async (parent: any, args: User) => {
        //     return await deleteReservationGraphql(args);
        // },
        getUserReservations: async (parent: any, args: any, context: MyContext) => {return await getUserReservations(context)},
        loginUser: async (parent: any, args: User, context: MyContext) => {return await loginGraphql(args, context)},
        getAllUsers: async (parent: any) => { return await getAllUsers() },
        createReservation: async (parent: any, args: Reservation, context: MyContext) => {return await createReservationGraphql(args, context)},
    }
}

export { resolvers };