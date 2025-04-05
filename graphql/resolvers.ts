import User from "../models/user/user";
import { loginGraphql, registerUserGraphql } from '../routes/user/user';

const resolvers = {
    Query: {
        loginUser: async (parent: any, args: User) => {return await loginGraphql(args)}
    },
    Mutation: {
        registerUser: async (parent: any, args: User) => {
            return await registerUserGraphql(args);
        }
    }
}

export { resolvers };