import User from "../models/user/user";
import { loginGraphql, registerUserGraphql, getAllUsers } from '../routes/user/user';

const resolvers = {
    Query: {
        loginUser: async (parent: any, args: User) => {return await loginGraphql(args)},
        getAllUsers: async (parent: any) => { return await getAllUsers() }
    },
    Mutation: {
        registerUser: async (parent: any, args: User) => {
            return await registerUserGraphql(args);
        }
    }
}

export { resolvers };